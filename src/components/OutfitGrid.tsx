import type { Product, OutfitRecommendation } from '../types/product';
import ProductCard from './ProductCard';

interface OutfitGridProps {
  outfit: OutfitRecommendation;
  getProduct: (id: string) => Product | undefined;
  onRefresh?: (category: Product['category']) => void;
}

export default function OutfitGrid({ outfit, getProduct, onRefresh }: OutfitGridProps) {
  const slots = [
    { key: 'top' as const, data: outfit.top },
    { key: 'bottom' as const, data: outfit.bottom },
    { key: 'shoes' as const, data: outfit.shoes },
    { key: 'accessory' as const, data: outfit.accessory },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6">
      {slots.map(({ key, data }) => {
        const product = getProduct(data.id);
        if (!product) return null;
        return (
          <ProductCard
            key={key}
            product={product}
            reason={data.reason}
            onRefresh={onRefresh ? () => onRefresh(key) : undefined}
          />
        );
      })}
    </div>
  );
}
