import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { QuizAnswers, OutfitRecommendation } from '../types/product';
import { catalog, getProductById } from '../utils/catalog';
import { getOutfitRecommendation } from '../utils/claude';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import OutfitGrid from '../components/OutfitGrid';

const workoutLabels: Record<QuizAnswers['workout'], string> = {
  lifting: 'lifting',
  cardio: 'cardio',
  hiit: 'CrossFit/HIIT',
  yoga: 'yoga',
  'general-gym': 'gym',
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers as QuizAnswers | undefined;

  const [outfit, setOutfit] = useState<OutfitRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!answers) {
      navigate('/quiz');
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) setError('Request timed out. Please try again.');
    }, 15000);

    getOutfitRecommendation(answers, catalog)
      .then((result) => {
        if (!cancelled) {
          clearTimeout(timeout);
          setOutfit(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          clearTimeout(timeout);
          console.error('[Fenix] Claude API error:', err);
          setError('Something went wrong. Please try again.');
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [answers, navigate]);

  if (!answers) return null;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-[#888888] text-sm">{error}</p>
          <button
            onClick={() => navigate('/quiz')}
            className="bg-[#FF6B00] hover:bg-[#e05e00] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!outfit) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 pt-24 pb-12 max-w-2xl mx-auto w-full">
        <div className="mb-8 text-center">
          <p className="text-[#FF6B00] text-xs font-medium tracking-[0.2em] uppercase mb-2">
            YOUR FIT
          </p>
          <h1 className="text-white text-2xl font-medium">
            Built for your {workoutLabels[answers.workout]} session
          </h1>
        </div>

        <OutfitGrid outfit={outfit} getProduct={getProductById} />

        <p className="text-[#555555] text-xs italic text-center mt-6">
          As an Amazon Associate, Fenix earns from qualifying purchases.
        </p>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/quiz')}
            className="text-[#888888] hover:text-white text-sm underline underline-offset-4 transition-colors cursor-pointer"
          >
            ← Start Over
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
