import type { Product, QuizAnswers } from '../types/product';
import { catalog } from './catalog';

const BUDGET_MAX: Record<QuizAnswers['budget'], number> = {
  'under-50': 50,
  '50-100': 100,
  '100-200': 200,
  'no-limit': 9999,
};

export function findAlternative(
  category: Product['category'],
  answers: QuizAnswers,
  usedIds: Set<string>
): { id: string; reason: string } | null {
  const max = BUDGET_MAX[answers.budget];
  const candidates = catalog.filter(
    (p) =>
      p.category === category &&
      (p.gender.includes(answers.gender) || p.gender.includes('unisex')) &&
      p.price <= max &&
      !usedIds.has(p.id)
  );
  if (!candidates.length) return null;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return { id: pick.id, reason: 'Refreshed pick — a fresh option for variety.' };
}
