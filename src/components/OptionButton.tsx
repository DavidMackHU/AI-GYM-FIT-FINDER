interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer min-h-[52px]
        ${
          selected
            ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-white'
            : 'border-[#222222] bg-[#111111] text-[#888888] hover:border-[#444444] hover:text-white'
        }`}
    >
      {label}
    </button>
  );
}
