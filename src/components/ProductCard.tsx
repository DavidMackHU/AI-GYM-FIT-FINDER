import type { Product } from '../types/product';

const categoryLabels: Record<Product['category'], string> = {
  top: 'TOP',
  bottom: 'BOTTOM',
  shoes: 'SHOES',
  accessory: 'ACCESSORY',
};

interface ProductCardProps {
  product: Product;
  reason: string;
}

export default function ProductCard({ product, reason }: ProductCardProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden flex flex-col">
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

      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-[#FF6B00] text-[11px] font-medium tracking-[0.1em]">
          {categoryLabels[product.category]}
        </span>
        <h3 className="text-white text-sm font-medium leading-snug">{product.name}</h3>
        <p className="text-[#FF6B00] text-sm font-semibold">${product.price}</p>
        <p className="text-[#555555] text-xs leading-relaxed flex-1">{reason}</p>
        <a
          href={product.affiliate_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => console.log(`[Fenix] Shop This clicked: ${product.id}`)}
          className="mt-2 block text-center bg-[#FF6B00] hover:bg-[#e05e00] text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors duration-150"
        >
          Shop This →
        </a>
      </div>
    </div>
  );
}
