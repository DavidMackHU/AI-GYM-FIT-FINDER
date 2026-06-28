import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { QuizAnswers, OutfitRecommendation, OutfitRecommendations, Product } from '../types/product';
import { catalog, getProductById } from '../utils/catalog';
import { getOutfitRecommendation } from '../utils/claude';
import { pushHistory } from '../utils/history';
import { findAlternative } from '../utils/alternatives';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import OutfitGrid from '../components/OutfitGrid';

const workoutLabels: Record<QuizAnswers['workout'], string> = {
  lifting: 'lifting', cardio: 'cardio', hiit: 'CrossFit/HIIT', yoga: 'yoga', 'general-gym': 'gym',
};

const VALID: Record<keyof QuizAnswers, Set<string>> = {
  workout: new Set(['lifting', 'cardio', 'hiit', 'yoga', 'general-gym']),
  budget:  new Set(['under-50', '50-100', '100-200', 'no-limit']),
  style:   new Set(['minimal', 'bold', 'all-black', 'colorful']),
  gender:  new Set(['men', 'women', 'unisex']),
  fit:     new Set(['slim', 'regular', 'oversized']),
};

function decodeAnswers(encoded: string): QuizAnswers | null {
  try {
    const parsed = JSON.parse(atob(encoded));
    if (!parsed || typeof parsed !== 'object') return null;
    for (const [key, allowed] of Object.entries(VALID)) {
      if (typeof parsed[key] !== 'string' || !allowed.has(parsed[key])) return null;
    }
    return parsed as QuizAnswers;
  } catch {
    return null;
  }
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  // Support shared links: /results?q=BASE64ANSWERS
  const searchParams = new URLSearchParams(location.search);
  const answers: QuizAnswers | undefined =
    location.state?.answers ?? decodeAnswers(searchParams.get('q') ?? '') ?? undefined;
  const lockedProduct: Product | undefined = location.state?.lockedProduct;

  const [recommendations, setRecommendations] = useState<OutfitRecommendations | null>(null);
  const [overrides, setOverrides] = useState<Record<number, Partial<OutfitRecommendation>>>({});
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!answers) { navigate('/quiz'); return; }
    let cancelled = false;
    const timeout = setTimeout(() => { if (!cancelled) setError('Request timed out. Please try again.'); }, 25000);

    getOutfitRecommendation(answers, catalog, lockedProduct)
      .then((result) => {
        if (cancelled) return;
        clearTimeout(timeout);
        // If a locked product was passed, force it into its slot in all outfits
        if (lockedProduct) {
          const slot = { id: lockedProduct.id, reason: `You chose this ${lockedProduct.category} to style around.` };
          result = { outfits: result.outfits.map(o => ({ ...o, [lockedProduct.category]: slot })) };
        }
        setRecommendations(result);
        pushHistory(answers, result.outfits);
      })
      .catch((err) => {
        if (cancelled) return;
        clearTimeout(timeout);
        console.error('[Fenix] Groq API error:', err);
        setError('Something went wrong. Please try again.');
      });

    return () => { cancelled = true; clearTimeout(timeout); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!answers) return null;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-[#888888] text-sm">{error}</p>
          <button onClick={() => navigate('/quiz')} className="bg-[#FF6B00] hover:bg-[#e05e00] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations) return <LoadingScreen />;

  const outfits = recommendations.outfits ?? [];
  const rawOutfit = outfits[activeTab] ?? outfits[0];
  const activeOutfit: OutfitRecommendation = { ...rawOutfit, ...overrides[activeTab] };

  // Running price total
  const totalPrice = (['top', 'bottom', 'shoes', 'accessory'] as const).reduce((sum, slot) => {
    const p = getProductById(activeOutfit[slot].id);
    return sum + (p?.price ?? 0);
  }, 0);

  // All used IDs across all outfits (for refresh exclusion)
  const allUsedIds = new Set(
    outfits.flatMap(o => [o.top.id, o.bottom.id, o.shoes.id, o.accessory.id])
  );
  Object.values(overrides).forEach(ov => Object.values(ov).forEach(v => v && allUsedIds.add((v as { id: string }).id)));

  const handleRefresh = (category: Product['category']) => {
    if (!answers) return;
    const alt = findAlternative(category, answers, allUsedIds);
    if (!alt) return;
    setOverrides(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [category]: alt } }));
  };

  const handleShare = () => {
    const encoded = btoa(JSON.stringify(answers));
    const url = `${window.location.origin}/results?q=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 pt-24 pb-12 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-[#FF6B00] text-xs font-medium tracking-[0.2em] uppercase mb-2">YOUR FITS</p>
          <h1 className="text-white text-2xl font-medium">
            {lockedProduct
              ? `Styled around your ${lockedProduct.category}`
              : `Built for your ${workoutLabels[answers.workout]} session`}
          </h1>
          <p className="text-[#555555] text-sm mt-1">{outfits.length} complete outfits — pick your favorite</p>
        </div>

        {/* Locked product banner */}
        {lockedProduct && (
          <div className="mb-4 px-4 py-3 bg-[#111111] border border-[#FF6B00]/30 rounded-xl text-xs text-[#888888]">
            🔒 Locked: <span className="text-white">{lockedProduct.name}</span>
          </div>
        )}

        {/* Outfit tabs */}
        <div className="flex gap-2 mb-4">
          {outfits.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                activeTab === i ? 'bg-[#FF6B00] text-white' : 'bg-[#1a1a1a] text-[#888888] hover:text-white hover:bg-[#222222]'
              }`}
            >
              Outfit {i + 1}
            </button>
          ))}
        </div>

        {/* Running total + share */}
        <div className="flex items-center justify-between mb-5 px-1">
          <div>
            <span className="text-[#555555] text-xs">Outfit total </span>
            <span className="text-white text-sm font-semibold">${totalPrice}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-[#888888] hover:text-white text-xs transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            {copied ? 'Link copied!' : 'Share this fit'}
          </button>
        </div>

        {/* Outfit grid */}
        {activeOutfit ? (
          <OutfitGrid outfit={activeOutfit} getProduct={getProductById} onRefresh={handleRefresh} />
        ) : (
          <p className="text-[#555555] text-center text-sm">No outfit available.</p>
        )}

        <p className="text-[#555555] text-xs italic text-center mt-6">
          As an Amazon Associate, Fenix earns from qualifying purchases.
        </p>

        <div className="flex justify-center mt-8">
          <button onClick={() => navigate('/quiz')} className="text-[#888888] hover:text-white text-sm underline underline-offset-4 transition-colors cursor-pointer">
            ← Start Over
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
