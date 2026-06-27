import { useEffect, useState } from 'react';

const messages = [
  'Analyzing your style...',
  'Matching your workout...',
  'Building your fit...',
  'Selecting the best pieces...',
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[#222222]" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#FF6B00] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p
        key={msgIndex}
        className="text-[#888888] text-sm font-medium animate-pulse"
      >
        {messages[msgIndex]}
      </p>
    </div>
  );
}
