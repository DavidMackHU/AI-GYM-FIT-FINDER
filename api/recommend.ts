import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import type { QuizAnswers } from '../src/types/product.js';

// ─── Allowed values (whitelist) ──────────────────────────────────────────────
const ALLOWED: Record<keyof QuizAnswers, Set<string>> = {
  workout: new Set(['lifting', 'cardio', 'hiit', 'yoga', 'general-gym']),
  budget:  new Set(['under-50', '50-100', '100-200', 'no-limit']),
  style:   new Set(['minimal', 'bold', 'all-black', 'colorful']),
  gender:  new Set(['men', 'women', 'unisex']),
  fit:     new Set(['slim', 'regular', 'oversized']),
};

function validateAnswers(raw: unknown): QuizAnswers | null {
  if (!raw || typeof raw !== 'object') return null;
  const a = raw as Record<string, unknown>;
  for (const [key, allowed] of Object.entries(ALLOWED)) {
    if (typeof a[key] !== 'string' || !allowed.has(a[key] as string)) return null;
  }
  return a as unknown as QuizAnswers;
}

// ─── In-memory rate limiter ───────────────────────────────────────────────────
// Resets per cold-start; prevents burst abuse within a single serverless instance.
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;        // max requests
const RATE_WINDOW = 60_000;  // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

// ─── Budget labels ────────────────────────────────────────────────────────────
const budgetLabels: Record<QuizAnswers['budget'], string> = {
  'under-50':   'Under $50 per item',
  '50-100':     '$50–$100 per item',
  '100-200':    '$100–$200 per item',
  'no-limit':   'No budget limit',
};

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — only allow requests from wearfenix.com (and localhost for dev)
  const origin = req.headers.origin ?? '';
  const allowed = ['https://wearfenix.com', 'http://localhost:5173', 'http://localhost:4173'];
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit by IP
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ??
    req.socket.remoteAddress ??
    'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  // Validate answers (whitelist)
  const answers = validateAnswers(req.body?.answers);
  if (!answers) {
    return res.status(400).json({ error: 'Invalid quiz answers.' });
  }

  // Validate products (must be array, reasonable size)
  const products: unknown[] = Array.isArray(req.body?.products) ? req.body.products : [];
  if (products.length === 0 || products.length > 200) {
    return res.status(400).json({ error: 'Invalid product catalog.' });
  }

  // Optional locked product — only use name and category, never trust the full object
  const lp = req.body?.lockedProduct;
  const lockedProduct = lp && typeof lp.name === 'string' && typeof lp.category === 'string'
    ? { name: String(lp.name).slice(0, 120), category: String(lp.category).slice(0, 20) }
    : null;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server misconfigured.' });

  const groq = new Groq({ apiKey });

  // Pre-filter and slim down products before sending to AI to stay under token limit
  const budgetCeiling: Record<QuizAnswers['budget'], number> = {
    'under-50': 50, '50-100': 100, '100-200': 200, 'no-limit': Infinity,
  };
  const ceiling = budgetCeiling[answers.budget];

  type SlimProduct = { id: string; category: string; name: string; price: number; gender: string[]; style: string[]; workout: string[]; fit: string[] };
  const slimProducts: SlimProduct[] = (products as SlimProduct[])
    .filter(p =>
      p.price <= ceiling &&
      Array.isArray(p.gender) &&
      (p.gender.includes(answers.gender) || p.gender.includes('unisex'))
    )
    .map(({ id, category, name, price, gender, style, workout, fit }) =>
      ({ id, category, name, price, gender, style, workout, fit })
    );

  const lockedNote = lockedProduct
    ? `\nThe user wants outfits that complement: "${lockedProduct.name}" (${lockedProduct.category}). Pick the best items for the other slots to go with it.\n`
    : '';

  // Use whitelisted values directly — safe to interpolate
  const prompt = `User profile:
- Workout type: ${answers.workout}
- Budget per item: ${budgetLabels[answers.budget]}
- Style vibe: ${answers.style}
- Gender: ${answers.gender}
- Fit preference: ${answers.fit}
${lockedNote}
Product catalog:
${JSON.stringify(slimProducts)}

Create 3 complete, distinct gym outfits for this user. Each outfit must include exactly one top, one bottom, one pair of shoes, and one accessory.

Rules:
- Every product must match the user's gender field (contains "${answers.gender}" or "unisex")
- No product price may exceed the user's budget ceiling
- Prioritize workout type and style vibe as primary filters
- Each outfit must feel cohesive and complete on its own
- The 3 outfits should offer real variety — different color stories, silhouettes, or vibe intensity
- Never reuse the same product ID across more than one outfit
- Each reason must be one concise sentence specific to that outfit's overall look

Respond ONLY with this exact JSON structure (no markdown, no explanation):
{
  "outfits": [
    {
      "top":       { "id": "...", "reason": "one sentence why" },
      "bottom":    { "id": "...", "reason": "one sentence why" },
      "shoes":     { "id": "...", "reason": "one sentence why" },
      "accessory": { "id": "...", "reason": "one sentence why" }
    },
    {
      "top":       { "id": "...", "reason": "one sentence why" },
      "bottom":    { "id": "...", "reason": "one sentence why" },
      "shoes":     { "id": "...", "reason": "one sentence why" },
      "accessory": { "id": "...", "reason": "one sentence why" }
    },
    {
      "top":       { "id": "...", "reason": "one sentence why" },
      "bottom":    { "id": "...", "reason": "one sentence why" },
      "shoes":     { "id": "...", "reason": "one sentence why" },
      "accessory": { "id": "...", "reason": "one sentence why" }
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          'You are a gym outfit stylist for Fenix Fit Finder. You always respond with valid JSON only. No markdown. No explanation outside the JSON.',
      },
      { role: 'user', content: prompt },
    ],
    max_tokens: 1536,
    temperature: 0.4,
  });

  const text = completion.choices[0].message.content ?? '';
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch {
    console.error('[Fenix] Groq returned malformed JSON:', cleaned.slice(0, 200));
    res.status(502).json({ error: 'AI returned an unexpected response. Please try again.' });
  }
}
