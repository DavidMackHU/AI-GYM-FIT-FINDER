import type { QuizAnswers, OutfitRecommendation } from '../types/product';

const KEY = 'fenix_history';

export interface HistoryEntry {
  id: string;
  answers: QuizAnswers;
  outfits: OutfitRecommendation[];
  timestamp: number;
}

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function pushHistory(answers: QuizAnswers, outfits: OutfitRecommendation[]): void {
  try {
    const prev = getHistory();
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      answers,
      outfits,
      timestamp: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify([entry, ...prev].slice(0, 3)));
  } catch {}
}
