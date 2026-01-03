
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
    <div className="flex flex-col items-center p-8 bg-[#050505] min-h-screen text-white relative overflow-x-hidden">
      <div className="absolute inset-0 tattoo-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{backgroundImage: 'radial-gradient(#d4af37 2px, transparent 2px)', backgroundSize: '80px 80px'}}></div>

      <div className="z-10 text-center mb-20 mt-12">
        <h1 className="unbounded text-7xl md:text-9xl font-black italic luxury-gradient gold-glow drop-shadow-2xl">WORLD BOUTIQUE</h1>
        <p className="oswald text-[#D4AF37] tracking-[1.2em] uppercase text-sm mt-6 font-black">Invest in your supreme dominance</p>
      </div>
      
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-20 z-10 px-6">
        {/* Ассеты */}
        <div className="space-y-12">
          <div className="flex items-center gap-6">
            <span className="text-6xl diamond-sparkle">💸</span>
            <h2 className="text-5xl font-black border-b-8 border-[#FF1493] pb-6 oswald tracking-[0.3em] text-[#FF1493] uppercase italic">POWER ASSETS</h2>
          </div>
          <div className="space-y-8">
            {WORDS.map(word => {
              const owned = state.ownedWords.includes(word.id);
              const canAfford = state.coins >= word.price;
              return (
                <div key={word.id} className={`
                    p-10 bg-[#111]/90 backdrop-blur-2xl border-4 rounded-[3rem] flex justify-between items-center shadow-3xl transition-all relative overflow-hidden group
                    ${owned ? 'border-zinc-800 opacity-60' : 'border-[#D4AF37]/40 hover:border-[#D4AF37] hover:scale-[1.04]'}
                `}>
                  <div className="relative z-10">
                    <div className="font-black text-5xl uppercase oswald italic flex items-center gap-4" style={{ color: word.color }}>
                        {word.text}
                    </div>
                    <div className="text-xs text-zinc-500 font-black mt-3 uppercase tracking-[0.3em]">{word.character} • STATUS: SUPREME</div>
                    <div className="mt-4 flex gap-3">
                        {Array.from({length: 6}).map((_, i) => <span key={i} className="text-sm text-[#D4AF37]">★</span>)}
                    </div>
                  </div>
                  <div className="z-10">
                    <Button 
                        onClick={() => onPurchase('word', word.id, word.price)}
                        disabled={owned || !canAfford}
                        variant={owned ? 'primary' : 'secondary'}
                        className={`py-6 px-12 text-2xl font-black rounded-[2rem] ${!owned && canAfford ? 'animate-bounce-short' : ''}`}
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
        <div className="space-y-12">
          <div className="flex items-center gap-6">
            <span className="text-6xl diamond-sparkle">🏛️</span>
            <h2 className="text-5xl font-black border-b-8 border-[#1e90ff] pb-6 oswald tracking-[0.3em] text-[#1e90ff] uppercase italic">GLOBAL DOMAINS</h2>
          </div>
          <div className="space-y-8">
            {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => {
              const diff = key as Difficulty;
              const unlocked = state.unlockedDifficulties.includes(diff);
              const canAfford = state.coins >= config.price;
              if (diff === Difficulty.EASY) return null;

              return (
                <div key={key} className={`
                    p-10 bg-[#111]/90 backdrop-blur-2xl border-4 rounded-[3rem] flex justify-between items-center shadow-3xl transition-all relative overflow-hidden group
                    ${unlocked ? 'border-zinc-800 opacity-60' : 'border-[#1e90ff]/40 hover:border-[#1e90ff] hover:scale-[1.04]'}
                `}>
                  <div className="relative z-10">
                    <div className="font-black text-5xl uppercase oswald italic text-white">{config.label}</div>
                    <div className="text-xs text-zinc-500 font-black mt-3 uppercase tracking-[0.3em]">PROFIT MULTIPLIER: x{config.factor}</div>
                    <div className="mt-5 flex gap-5">
                        <span className="px-4 py-2 bg-[#1e90ff]/30 text-[#1e90ff] text-[11px] font-black rounded-xl">ELITE</span>
                        <span className="px-4 py-2 bg-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-black rounded-xl">EXCLUSIVE</span>
                    </div>
                  </div>
                  <div className="z-10">
                    <Button 
                        onClick={() => onPurchase('diff', diff, config.price)}
                        disabled={unlocked || !canAfford}
                        variant={unlocked ? 'primary' : 'secondary'}
                        className="py-6 px-12 text-2xl font-black rounded-[2rem]"
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

      <div className="mt-24 mb-16 flex flex-col items-center gap-12 w-full">
        <div className="shiny-pants p-1.5 rounded-full shadow-[0_0_70px_rgba(212,175,55,0.6)]">
            <div className="text-5xl md:text-7xl font-black oswald flex items-center gap-10 bg-black/98 px-20 py-10 rounded-full border-4 border-[#D4AF37]">
                <span className="text-zinc-600 text-sm uppercase tracking-[0.6em]">TOTAL NET WORTH:</span>
                <span className="text-[#D4AF37] text-8xl drop-shadow-2xl">{state.coins.toLocaleString()} <span className="diamond-sparkle inline-block">💎</span></span>
            </div>
        </div>

        <div className="flex gap-10">
            <Button onClick={onBack} variant="danger" className="py-8 px-20 text-3xl font-black border-red-900 hover:bg-red-900 shadow-2xl">BACK TO PENTHOUSE 💨</Button>
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
