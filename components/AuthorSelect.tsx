
import React from 'react';
import { GameState, Author } from '../types';
import { AUTHORS_CONFIG } from '../constants';

interface AuthorSelectProps {
  state: GameState;
  onSelectAuthor: (author: Author) => void;
  onPurchaseAuthor: (author: Author, price: number) => void;
  onOpenShop: () => void;
}

export const AuthorSelect: React.FC<AuthorSelectProps> = ({ state, onSelectAuthor, onPurchaseAuthor, onOpenShop }) => {
  return (
    <div className="h-screen w-screen bg-[#020202] flex flex-col items-center justify-center p-[clamp(0.5rem,2vw,1.5rem)] relative overflow-hidden">
      <div className="absolute inset-0 tattoo-pattern pointer-events-none opacity-30"></div>
      <div className="absolute inset-0 flex flex-wrap content-start items-center justify-center opacity-50 pointer-events-none select-none">
        {Array.from({length: 40}).map((_, i) => (
            <div key={i} className="m-[clamp(0.5rem,2vw,3rem)] font-black text-[clamp(0.8rem,2.5vw,3rem)] uppercase tracking-tighter transform -rotate-12 oswald text-[#32CD32] whitespace-nowrap flex items-center gap-[clamp(0.25rem,1vw,1.5rem)]">
               <span>ПЭПЭ НА БОГАТОМ</span>
               <span className="diamond-sparkle text-white">🤑</span>
               <span className="text-[#D4AF37]">ТОЛЬКО КЭШ</span>
            </div>
        ))}
      </div>

      <div className="z-10 text-center space-y-[clamp(0.5rem,2vh,2rem)] w-full max-w-[768px] mx-auto flex flex-col items-center">
        <div className="title-container relative inline-block">
          <h1 className="unbounded font-black italic luxury-gradient leading-[0.75] transform -skew-x-12 drop-shadow-[0_30px_80px_rgba(50,205,50,0.6)] gold-glow" style={{fontSize: 'clamp(2.5rem, 12vw, 14rem)'}}>
            ПЭПЭ,<br/>ФАШНЕЛЬ!
          </h1>
        </div>

        <div className="w-full space-y-[clamp(0.5rem,2vh,2rem)] mt-[clamp(1rem,4vh,4rem)]">
          {Object.values(Author).map(authorId => {
            const author = AUTHORS_CONFIG[authorId];
            const isOwned = state.ownedAuthors.includes(authorId);
            const canAfford = state.coins >= author.price;

            if (isOwned) {
              return (
                <button
                  key={authorId}
                  onClick={() => onSelectAuthor(authorId)}
                  className="w-full p-[clamp(1rem,3vw,3rem)] bg-black/90 backdrop-blur-xl border-[clamp(2px,0.3vw,4px)] border-[#D4AF37] rounded-[clamp(1rem,5vw,2.5rem)] shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all hover:scale-[1.03] cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-black uppercase oswald text-[#D4AF37] flex items-center gap-[clamp(0.5rem,1.5vw,1.5rem)]" style={{fontSize: 'clamp(1.5rem, 4vw, 4rem)'}}>
                        <span>{author.displayName}</span>
                        <span className="text-[#32CD32]">✓</span>
                      </div>
                      <div className="text-zinc-400 font-black uppercase oswald mt-[clamp(0.25rem,1vh,1rem)]" style={{fontSize: 'clamp(0.5rem, 1.5vw, 1.5rem)'}}>
                        {author.style}
                      </div>
                    </div>
                    <div className="text-[#D4AF37] font-black oswald" style={{fontSize: 'clamp(2rem, 6vw, 6rem)'}}>→</div>
                  </div>
                </button>
              );
            }

            return (
              <button
                key={authorId}
                onClick={() => {
                  if (canAfford) {
                    onPurchaseAuthor(authorId, author.price);
                  }
                }}
                disabled={!canAfford}
                className={`w-full p-[clamp(1rem,3vw,3rem)] bg-black/60 backdrop-blur-xl border-[clamp(2px,0.3vw,4px)] rounded-[clamp(1rem,5vw,2.5rem)] transition-all relative overflow-hidden ${
                  canAfford ? 'border-[#D4AF37]/50 hover:border-[#D4AF37] hover:scale-[1.03] cursor-pointer' : 'border-zinc-800 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-black uppercase oswald text-zinc-500 flex items-center gap-[clamp(0.5rem,1.5vw,1.5rem)]" style={{fontSize: 'clamp(1.5rem, 4vw, 4rem)'}}>
                      <span>{author.displayName}</span>
                      <span className="text-zinc-700">🔒</span>
                    </div>
                    <div className="text-zinc-600 font-black uppercase oswald mt-[clamp(0.25rem,1vh,1rem)]" style={{fontSize: 'clamp(0.5rem, 1.5vw, 1.5rem)'}}>
                      {author.style}
                    </div>
                    {canAfford && (
                      <div className="text-[#D4AF37] font-black oswald mt-[clamp(0.5rem,1.5vh,1.5rem)] flex items-center gap-[clamp(0.25rem,1vw,1rem)]" style={{fontSize: 'clamp(1rem, 2.5vw, 2.5rem)'}}>
                        <span>Открыть за</span>
                        <span className="diamond-sparkle">💎</span>
                        <span>{author.price.toLocaleString()}</span>
                      </div>
                    )}
                    {!canAfford && (
                      <div className="text-zinc-500 font-black oswald mt-[clamp(0.5rem,1.5vh,1.5rem)]" style={{fontSize: 'clamp(0.75rem, 2vw, 2rem)'}}>
                        Недостаточно алмазов
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="font-black oswald border-t-[clamp(2px,0.3vw,4px)] border-zinc-900 pt-[clamp(0.5rem,2vh,2rem)] flex items-center justify-center gap-[clamp(0.25rem,1.5vw,1.5rem)] w-full" style={{fontSize: 'clamp(0.6rem, 2.5vw, 2.5rem)'}}>
          <span className="text-zinc-600 text-[clamp(0.3rem,0.6vw,0.7rem)] uppercase tracking-[1em]">КАПИТАЛ:</span> 
          <span className="text-[#32CD32] tabular-nums drop-shadow-[0_0_20px_rgba(50,205,50,0.5)]" style={{fontSize: 'clamp(1.2rem, 5vw, 4rem)'}}>
            {state.coins.toLocaleString()} <span className="diamond-sparkle inline-block">💎</span>
          </span>
        </div>

        <button
          onClick={onOpenShop}
          className="mt-[clamp(0.5rem,2vh,2rem)] px-[clamp(1rem,3vw,3rem)] py-[clamp(0.5rem,1.5vh,1.5rem)] bg-black/80 backdrop-blur-sm border-[clamp(2px,0.3vw,4px)] border-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-[clamp(0.75rem,3vw,1.5rem)] font-black uppercase oswald text-[#D4AF37] transition-all cursor-pointer"
          style={{fontSize: 'clamp(0.6rem, 2vw, 1.5rem)'}}
        >
          ЗАЛУТАТЬ СТИЛЬ 💎
        </button>
      </div>
    </div>
  );
};
