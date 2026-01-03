import React from 'react';

interface BackgroundPatternProps {
  className?: string;
}

export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 flex flex-wrap content-start items-center justify-center opacity-50 pointer-events-none select-none ${className}`}>
      {Array.from({length: 40}).map((_, i) => (
        <div key={i} className="m-[clamp(0.5rem,2vw,3rem)] font-black text-[clamp(0.8rem,2.5vw,3rem)] uppercase tracking-tighter transform -rotate-12 oswald text-[#32CD32] whitespace-nowrap flex items-center gap-[clamp(0.25rem,1vw,1.5rem)]">
          <span>ПЭПЭ НА БОГАТОМ</span>
          <span className="diamond-sparkle text-white">🤑</span>
          <span className="text-[#D4AF37]">ТОЛЬКО КЭШ</span>
        </div>
      ))}
    </div>
  );
};
