import type { Product, QuizAnswers, OutfitRecommendation } from '../types/product';

export async function getOutfitRecommendation(
  answers: QuizAnswers,
  products: Product[]
): Promise<OutfitRecommendation> {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, products }),
  });

  if (!res.ok) {
    throw new Error(`Recommendation failed (${res.status})`);
  }

  return res.json() as Promise<OutfitRecommendation>;
}
