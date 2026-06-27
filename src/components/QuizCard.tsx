import OptionButton from './OptionButton';

interface QuizCardProps {
  question: string;
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function QuizCard({ question, options, selected, onSelect }: QuizCardProps) {
  return (
    <div className="w-full">
      <h2 className="text-white text-2xl font-medium mb-6 leading-tight">{question}</h2>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <OptionButton
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
