import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, QuizAnswers } from '../types/product';
import { catalog } from '../utils/catalog';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

type CategoryFilter = 'all' | Product['category'];
type GenderFilter = 'all' | 'men' | 'women' | 'unisex';
type BudgetFilter = 'all' | 'under-50' | '50-100' | '100-200' | 'no-limit';
type StyleFilter = 'all' | Product['style'][number];
type WorkoutFilter = 'all' | Product['workout'][number];
type SortOrder = 'default' | 'price-asc' | 'price-desc';

const categoryOptions: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'top', label: 'Tops' },
  { value: 'bottom', label: 'Bottoms' }, { value: 'shoes', label: 'Shoes' },
  { value: 'accessory', label: 'Accessories' },
];
const genderOptions: { value: GenderFilter; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' }, { value: 'unisex', label: 'Unisex' },
];
const budgetOptions: { value: BudgetFilter; label: string }[] = [
  { value: 'all', label: 'Any Budget' }, { value: 'under-50', label: 'Under $50' },
  { value: '50-100', label: '$50–$100' }, { value: '100-200', label: '$100–$200' },
  { value: 'no-limit', label: '$200+' },
];
const styleOptions: { value: StyleFilter; label: string }[] = [
  { value: 'all', label: 'All Styles' }, { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' }, { value: 'all-black', label: 'All Black' },
  { value: 'colorful', label: 'Colorful' },
];
const workoutOptions: { value: WorkoutFilter; label: string }[] = [
  { value: 'all', label: 'All Workouts' }, { value: 'lifting', label: 'Lifting' },
  { value: 'cardio', label: 'Cardio' }, { value: 'hiit', label: 'HIIT' },
  { value: 'yoga', label: 'Yoga' }, { value: 'general-gym', label: 'General Gym' },
];
const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
];

function Pills<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            value === opt.value ? 'bg-[#FF6B00] text-white' : 'bg-[#1a1a1a] text-[#888888] hover:text-white hover:bg-[#222222]'
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function budgetMatches(p: Product, budget: BudgetFilter) {
  if (budget === 'all') return true;
  if (budget === 'under-50') return p.price < 50;
  if (budget === '50-100') return p.price >= 50 && p.price <= 100;
  if (budget === '100-200') return p.price > 100 && p.price <= 200;
  if (budget === 'no-limit') return p.price > 200;
  return true;
}

export default function Catalog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [gender, setGender] = useState<GenderFilter>('all');
  const [budget, setBudget] = useState<BudgetFilter>('all');
  const [style, setStyle] = useState<StyleFilter>('all');
  const [workout, setWorkout] = useState<WorkoutFilter>('all');
  const [sort, setSort] = useState<SortOrder>('default');

  const hasActive = search || category !== 'all' || gender !== 'all' || budget !== 'all' || style !== 'all' || workout !== 'all';

  const clearFilters = () => {
    setSearch(''); setCategory('all'); setGender('all');
    setBudget('all'); setStyle('all'); setWorkout('all');
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = catalog.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (category !== 'all' && p.category !== category) return false;
      if (gender !== 'all' && !p.gender.includes(gender)) return false;
      if (!budgetMatches(p, budget)) return false;
      if (style !== 'all' && !p.style.includes(style)) return false;
      if (workout !== 'all' && !p.workout.includes(workout)) return false;
      return true;
    });
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [search, category, gender, budget, style, workout, sort]);

  const handleStyleThis = (product: Product) => {
    const inferredAnswers: QuizAnswers = {
      workout: product.workout[0] ?? 'general-gym',
      budget: 'no-limit',
      style: product.style[0] ?? 'minimal',
      gender: product.gender.includes('men') ? 'men' : product.gender.includes('women') ? 'women' : 'unisex',
      fit: product.fit[0] ?? 'regular',
    };
    navigate('/results', { state: { answers: inferredAnswers, lockedProduct: product } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 pt-24 pb-16 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <p className="text-[#FF6B00] text-xs font-medium tracking-[0.2em] uppercase mb-2">BROWSE</p>
          <h1 className="text-white text-2xl font-medium mb-1">All Products</h1>
          <p className="text-[#555555] text-sm">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''}{hasActive ? ' matching your filters' : ' in the catalog'}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111111] border border-[#222222] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#555555] focus:outline-none focus:border-[#FF6B00] transition-colors" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white transition-colors">✕</button>
          )}
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8 p-4 bg-[#111111] border border-[#222222] rounded-2xl">
          {[
            { label: 'Category', options: categoryOptions, value: category, onChange: setCategory as (v: string) => void },
            { label: 'Gender', options: genderOptions, value: gender, onChange: setGender as (v: string) => void },
            { label: 'Budget', options: budgetOptions, value: budget, onChange: setBudget as (v: string) => void },
            { label: 'Style', options: styleOptions, value: style, onChange: setStyle as (v: string) => void },
            { label: 'Workout', options: workoutOptions, value: workout, onChange: setWorkout as (v: string) => void },
            { label: 'Sort', options: sortOptions, value: sort, onChange: setSort as (v: string) => void },
          ].map(({ label, options, value, onChange }) => (
            <div key={label}>
              <p className="text-[#888888] text-[11px] font-medium tracking-[0.1em] uppercase mb-2">{label}</p>
              <Pills options={options} value={value} onChange={onChange} />
            </div>
          ))}
          {hasActive && (
            <button onClick={clearFilters} className="text-[#FF6B00] hover:text-[#e05e00] text-xs font-medium transition-colors">
              ✕ Clear all filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#555555] text-sm">No products match your filters.</p>
            <button onClick={clearFilters} className="text-[#FF6B00] hover:text-[#e05e00] text-sm underline underline-offset-4 transition-colors">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                secondaryAction={{ label: 'Style This →', onClick: () => handleStyleThis(product) }}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-[#555555] text-sm mb-4">Want a full outfit matched to your workout?</p>
          <button onClick={() => navigate('/quiz')} className="bg-[#FF6B00] hover:bg-[#e05e00] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors">
            Get My AI Fit →
          </button>
        </div>

        <p className="text-[#555555] text-xs italic text-center mt-8">
          As an Amazon Associate, Fenix earns from qualifying purchases.
        </p>
      </main>
      <Footer />
    </div>
  );
}
