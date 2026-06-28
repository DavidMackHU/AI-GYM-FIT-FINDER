import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductById } from '../utils/catalog';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const FAV_KEY = 'fenix_favorites';

function readFavIds(): string[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]'); }
  catch { return []; }
}

export default function Favorites() {
  const navigate = useNavigate();
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    setFavIds(readFavIds());

    // Refresh when another tab or component updates favorites
    const onStorage = () => setFavIds(readFavIds());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const products = favIds.map((id) => getProductById(id)).filter(Boolean) as ReturnType<typeof getProductById>[];

  const clearAll = () => {
    localStorage.setItem(FAV_KEY, '[]');
    setFavIds([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 pt-24 pb-16 max-w-5xl mx-auto w-full">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[#FF6B00] text-xs font-medium tracking-[0.2em] uppercase mb-2">
              SAVED
            </p>
            <h1 className="text-white text-2xl font-medium">Your Favorites</h1>
            <p className="text-[#555555] text-sm mt-1">
              {products.length} item{products.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {products.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[#555555] hover:text-white text-xs underline underline-offset-4 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl">♡</span>
            <p className="text-[#555555] text-sm">No favorites yet.</p>
            <p className="text-[#555555] text-xs">
              Tap the heart on any product to save it here.
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="mt-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product!.id} product={product!} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-[#555555] text-sm mb-4">
                Want a full AI-matched outfit?
              </p>
              <button
                onClick={() => navigate('/quiz')}
                className="bg-[#FF6B00] hover:bg-[#e05e00] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Get My AI Fit →
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
