import type { Product } from '../types/product';
import products from '../data/products.json';

export const catalog: Product[] = products as Product[];

export function filterByCategory(category: Product['category']): Product[] {
  return catalog.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return catalog.find((p) => p.id === id);
}
