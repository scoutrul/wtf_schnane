
import React from 'react';
import { GameState } from '../types';
import { WORDS } from '../constants';
import { Button } from './Button';

interface ShopProps {
  state: GameState;
  onPurchase: (type: 'word', id: string, price: number) => void;
  onBack: () => void;
}

export const Shop: React.FC<ShopProps> = ({ state, onPurchase, onBack }) => {
  // Вычисляем минимальную цену среди всех товаров (только слова)
  const allPrices = WORDS.map(w => w.price).filter(p => p > 0);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const hasInsufficientFunds = state.coins < minPrice;

  return (
    <div className="flex flex-col items-center p-[clamp(0.25rem,1.5vw,1.5rem)] bg-[#050505] h-screen w-screen text-white relative overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0 tattoo-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{backgroundImage: 'radial-gradient(#d4af37 2px, transparent 2px)', backgroundSize: 'clamp(40px, 8vw, 80px) clamp(40px, 8vw, 80px)'}}></div>

      {/* Кнопка "Назад" вверху слева */}
      <button 
        onClick={onBack}
        className="absolute top-[clamp(0.5rem,2vh,2rem)] left-[clamp(0.5rem,2vw,2rem)] z-30 flex items-center gap-[clamp(0.25rem,1vw,1rem)] bg-black/80 backdrop-blur-sm border-[clamp(2px,0.3vw,4px)] border-zinc-700 hover:border-[#D4AF37] hover:bg-black/90 px-[clamp(0.5rem,2vw,2rem)] py-[clamp(0.25rem,1vh,1rem)] rounded-[clamp(0.5rem,2vw,1.5rem)] transition-all cursor-pointer group"
        style={{fontSize: 'clamp(0.5rem, 1.5vw, 1.25rem)'}}
      >
        <span className="text-[#D4AF37] group-hover:text-white transition-colors" style={{fontSize: 'clamp(0.75rem, 2vw, 1.5rem)'}}>←</span>
        <span className="font-black uppercase oswald text-white">ПЕНТХАУС</span>
      </button>

      <div className="z-10 text-center mb-[clamp(0.5rem,2vh,2rem)] mt-[clamp(0.25rem,1.5vh,1.5rem)] flex flex-col items-center gap-[clamp(0.25rem,1vh,1rem)]">
        <h1 className="unbounded font-black italic luxury-gradient gold-glow drop-shadow-2xl" style={{fontSize: 'clamp(1rem, 4vw, 4rem)'}}>МИРОВОЙ БУТИК</h1>
        <div className={`font-black oswald flex items-center gap-[clamp(0.5rem,1.5vw,1.5rem)] transition-all ${hasInsufficientFunds ? 'animate-pulse' : ''}`} style={{fontSize: 'clamp(0.75rem, 2vw, 2rem)'}}>
          <span className="text-zinc-500 uppercase tracking-[0.6em]" style={{fontSize: 'clamp(0.35rem,0.8vw,0.875rem)'}}>💰 БАЛАНС:</span>
          <span className={`tabular-nums drop-shadow-[0_0_30px_currentColor] ${hasInsufficientFunds ? 'text-[#FF6B6B]' : 'text-[#32CD32]'}`} style={{fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', textShadow: hasInsufficientFunds ? '0 0 40px #FF6B6B' : '0 0 40px #32CD32'}}>
            {state.coins.toLocaleString()} <span className="diamond-sparkle inline-block">💎</span>
          </span>
        </div>
      </div>
      
      <div className="w-full max-w-[768px] z-10 px-[clamp(0.25rem,1.5vw,1.5rem)] flex-1">
        {/* Ассеты */}
        <div className="space-y-[clamp(0.5rem,3vh,3rem)]">
          <div className="flex items-center gap-[clamp(0.25rem,1.5vw,1.5rem)]">
            <span className="diamond-sparkle" style={{fontSize: 'clamp(1.5rem, 4vw, 3.75rem)'}}>💸</span>
            <h2 className="font-black border-b-[clamp(2px,0.5vw,8px)] border-[#FF1493] oswald tracking-[0.3em] text-[#FF1493] uppercase italic" style={{fontSize: 'clamp(0.75rem, 3vw, 3rem)', paddingBottom: 'clamp(0.25rem,1.5vh,1.5rem)'}}>СИЛОВЫЕ АКТИВЫ</h2>
          </div>
          <div className="space-y-[clamp(0.5rem,2vh,2rem)]">
            {WORDS.map(word => {
              const owned = state.ownedWords.includes(word.id);
              const canAfford = state.coins >= word.price;
              
              // Состояние 1: Активен (куплено = используется)
              if (owned) {
                return (
                  <div key={word.id} 
                    className="backdrop-blur-2xl border-[clamp(2px,0.3vw,4px)] rounded-[clamp(0.75rem,6vw,3rem)] flex justify-between items-center transition-all relative overflow-hidden"
                    style={{
                      padding: 'clamp(0.5rem, 2.5vw, 2.5rem)',
                      background: word.color === '#D4AF37' ? 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))' : 
                                  word.color === '#32CD32' ? 'linear-gradient(135deg, rgba(50,205,50,0.3), rgba(50,205,50,0.1))' : 
                                  word.color === '#FF1493' ? 'linear-gradient(135deg, rgba(255,20,147,0.3), rgba(255,20,147,0.1))' : 
                                  'linear-gradient(135deg, rgba(30,144,255,0.3), rgba(30,144,255,0.1))',
                      borderColor: word.color,
                      boxShadow: `0 0 40px ${word.color}`
                    }}>
                    <div className="relative z-10 flex-1">
                      <div className="font-black uppercase oswald italic flex items-center gap-[clamp(0.25rem,1vw,1rem)]" style={{ color: word.color, fontSize: 'clamp(0.75rem, 3vw, 3rem)' }}>
                        <span className="text-[#32CD32]" style={{fontSize: 'clamp(1rem, 3.5vw, 3.5rem)'}}>✔</span>
                        <span className="line-clamp-1 lg:line-clamp-2">{word.text}</span>
                      </div>
                      <div className="text-[#32CD32] font-black mt-[clamp(0.25rem,1vh,1rem)] uppercase tracking-[0.3em] flex items-center gap-[clamp(0.25rem,1vw,1rem)]" style={{fontSize: 'clamp(0.4rem,1vw,1rem)'}}>
                        <span>⚡</span>
                        <span>ИСПОЛЬЗУЕТСЯ</span>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Состояние 3: Можно купить
              if (canAfford) {
                return (
                  <div key={word.id} className={`
                      bg-[#111]/90 backdrop-blur-2xl border-[clamp(2px,0.3vw,4px)] rounded-[clamp(0.75rem,6vw,3rem)] flex justify-between items-center shadow-3xl transition-all relative overflow-hidden group cursor-pointer border-[#D4AF37]/40 hover:border-[#D4AF37] hover:scale-[1.04]
                  `} style={{padding: 'clamp(0.5rem, 2.5vw, 2.5rem)'}}>
                    <div className="relative z-10 flex-1">
                      <div className="font-black uppercase oswald italic flex items-center gap-[clamp(0.125rem,1vw,1rem)]" style={{ color: word.color, fontSize: 'clamp(0.75rem, 3vw, 3rem)' }}>
                        <span className="line-clamp-1 lg:line-clamp-2">{word.text}</span>
                      </div>
                      <div className="text-zinc-500 font-black mt-[clamp(0.125rem,0.75vh,0.75rem)] uppercase tracking-[0.3em]" style={{fontSize: 'clamp(0.3rem,0.75vw,0.75rem)'}}>{word.character} • СТАТУС: ВЕРХОВНЫЙ</div>
                      <div className="mt-[clamp(0.25rem,1vh,1rem)] flex items-center gap-[clamp(0.5rem,1.5vw,1.5rem)]">
                        <div className="font-black text-[#D4AF37] flex items-center gap-[clamp(0.25rem,0.75vw,0.75rem)] drop-shadow-[0_0_15px_#D4AF37]" style={{fontSize: 'clamp(0.6rem, 1.75vw, 1.75rem)'}}>
                          <span className="diamond-sparkle">💎</span>
                          <span className="tabular-nums">{word.price.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-[clamp(0.125rem,0.75vw,0.75rem)]">
                          {Array.from({length: 6}).map((_, i) => <span key={i} className="text-[#D4AF37]" style={{fontSize: 'clamp(0.35rem,0.875vw,0.875rem)'}}>★</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="z-10">
                      <Button 
                        onClick={() => onPurchase('word', word.id, word.price)}
                        variant="secondary"
                        className="font-black rounded-[clamp(0.5rem,4vw,2rem)] animate-bounce-short"
                        style={{padding: 'clamp(0.25rem,1.5vh,1.5rem) clamp(0.5rem,3vw,3rem)', fontSize: 'clamp(0.5rem, 1.25vw, 1.25rem)'}}
                      >
                        КУПИТЬ ЗА {word.price.toLocaleString()} 💎
                      </Button>
                    </div>
                  </div>
                );
              }
              
              // Состояние 4: Недостаточно денег
              return (
                <div key={word.id} className={`
                    bg-[#111]/90 backdrop-blur-2xl border-[clamp(2px,0.3vw,4px)] rounded-[clamp(0.75rem,6vw,3rem)] flex justify-between items-center shadow-3xl transition-all relative overflow-hidden border-zinc-800/50
                `} style={{padding: 'clamp(0.5rem, 2.5vw, 2.5rem)'}}>
                  <div className="relative z-10 flex-1">
                    <div className="font-black uppercase oswald italic flex items-center gap-[clamp(0.125rem,1vw,1rem)]" style={{ color: word.color, fontSize: 'clamp(0.75rem, 3vw, 3rem)' }}>
                      <span className="line-clamp-1 lg:line-clamp-2">{word.text}</span>
                    </div>
                    <div className="text-zinc-500 font-black mt-[clamp(0.125rem,0.75vh,0.75rem)] uppercase tracking-[0.3em]" style={{fontSize: 'clamp(0.3rem,0.75vw,0.75rem)'}}>{word.character} • СТАТУС: ВЕРХОВНЫЙ</div>
                    <div className="mt-[clamp(0.25rem,1vh,1rem)] flex items-center gap-[clamp(0.5rem,1.5vw,1.5rem)]">
                      <div className="font-black text-[#D4AF37] flex items-center gap-[clamp(0.25rem,0.75vw,0.75rem)] drop-shadow-[0_0_15px_#D4AF37]" style={{fontSize: 'clamp(0.6rem, 1.75vw, 1.75rem)'}}>
                        <span className="diamond-sparkle">💎</span>
                        <span className="tabular-nums">{word.price.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-[clamp(0.125rem,0.75vw,0.75rem)]">
                        {Array.from({length: 6}).map((_, i) => <span key={i} className="text-[#D4AF37]" style={{fontSize: 'clamp(0.35rem,0.875vw,0.875rem)'}}>★</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="z-10 flex items-center">
                    <div className="text-zinc-400 font-black uppercase tracking-[0.2em] flex items-center gap-[clamp(0.25rem,1vw,1rem)] oswald" style={{fontSize: 'clamp(0.45rem, 1.1vw, 1rem)'}}>
                      <span>⚠</span>
                      <span>НЕДОСТАТОЧНО ДЕНЕГ</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
