import Anthropic from '@anthropic-ai/sdk';
import type { Product, QuizAnswers, OutfitRecommendation } from '../types/product';

const budgetLabels: Record<QuizAnswers['budget'], string> = {
  'under-50': 'Under $50 per item',
  '50-100': '$50–$100 per item',
  '100-200': '$100–$200 per item',
  'no-limit': 'No budget limit',
};

export async function getOutfitRecommendation(
  answers: QuizAnswers,
  products: Product[]
): Promise<OutfitRecommendation> {
  // Client-side API call per MVP spec (no backend). Key is exposed via Vite env.
  const client = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const userPrompt = `User profile:
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

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system:
      'You are a gym outfit stylist for Fenix Fit Finder. You always respond with valid JSON only. No markdown. No explanation outside the JSON.',
    messages: [{ role: 'user', content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude');

  return JSON.parse(content.text) as OutfitRecommendation;
}
