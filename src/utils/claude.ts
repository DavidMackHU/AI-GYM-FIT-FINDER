import { GoogleGenerativeAI } from '@google/generative-ai';
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
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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

  // Strip markdown code fences if Gemini wraps the JSON
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  return JSON.parse(cleaned) as OutfitRecommendation;
}
