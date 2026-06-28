import { useNavigate, useLocation } from 'react-router-dom';

const FAV_KEY = 'fenix_favorites';
function favCount(): number {
  try { return (JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]') as string[]).length; }
  catch { return 0; }
}

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLink = (label: string, path: string) => (
    <button
      onClick={() => navigate(path)}
      className={`text-xs font-medium tracking-[0.08em] uppercase transition-colors ${
        pathname === path ? 'text-[#FF6B00]' : 'text-[#888888] hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  const savedCount = favCount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0D0D0D] border-b border-[#222222]">
      <button
        onClick={() => navigate('/')}
        className="text-[#FF6B00] font-bold text-xl tracking-[0.08em] cursor-pointer shrink-0"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        FENIX
      </button>

      <div className="flex items-center gap-3 sm:gap-4">
        {navLink('Browse', '/catalog')}
        <button
          onClick={() => navigate('/favorites')}
          className={`text-xs font-medium tracking-[0.08em] uppercase transition-colors flex items-center gap-1 ${
            pathname === '/favorites' ? 'text-[#FF6B00]' : 'text-[#888888] hover:text-white'
          }`}
        >
          ♡{savedCount > 0 && (
            <span className="bg-[#FF6B00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
              {savedCount}
            </span>
          )}
        </button>
        {navLink('About', '/about')}
        <button
          onClick={() => navigate('/quiz')}
          className="bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          Find My Fit
        </button>
      </div>
    </nav>
  );
}
