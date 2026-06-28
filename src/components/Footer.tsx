import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-auto py-6 px-6 border-t border-[#222222] text-center space-y-2">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => navigate('/about')}
          className="text-[#555555] hover:text-[#888888] text-xs underline-offset-4 transition-colors"
        >
          About
        </button>
        <button
          onClick={() => navigate('/catalog')}
          className="text-[#555555] hover:text-[#888888] text-xs transition-colors"
        >
          Browse
        </button>
        <button
          onClick={() => navigate('/favorites')}
          className="text-[#555555] hover:text-[#888888] text-xs transition-colors"
        >
          Saved
        </button>
      </div>
      <p className="text-[#555555] text-xs">
        © 2025 Fenix · Built by a CS student · Amazon Associates Program
      </p>
      <p className="text-[#444444] text-xs">
        Fenix is a participant in the Amazon Services LLC Associates Program, an affiliate
        advertising program designed to provide a means for sites to earn advertising fees by
        advertising and linking to Amazon.com.
      </p>
    </footer>
  );
}
