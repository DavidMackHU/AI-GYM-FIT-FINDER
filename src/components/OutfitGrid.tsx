import type { Product, OutfitRecommendation } from '../types/product';
import ProductCard from './ProductCard';

interface OutfitGridProps {
  outfit: OutfitRecommendation;
  getProduct: (id: string) => Product | undefined;
}

export default function OutfitGrid({ outfit, getProduct }: OutfitGridProps) {
  const slots = [
    { key: 'top', data: outfit.top },
    { key: 'bottom', data: outfit.bottom },
    { key: 'shoes', data: outfit.shoes },
    { key: 'accessory', data: outfit.accessory },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6">
      {slots.map(({ key, data }) => {
        const product = getProduct(data.id);
        if (!product) return null;
        return (
          <ProductCard key={key} product={product} reason={data.reason} />
        );
      })}
    </div>
  );
}
