
import React from 'react';
import { GameState, Author, Difficulty } from '../types';
import { DIFFICULTY_CONFIG, AUTHORS_CONFIG } from '../constants';
import { Button } from './Button';

interface DifficultySelectProps {
  author: Author;
  state: GameState;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onPurchaseDifficulty: (author: Author, difficulty: Difficulty, price: number) => void;
  onBack: () => void;
}

export const DifficultySelect: React.FC<DifficultySelectProps> = ({ 
  author, 
  state, 
  onSelectDifficulty, 
  onPurchaseDifficulty,
  onBack 
}) => {
  const authorConfig = AUTHORS_CONFIG[author];
  const unlockedDifficulties = state.unlockedDifficulties[author] || [];

  return (
    <div className="h-screen w-screen bg-[#020202] flex flex-col items-center justify-center p-[clamp(0.5rem,2vw,1.5rem)] relative overflow-hidden">
      <div className="absolute inset-0 tattoo-pattern pointer-events-none opacity-30"></div>

      <button 
        onClick={onBack}
        className="absolute top-[clamp(0.5rem,2vh,2rem)] left-[clamp(0.5rem,2vw,2rem)] z-30 flex items-center gap-[clamp(0.25rem,1vw,1rem)] bg-black/80 backdrop-blur-sm border-[clamp(2px,0.3vw,4px)] border-zinc-700 hover:border-[#D4AF37] hover:bg-black/90 px-[clamp(0.5rem,2vw,2rem)] py-[clamp(0.25rem,1vh,1rem)] rounded-[clamp(0.5rem,2vw,1.5rem)] transition-all cursor-pointer group"
        style={{fontSize: 'clamp(0.5rem, 1.5vw, 1.25rem)'}}
      >
        <span className="text-[#D4AF37] group-hover:text-white transition-colors" style={{fontSize: 'clamp(0.75rem, 2vw, 1.5rem)'}}>←</span>
        <span className="font-black uppercase oswald text-white">НАЗАД</span>
      </button>

      <div className="z-10 text-center space-y-[clamp(0.5rem,2vh,2rem)] w-full max-w-[768px] mx-auto flex flex-col items-center">
        <div className="title-container relative inline-block">
          <h1 className="unbounded font-black italic luxury-gradient leading-[0.75] transform -skew-x-12 drop-shadow-[0_30px_80px_rgba(50,205,50,0.6)] gold-glow" style={{fontSize: 'clamp(2rem, 10vw, 12rem)'}}>
            {authorConfig.displayName}
          </h1>
          <div className="text-zinc-400 font-black uppercase oswald mt-[clamp(0.5rem,2vh,2rem)]" style={{fontSize: 'clamp(0.75rem, 2vw, 2rem)'}}>
            {authorConfig.style}
          </div>
        </div>

        <div className="p-[clamp(2px,0.3vw,8px)] text-white rounded-[clamp(2rem,10vw,5rem)] shadow-3xl w-full max-w-[90vw] transform hover:scale-[1.03] transition-all duration-500 border-[clamp(2px,0.3vw,4px)] border-[#D4AF37] bg-[#111]/90">
          <div className="bg-[#050505]/98 backdrop-blur-3xl p-[clamp(0.5rem,2.5vw,2.5rem)] rounded-[clamp(1.9rem,9.6vw,4.8rem)] space-y-[clamp(0.5rem,2vh,2rem)] w-full border-2 border-white/5">
            <h3 className="text-[clamp(0.6rem,1.5vw,1.5rem)] font-black tracking-[0.6em] text-[#D4AF37] uppercase oswald flex items-center justify-center gap-[clamp(0.25rem,1.5vw,1.5rem)]">
              <span className="diamond-sparkle">💹</span>
              ВЫБЕРИ УРОВЕНЬ ПРОФИТА
              <span className="diamond-sparkle">💹</span>
            </h3>
            
            <div className="flex flex-col items-center justify-start gap-[clamp(0.5rem,2vw,2rem)]">
              {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => {
                const diff = key as Difficulty;
                const isUnlocked = unlockedDifficulties.includes(diff);
                const canAfford = state.coins >= config.price;
                const highScore = state.highScores[author]?.[diff] || 0;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (isUnlocked) {
                        onSelectDifficulty(diff);
                      } else if (canAfford) {
                        onPurchaseDifficulty(author, diff, config.price);
                      }
                    }}
                    className={`
                      border-[clamp(2px,0.3vw,4px)] p-[clamp(0.5rem,2vw,2rem)] rounded-[clamp(1rem,5vw,2.5rem)] transition-all font-black oswald tracking-widest cursor-pointer
                      ${isUnlocked 
                        ? 'bg-white text-black border-[#32CD32] hover:scale-110 shadow-[0_0_40px_rgba(50,205,50,0.8)]' 
                        : canAfford
                        ? 'bg-[#1a1a1a] text-zinc-300 border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#222]'
                        : 'bg-[#1a1a1a] text-zinc-500 border-zinc-700 opacity-60'
                      }
                    `}
                    style={{fontSize: 'clamp(0.6rem, 1.5vw, 1.5rem)', width: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-[clamp(0.25rem,1vw,1rem)]">
                          {!isUnlocked && <span className="text-zinc-600">🔒</span>}
                          <span>{config.label}</span>
                        </div>
                        {isUnlocked && highScore > 0 && (
                          <div className="text-[#32CD32] font-black mt-[clamp(0.25rem,0.75vh,0.75rem)] font-mono" style={{fontSize: 'clamp(0.35rem,0.8vw,0.8rem)'}}>
                            Минт: {highScore.toLocaleString()}
                          </div>
                        )}
                        {!isUnlocked && (
                          <div className="text-[#D4AF37] font-black mt-[clamp(0.25rem,0.75vh,0.75rem)] flex items-center gap-[clamp(0.25rem,0.75vw,0.75rem)]" style={{fontSize: 'clamp(0.5rem, 1.25vw, 1.25rem)'}}>
                            <span>Открыть за</span>
                            <span className="diamond-sparkle">💎</span>
                            <span>{config.price.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="font-black oswald border-t-[clamp(2px,0.3vw,4px)] border-zinc-900 pt-[clamp(0.5rem,2vh,2rem)] flex items-center justify-center gap-[clamp(0.25rem,1.5vw,1.5rem)] w-full" style={{fontSize: 'clamp(0.6rem, 2.5vw, 2.5rem)'}}>
          <span className="text-[#32CD32] tabular-nums drop-shadow-[0_0_20px_rgba(50,205,50,0.5)]" style={{fontSize: 'clamp(1.2rem, 5vw, 4rem)'}}>
            {state.coins.toLocaleString()} <span className="diamond-sparkle inline-block">💎</span>
          </span>
        </div>
      </div>
    </div>
  );
};
