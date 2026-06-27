export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0D0D0D] border-b border-[#222222]">
      <span
        className="text-[#FF6B00] font-bold text-xl tracking-[0.08em]"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        FENIX
      </span>
      <span className="text-[#888888] text-xs font-medium tracking-[0.1em] uppercase">
        AI Gym Fit
      </span>
    </nav>
  );
}
