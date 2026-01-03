
import React from 'react';
import { GameState, Difficulty } from '../types';
import { WORDS, DIFFICULTY_CONFIG } from '../constants';
import { Button } from './Button';

interface ShopProps {
  state: GameState;
  onPurchase: (type: 'word' | 'diff', id: string, price: number) => void;
  onBack: () => void;
}

export const Shop: React.FC<ShopProps> = ({ state, onPurchase, onBack }) => {
  return (
    <div className="flex flex-col items-center p-[clamp(0.25rem,2vw,2rem)] bg-[#050505] h-screen w-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 tattoo-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{backgroundImage: 'radial-gradient(#d4af37 2px, transparent 2px)', backgroundSize: 'clamp(40px, 8vw, 80px) clamp(40px, 8vw, 80px)'}}></div>

      <div className="z-10 text-center mb-[clamp(0.5rem,5vh,5rem)] mt-[clamp(0.5rem,3vh,3rem)]">
        <h1 className="unbounded font-black italic luxury-gradient gold-glow drop-shadow-2xl" style={{fontSize: 'clamp(1.5rem, 7vw, 9rem)'}}>WORLD BOUTIQUE</h1>
        <p className="oswald text-[#D4AF37] tracking-[1.2em] uppercase mt-[clamp(0.25rem,1.5vh,1.5rem)] font-black" style={{fontSize: 'clamp(0.35rem,0.875vw,0.875rem)'}}>Invest in your supreme dominance</p>
      </div>
      
      <div className="w-full max-w-[95vw] grid lg:grid-cols-2 gap-[clamp(0.5rem,5vw,5rem)] z-10 px-[clamp(0.25rem,1.5vw,1.5rem)] overflow-y-auto" style={{maxHeight: 'calc(100vh - clamp(8rem, 20vh, 20rem))'}}>
        {/* Ассеты */}
        <div className="space-y-[clamp(0.5rem,3vh,3rem)]">
          <div className="flex items-center gap-[clamp(0.25rem,1.5vw,1.5rem)]">
            <span className="diamond-sparkle" style={{fontSize: 'clamp(1.5rem, 4vw, 3.75rem)'}}>💸</span>
            <h2 className="font-black border-b-[clamp(2px,0.5vw,8px)] border-[#FF1493] oswald tracking-[0.3em] text-[#FF1493] uppercase italic" style={{fontSize: 'clamp(0.75rem, 3vw, 3rem)', paddingBottom: 'clamp(0.25rem,1.5vh,1.5rem)'}}>POWER ASSETS</h2>
          </div>
          <div className="space-y-[clamp(0.5rem,2vh,2rem)]">
            {WORDS.map(word => {
              const owned = state.ownedWords.includes(word.id);
              const canAfford = state.coins >= word.price;
              return (
                <div key={word.id} className={`
                    bg-[#111]/90 backdrop-blur-2xl border-[clamp(2px,0.3vw,4px)] rounded-[clamp(0.75rem,6vw,3rem)] flex justify-between items-center shadow-3xl transition-all relative overflow-hidden group
                    ${owned ? 'border-zinc-800 opacity-60' : 'border-[#D4AF37]/40 hover:border-[#D4AF37] hover:scale-[1.04]'}
                `} style={{padding: 'clamp(0.5rem, 2.5vw, 2.5rem)'}}>
                  <div className="relative z-10">
                    <div className="font-black uppercase oswald italic flex items-center gap-[clamp(0.125rem,1vw,1rem)]" style={{ color: word.color, fontSize: 'clamp(0.75rem, 3vw, 3rem)' }}>
                        {word.text}
                    </div>
                    <div className="text-zinc-500 font-black mt-[clamp(0.125rem,0.75vh,0.75rem)] uppercase tracking-[0.3em]" style={{fontSize: 'clamp(0.3rem,0.75vw,0.75rem)'}}>{word.character} • STATUS: SUPREME</div>
                    <div className="mt-[clamp(0.125rem,1vh,1rem)] flex gap-[clamp(0.125rem,0.75vw,0.75rem)]">
                        {Array.from({length: 6}).map((_, i) => <span key={i} className="text-[#D4AF37]" style={{fontSize: 'clamp(0.35rem,0.875vw,0.875rem)'}}>★</span>)}
                    </div>
                  </div>
                  <div className="z-10">
                    <Button 
                        onClick={() => onPurchase('word', word.id, word.price)}
                        disabled={owned || !canAfford}
                        variant={owned ? 'primary' : 'secondary'}
                        className={`font-black rounded-[clamp(0.5rem,4vw,2rem)] ${!owned && canAfford ? 'animate-bounce-short' : ''}`}
                        style={{padding: 'clamp(0.25rem,1.5vh,1.5rem) clamp(0.5rem,3vw,3rem)', fontSize: 'clamp(0.5rem, 1.25vw, 1.25rem)'}}
                    >
                        {owned ? 'ACQUIRED' : `${word.price.toLocaleString()} 💎`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Уровни */}
        <div className="space-y-[clamp(0.5rem,3vh,3rem)]">
          <div className="flex items-center gap-[clamp(0.25rem,1.5vw,1.5rem)]">
            <span className="diamond-sparkle" style={{fontSize: 'clamp(1.5rem, 4vw, 3.75rem)'}}>🏛️</span>
            <h2 className="font-black border-b-[clamp(2px,0.5vw,8px)] border-[#1e90ff] oswald tracking-[0.3em] text-[#1e90ff] uppercase italic" style={{fontSize: 'clamp(0.75rem, 3vw, 3rem)', paddingBottom: 'clamp(0.25rem,1.5vh,1.5rem)'}}>GLOBAL DOMAINS</h2>
          </div>
          <div className="space-y-[clamp(0.5rem,2vh,2rem)]">
            {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => {
              const diff = key as Difficulty;
              const unlocked = state.unlockedDifficulties.includes(diff);
              const canAfford = state.coins >= config.price;
              if (diff === Difficulty.EASY) return null;

              return (
                <div key={key} className={`
                    bg-[#111]/90 backdrop-blur-2xl border-[clamp(2px,0.3vw,4px)] rounded-[clamp(0.75rem,6vw,3rem)] flex justify-between items-center shadow-3xl transition-all relative overflow-hidden group
                    ${unlocked ? 'border-zinc-800 opacity-60' : 'border-[#1e90ff]/40 hover:border-[#1e90ff] hover:scale-[1.04]'}
                `} style={{padding: 'clamp(0.5rem, 2.5vw, 2.5rem)'}}>
                  <div className="relative z-10">
                    <div className="font-black uppercase oswald italic text-white" style={{fontSize: 'clamp(0.75rem, 3vw, 3rem)'}}>{config.label}</div>
                    <div className="text-zinc-500 font-black mt-[clamp(0.125rem,0.75vh,0.75rem)] uppercase tracking-[0.3em]" style={{fontSize: 'clamp(0.3rem,0.75vw,0.75rem)'}}>PROFIT MULTIPLIER: x{config.factor}</div>
                    <div className="mt-[clamp(0.25rem,1.25vh,1.25rem)] flex gap-[clamp(0.25rem,1.25vw,1.25rem)]">
                        <span className="bg-[#1e90ff]/30 text-[#1e90ff] font-black rounded-xl" style={{padding: 'clamp(0.125rem,0.5vh,0.5rem) clamp(0.125rem,1vw,1rem)', fontSize: 'clamp(0.275rem,0.7vw,0.7rem)'}}>ELITE</span>
                        <span className="bg-[#D4AF37]/30 text-[#D4AF37] font-black rounded-xl" style={{padding: 'clamp(0.125rem,0.5vh,0.5rem) clamp(0.125rem,1vw,1rem)', fontSize: 'clamp(0.275rem,0.7vw,0.7rem)'}}>EXCLUSIVE</span>
                    </div>
                  </div>
                  <div className="z-10">
                    <Button 
                        onClick={() => onPurchase('diff', diff, config.price)}
                        disabled={unlocked || !canAfford}
                        variant={unlocked ? 'primary' : 'secondary'}
                        className="font-black rounded-[clamp(0.5rem,4vw,2rem)]"
                        style={{padding: 'clamp(0.25rem,1.5vh,1.5rem) clamp(0.5rem,3vw,3rem)', fontSize: 'clamp(0.5rem, 1.25vw, 1.25rem)'}}
                    >
                        {unlocked ? 'UNLOCKED' : `${config.price.toLocaleString()} 💎`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-[clamp(0.5rem,6vh,6rem)] mb-[clamp(0.5rem,4vh,4rem)] flex flex-col items-center gap-[clamp(0.5rem,3vh,3rem)] w-full">
        <div className="shiny-pants rounded-full shadow-[0_0_70px_rgba(212,175,55,0.6)]" style={{padding: 'clamp(2px,0.4vw,6px)'}}>
            <div className="font-black oswald flex items-center gap-[clamp(0.5rem,2.5vw,2.5rem)] bg-black/98 rounded-full border-[clamp(2px,0.3vw,4px)] border-[#D4AF37]" style={{padding: 'clamp(0.5rem,2.5vh,2.5rem) clamp(0.75rem,5vw,5rem)', fontSize: 'clamp(0.75rem, 3.5vw, 4.5rem)'}}>
                <span className="text-zinc-600 uppercase tracking-[0.6em]" style={{fontSize: 'clamp(0.35rem,0.875vw,0.875rem)'}}>TOTAL NET WORTH:</span>
                <span className="text-[#D4AF37] drop-shadow-2xl" style={{fontSize: 'clamp(1.5rem, 6vw, 5rem)'}}>{state.coins.toLocaleString()} <span className="diamond-sparkle inline-block">💎</span></span>
            </div>
        </div>

        <div className="flex gap-[clamp(0.5rem,2.5vw,2.5rem)]">
            <Button onClick={onBack} variant="danger" className="font-black border-red-900 hover:bg-red-900 shadow-2xl" style={{padding: 'clamp(0.5rem,2vh,2rem) clamp(0.75rem,5vw,5rem)', fontSize: 'clamp(0.6rem, 2vw, 1.875rem)'}}>BACK TO PENTHOUSE 💨</Button>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-short {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .animate-bounce-short {
            animation: bounce-short 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
