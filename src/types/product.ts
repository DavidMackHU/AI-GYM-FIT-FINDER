export interface Product {
  id: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory';
  name: string;
  price: number;
  gender: ('men' | 'women' | 'unisex')[];
  style: ('minimal' | 'bold' | 'all-black' | 'colorful')[];
  workout: ('lifting' | 'cardio' | 'hiit' | 'yoga' | 'general-gym')[];
  budget_max: number;
  fit: ('slim' | 'regular' | 'oversized')[];
  affiliate_url: string;
  image_url: string;
}

export interface QuizAnswers {
  workout: 'lifting' | 'cardio' | 'hiit' | 'yoga' | 'general-gym';
  budget: 'under-50' | '50-100' | '100-200' | 'no-limit';
  style: 'minimal' | 'bold' | 'all-black' | 'colorful';
  gender: 'men' | 'women' | 'unisex';
  fit: 'slim' | 'regular' | 'oversized';
}

export interface OutfitRecommendation {
  top: { id: string; reason: string };
  bottom: { id: string; reason: string };
  shoes: { id: string; reason: string };
  accessory: { id: string; reason: string };
}

export interface OutfitRecommendations {
  outfits: OutfitRecommendation[];
}
