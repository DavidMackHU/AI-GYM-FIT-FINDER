import type { Product, QuizAnswers, OutfitRecommendations } from '../types/product';

export async function getOutfitRecommendation(
  answers: QuizAnswers,
  products: Product[],
  lockedProduct?: Product
): Promise<OutfitRecommendations> {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, products, lockedProduct: lockedProduct ?? null }),
  });

  if (!res.ok) {
    throw new Error(`Recommendation failed (${res.status})`);
  }

  return res.json() as Promise<OutfitRecommendations>;
}
