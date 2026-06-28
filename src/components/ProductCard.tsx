import { useState } from 'react';
import type { Product } from '../types/product';

const FAV_KEY = 'fenix_favorites';

function readFavs(): string[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]'); } catch { return []; }
}

const categoryLabels: Record<Product['category'], string> = {
  top: 'TOP',
  bottom: 'BOTTOM',
  shoes: 'SHOES',
  accessory: 'ACCESSORY',
};

interface ProductCardProps {
  product: Product;
  reason?: string;
  onRefresh?: () => void;
  secondaryAction?: { label: string; onClick: () => void };
}

export default function ProductCard({ product, reason, onRefresh, secondaryAction }: ProductCardProps) {
  const [isFav, setIsFav] = useState(() => readFavs().includes(product.id));

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = readFavs();
    const next = isFav ? favs.filter((id) => id !== product.id) : [...favs, product.id];
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setIsFav(!isFav);
  };

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden flex flex-col relative">
      {/* Best Value badge */}
      {product.price < 30 && (
        <span className="absolute top-2 left-2 z-10 bg-[#FF6B00] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          Best Value
        </span>
      )}

      {/* Favorite button */}
      <button
        onClick={toggleFav}
        aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
        className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-[#0D0D0D]/70 hover:bg-[#0D0D0D] transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          strokeWidth={2}
          className={`w-4 h-4 transition-colors ${isFav ? 'fill-[#FF6B00] stroke-[#FF6B00]' : 'fill-none stroke-[#888888]'}`}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Image */}
      <div className="aspect-square bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl select-none">
            {product.category === 'top' ? '👕' :
             product.category === 'bottom' ? '👖' :
             product.category === 'shoes' ? '👟' : '🎒'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-[#FF6B00] text-[11px] font-medium tracking-[0.1em]">
          {categoryLabels[product.category]}
        </span>
        <h3 className="text-white text-sm font-medium leading-snug">{product.name}</h3>
        <p className="text-[#FF6B00] text-sm font-semibold">${product.price}</p>
        {reason && (
          <p className="text-[#555555] text-xs leading-relaxed flex-1">{reason}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => console.log(`[Fenix] Shop clicked: ${product.id}`)}
            className="flex-1 block text-center bg-[#FF6B00] hover:bg-[#e05e00] text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors duration-150"
          >
            Shop This →
          </a>
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Try a different item"
              className="w-11 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222222] text-[#888888] hover:text-white rounded-xl transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          )}
        </div>

        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="w-full text-center border border-[#333333] hover:border-[#FF6B00] text-[#888888] hover:text-white text-xs py-2 rounded-xl transition-colors mt-1"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
