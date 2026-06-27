import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { QuizAnswers } from '../src/types/product';

const budgetLabels: Record<QuizAnswers['budget'], string> = {
  'under-50': 'Under $50 per item',
  '50-100': '$50–$100 per item',
  '100-200': '$100–$200 per item',
  'no-limit': 'No budget limit',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, products } = req.body as {
    answers: QuizAnswers;
    products: unknown[];
  };

  if (!answers || !products) {
    return res.status(400).json({ error: 'Missing answers or products' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing API key' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction:
      'You are a gym outfit stylist for Fenix Fit Finder. You always respond with valid JSON only. No markdown. No explanation outside the JSON.',
  });

  const prompt = `User profile:
- Workout type: ${answers.workout}
- Budget per item: ${budgetLabels[answers.budget]}
- Style vibe: ${answers.style}
- Gender: ${answers.gender}
- Fit preference: ${answers.fit}

Product catalog:
${JSON.stringify(products)}

Select exactly 4 products: one top, one bottom, one pair of shoes, and one accessory.

Rules:
- Each product must match the user's gender field (contains "${answers.gender}" or "unisex")
- No product price may exceed the user's budget ceiling
- Prioritize workout type and style vibe as primary filters
- Choose the best combination that looks cohesive together

Respond ONLY with this exact JSON structure:
{
  "top":       { "id": "...", "reason": "one sentence why this top fits the user" },
  "bottom":    { "id": "...", "reason": "one sentence why" },
  "shoes":     { "id": "...", "reason": "one sentence why" },
  "accessory": { "id": "...", "reason": "one sentence why" }
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  res.json(JSON.parse(cleaned));
}
