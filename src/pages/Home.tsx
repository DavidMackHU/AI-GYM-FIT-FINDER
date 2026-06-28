import { useNavigate } from 'react-router-dom';
import { getProductById } from '../utils/catalog';
import { getHistory } from '../utils/history';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

// Hand-curated staff picks — update IDs to highlight your best products
const STAFF_PICK_IDS = [
  'top-001', 'top-007', 'bot-003', 'bot-010',
  'shoe-002', 'shoe-008', 'acc-001', 'acc-006',
];

const workoutLabels: Record<string, string> = {
  lifting: 'Lifting', cardio: 'Cardio', hiit: 'HIIT', yoga: 'Yoga', 'general-gym': 'General Gym',
};

export default function Home() {
  const navigate = useNavigate();
  const history = getHistory();
  const lastFit = history[0] ?? null;

  const staffPicks = STAFF_PICK_IDS
    .map((id) => getProductById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductById>>[];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <Navbar />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 pt-24 pb-12">
        <div className="max-w-lg w-full mx-auto text-center mb-16">
          <p className="text-[#FF6B00] text-xs font-medium tracking-[0.2em] uppercase mb-6">
            Powered by AI
          </p>
          <h1 className="text-white text-4xl sm:text-5xl font-medium leading-tight mb-5">
            Your next gym fit.{' '}
            <span className="text-[#FF6B00]">Built for how you move.</span>
          </h1>
          <p className="text-[#888888] text-base mb-10 leading-relaxed">
            Answer 5 quick questions. Get 3 complete outfits matched to your workout and style.
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-medium text-base px-8 py-4 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            Find My Fit →
          </button>
          <p className="text-[#555555] text-xs mt-6">
            Free · No account needed · 30 seconds
          </p>
        </div>

        {/* Last fit banner */}
        {lastFit && (
          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[#FF6B00] text-xs font-medium tracking-[0.2em] uppercase">
                  YOUR LAST FIT
                </p>
                <p className="text-white text-sm mt-0.5">
                  {workoutLabels[lastFit.answers.workout]} · {lastFit.answers.style} · {lastFit.answers.gender}
                </p>
              </div>
              <button
                onClick={() => navigate('/results', { state: { answers: lastFit.answers } })}
                className="text-[#FF6B00] hover:text-[#e05e00] text-xs font-medium transition-colors"
              >
                Rebuild fit →
              </button>
            </div>
          </div>
        )}

        {/* Staff picks */}
        {staffPicks.length > 0 && (
          <div className="w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#FF6B00] text-xs font-medium tracking-[0.2em] uppercase mb-1">
                  STAFF PICKS
                </p>
                <h2 className="text-white text-lg font-medium">Editor's Favorites</h2>
              </div>
              <button
                onClick={() => navigate('/catalog')}
                className="text-[#888888] hover:text-white text-xs transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {staffPicks.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
