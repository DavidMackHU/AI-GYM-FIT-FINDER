import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
        <div className="max-w-lg w-full mx-auto">
          <p className="text-[#FF6B00] text-xs font-medium tracking-[0.2em] uppercase mb-6">
            Powered by Claude AI
          </p>

          <h1 className="text-white text-4xl sm:text-5xl font-medium leading-tight mb-5">
            Your next gym fit.{' '}
            <span className="text-[#FF6B00]">Built for how you move.</span>
          </h1>

          <p className="text-[#888888] text-base mb-10 leading-relaxed">
            Answer 5 quick questions. Get a full outfit matched to your workout and style.
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
      </main>

      <Footer />
    </div>
  );
}
