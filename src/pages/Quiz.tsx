import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuizAnswers } from '../types/product';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';

const questions: {
  id: keyof QuizAnswers;
  question: string;
  options: { label: string; value: string }[];
}[] = [
  {
    id: 'workout',
    question: 'What type of workout do you do?',
    options: [
      { label: 'Lifting', value: 'lifting' },
      { label: 'Cardio / Running', value: 'cardio' },
      { label: 'CrossFit / HIIT', value: 'hiit' },
      { label: 'Yoga / Pilates', value: 'yoga' },
      { label: 'General Gym', value: 'general-gym' },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget per item?",
    options: [
      { label: 'Under $50', value: 'under-50' },
      { label: '$50 – $100', value: '50-100' },
      { label: '$100 – $200', value: '100-200' },
      { label: 'No limit', value: 'no-limit' },
    ],
  },
  {
    id: 'style',
    question: "What's your style vibe?",
    options: [
      { label: 'Minimal & Clean', value: 'minimal' },
      { label: 'Bold & Loud', value: 'bold' },
      { label: 'All Black Everything', value: 'all-black' },
      { label: 'Colorful & Fun', value: 'colorful' },
    ],
  },
  {
    id: 'gender',
    question: "What's your gender?",
    options: [
      { label: 'Men', value: 'men' },
      { label: 'Women', value: 'women' },
      { label: 'Unisex / Non-binary', value: 'unisex' },
    ],
  },
  {
    id: 'fit',
    question: "What's your fit preference?",
    options: [
      { label: 'Slim / Compression', value: 'slim' },
      { label: 'Regular Fit', value: 'regular' },
      { label: 'Oversized / Relaxed', value: 'oversized' },
    ],
  },
];

const initialAnswers: QuizAnswers = {
  workout: '' as QuizAnswers['workout'],
  budget: '' as QuizAnswers['budget'],
  style: '' as QuizAnswers['style'],
  gender: '' as QuizAnswers['gender'],
  fit: '' as QuizAnswers['fit'],
};

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);

  const current = questions[step];
  const selectedValue = answers[current.id] as string;
  const isLast = step === questions.length - 1;

  function handleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function handleNext() {
    if (!selectedValue) return;
    if (isLast) {
      navigate('/results', { state: { answers } });
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-md">
          <ProgressBar current={step + 1} total={questions.length} />

          <QuizCard
            question={current.question}
            options={current.options}
            selected={selectedValue}
            onSelect={handleSelect}
          />

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-6 rounded-xl border border-[#222222] text-[#888888] hover:text-white hover:border-[#444444] text-sm font-medium transition-colors duration-150 cursor-pointer"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!selectedValue}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer
                ${
                  selectedValue
                    ? 'bg-[#FF6B00] hover:bg-[#e05e00] text-white'
                    : 'bg-[#222222] text-[#555555] cursor-not-allowed'
                }`}
            >
              {isLast ? 'Get My Fit →' : 'Next →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
