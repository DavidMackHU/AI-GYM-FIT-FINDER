import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 pt-24 pb-16 max-w-2xl mx-auto w-full">
        <div className="mb-10">
          <p className="text-[#FF6B00] text-xs font-medium tracking-[0.2em] uppercase mb-2">
            THE STORY
          </p>
          <h1 className="text-white text-3xl font-medium leading-tight">
            Built by a CS student,<br />
            <span className="text-[#FF6B00]">one outfit at a time.</span>
          </h1>
        </div>

        <div className="space-y-6 text-[#888888] text-sm leading-relaxed">
          <p>
            Hey — I'm David. I'm a computer science student who spends equal time grinding in
            the gym and grinding on code. Fenix Fit Finder started as a personal project to
            put my skills to work on something real.
          </p>

          <p>
            The idea came from a frustrating problem I kept running into: I'd show up to the
            gym in the wrong gear, spend too long scrolling Amazon trying to piece together an
            outfit, or just wear the same worn-out shirt because it was easier. I wanted
            something that could just <em className="text-white">figure it out for me</em>.
          </p>

          <p>
            So I built it. Answer 5 questions, get a complete outfit — top, bottom, shoes,
            and an accessory — matched to your workout, your budget, and your style. Every
            product is hand-curated from Amazon with real prices and real reviews. The AI does
            the styling.
          </p>

          <div className="border border-[#222222] rounded-2xl p-5 bg-[#111111]">
            <p className="text-[#FF6B00] text-xs font-medium tracking-[0.15em] uppercase mb-3">
              Why this matters to me
            </p>
            <p>
              Every dollar Fenix earns through Amazon's affiliate program goes directly toward
              my tuition, textbooks, and the tools I need to keep building. I'm not a company.
              I'm a student applying what I'm learning in real time — and this project has
              taught me more about full-stack development, AI APIs, and product design than
              any class I've taken.
            </p>
            <p className="mt-3">
              If you found your fit and clicked "Shop This" — genuinely, thank you. You're
              helping a CS student pay for their education one outfit at a time. 🔥
            </p>
          </div>

          <div>
            <p className="text-[#FF6B00] text-xs font-medium tracking-[0.15em] uppercase mb-3">
              The stack
            </p>
            <ul className="space-y-1 text-[#555555]">
              <li>React + TypeScript + Vite</li>
              <li>Groq AI — llama-3.3-70b-versatile</li>
              <li>Tailwind CSS</li>
              <li>Vercel (free tier)</li>
              <li>Amazon Associates affiliate links</li>
              <li>96 hand-curated products</li>
            </ul>
          </div>

          <p className="text-[#555555] text-xs">
            Built in 2025 · wearfenix.com
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/quiz')}
            className="flex-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-sm font-medium py-3 rounded-xl transition-colors"
          >
            Find My Fit →
          </button>
          <button
            onClick={() => navigate('/catalog')}
            className="flex-1 bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-[#888888] hover:text-white text-sm font-medium py-3 rounded-xl transition-colors"
          >
            Browse All Products
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
