import React from 'react';
import { Button } from './Button';

interface ResultScreenProps {
  score: number;
  coinsGained: number;
  onBack: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, coinsGained, onBack }) => {
  return (
    <div className="h-screen w-screen bg-[#020202] flex flex-col items-center justify-center p-[clamp(0.5rem,2vw,1.5rem)] relative overflow-hidden">
      <div className="absolute inset-0 tattoo-pattern pointer-events-none opacity-30"></div>
      <div className="z-10 text-center space-y-[clamp(0.5rem,2vh,2rem)] w-full max-w-[768px] mx-auto flex flex-col items-center">
        <div className="p-[clamp(2px,0.5vw,12px)] rounded-[clamp(2rem,12vw,6rem)] animate-in zoom-in duration-700 w-full max-w-[90vw] border-[clamp(4px,1vw,8px)] border-[#32CD32] bg-[#111]/90">
          <div className="bg-black/95 backdrop-blur-3xl p-[clamp(0.5rem,4vw,4rem)] rounded-[clamp(2.2rem,11vw,5.5rem)] space-y-[clamp(0.5rem,3vh,3rem)] text-center flex flex-col items-center w-full">
            <div className="relative">
              <h2 className="unbounded font-black italic luxury-gradient drop-shadow-[0_0_60px_rgba(50,205,50,0.8)] leading-none" style={{fontSize: 'clamp(2rem, 10vw, 12rem)'}}>
                ПРОФИТ!
              </h2>
              <div className="absolute -top-[clamp(1rem,4vh,4rem)] -right-[clamp(1rem,4vw,4rem)] text-[clamp(2rem,6vw,5rem)] diamond-sparkle">🏦</div>
            </div>
            
            <div className="space-y-[clamp(0.5rem,3vh,3rem)] w-full">
              <div className="text-zinc-500 font-bold uppercase tracking-[1.5em] text-[clamp(0.35rem,0.7vw,0.875rem)] oswald flex items-center justify-center gap-[clamp(0.25rem,2vw,2rem)]">
                <span className="h-[clamp(1px,0.1vh,2px)] w-[clamp(1rem,6vw,6rem)] bg-[#32CD32]"></span>
                СТАТУС: ДЕНЕЖНЫЙ БОГ
                <span className="h-[clamp(1px,0.1vh,2px)] w-[clamp(1rem,6vw,6rem)] bg-[#32CD32]"></span>
              </div>
              <div className="font-black text-white drop-shadow-[0_0_80px_#32CD32] oswald leading-none transform rotate-2 italic" style={{fontSize: 'clamp(3rem, 18vw, 18rem)', transform: 'scale(1.25) rotate(2deg)'}}>
                {score}
              </div>
              {coinsGained > 0 ? (
                <div className="text-[#D4AF37] font-black italic oswald tracking-widest animate-bounce mt-[clamp(0.5rem,4vh,4rem)] flex items-center justify-center gap-[clamp(0.25rem,2vw,2rem)]" style={{fontSize: 'clamp(1rem, 4.5vw, 4.5rem)'}}>
                  <span className="diamond-sparkle" style={{fontSize: 'clamp(1.5rem, 5vw, 5rem)'}}>💎</span>
                  + {coinsGained.toLocaleString()} АЛМАЗОВ
                  <span className="diamond-sparkle" style={{fontSize: 'clamp(1.5rem, 5vw, 5rem)'}}>💎</span>
                </div>
              ) : (
                <div className="text-[clamp(0.6rem, 2vw, 1.875rem)] text-zinc-600 oswald uppercase tracking-[0.6em] italic">НУЖНО БОЛЬШЕ ПОПУЛЯРНОСТИ, БРО.</div>
              )}
            </div>
            
            <Button onClick={onBack} variant="primary" className="w-full py-[clamp(0.5rem,2vh,2rem)] gold-glow mt-[clamp(0.5rem,2vh,2rem)] bg-[#32CD32] text-black hover:bg-white border-white" style={{fontSize: 'clamp(0.6rem, 2.5vw, 2.5rem)'}}>
              НАЗАД К АВТОРУ 🦅
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
