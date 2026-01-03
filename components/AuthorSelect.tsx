
import React from 'react';
import { GameState, Author } from '../types';
import { AUTHORS_CONFIG } from '../constants';
import { BackgroundPattern } from './BackgroundPattern';

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
      <BackgroundPattern className="hidden" />

      <div className="z-10 text-center space-y-[clamp(0.25rem,1vh,1rem)] w-full max-w-[768px] mx-auto flex flex-col items-center">
        <div className="title-container relative inline-block">
          <h1 className="unbounded font-black italic luxury-gradient transform -skew-x-12 drop-shadow-[0_30px_80px_rgba(50,205,50,0.6)] gold-glow" style={{fontSize: 'clamp(1.5rem, 8vw, 8rem)', lineHeight: '80%'}}>
            &nbsp;ПЭПЭ<span className="text-[#32CD32]">ФА</span><br/>
            ШНЕИНЕ
          </h1>
        </div>

        <div className="w-full space-y-[clamp(0.25rem,1vh,0.75rem)] mt-[clamp(0.5rem,2vh,2rem)]">
          {Object.values(Author).map(authorId => {
            const author = AUTHORS_CONFIG[authorId];
            const isOwned = state.ownedAuthors.includes(authorId);
            const canAfford = state.coins >= author.price;

            if (isOwned) {
              return (
                <button
                  key={authorId}
                  onClick={() => onSelectAuthor(authorId)}
                  className="w-full bg-black/90 backdrop-blur-xl border-[clamp(2px,0.3vw,4px)] border-[#D4AF37] rounded-[clamp(0.75rem,3vw,1.5rem)] shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all hover:scale-[1.02] cursor-pointer group"
                  style={{paddingTop: '8px', paddingBottom: '8px', paddingLeft: '16px', paddingRight: '16px'}}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-black uppercase oswald text-[#D4AF37] flex items-center gap-[clamp(0.25rem,1vw,1rem)]" style={{fontSize: 'clamp(0.9rem, 2.5vw, 2.5rem)'}}>
                        <span>{author.displayName}</span>
                        <span className="text-[#32CD32]">✓</span>
                      </div>
                      <div className="text-zinc-400 font-black uppercase oswald mt-[clamp(0.125rem,0.5vh,0.5rem)]" style={{fontSize: 'clamp(0.35rem, 1vw, 1rem)'}}>
                        {author.style}
                      </div>
                    </div>
                    <div className="text-[#D4AF37] font-black oswald" style={{fontSize: 'clamp(1.2rem, 3vw, 3rem)'}}>→</div>
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
                className={`w-full bg-black/60 backdrop-blur-xl border-[clamp(2px,0.3vw,4px)] rounded-[clamp(0.75rem,3vw,1.5rem)] transition-all relative overflow-hidden ${
                  canAfford ? 'border-[#D4AF37]/50 hover:border-[#D4AF37] hover:scale-[1.02] cursor-pointer' : 'border-zinc-800 opacity-60 cursor-not-allowed'
                }`}
                style={{paddingTop: '8px', paddingBottom: '8px', paddingLeft: '16px', paddingRight: '16px'}}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-black uppercase oswald text-zinc-500 flex items-center gap-[clamp(0.25rem,1vw,1rem)]" style={{fontSize: 'clamp(0.9rem, 2.5vw, 2.5rem)'}}>
                      <span>{author.displayName}</span>
                      <span className="text-zinc-700">🔒</span>
                    </div>
                    <div className="text-zinc-600 font-black uppercase oswald mt-[clamp(0.125rem,0.5vh,0.5rem)]" style={{fontSize: 'clamp(0.35rem, 1vw, 1rem)'}}>
                      {author.style}
                    </div>
                    {canAfford && (
                      <div className="text-[#D4AF37] font-black oswald mt-[clamp(0.25rem,0.75vh,0.75rem)] flex items-center gap-[clamp(0.125rem,0.75vw,0.75rem)]" style={{fontSize: 'clamp(0.6rem, 1.5vw, 1.5rem)'}}>
                        <span>Открыть за</span>
                        <span className="diamond-sparkle">💎</span>
                        <span>{author.price.toLocaleString()}</span>
                      </div>
                    )}
                    {!canAfford && (
                      <div className="text-zinc-500 font-black oswald mt-[clamp(0.25rem,0.75vh,0.75rem)]" style={{fontSize: 'clamp(0.5rem, 1.2vw, 1.2rem)'}}>
                        Недостаточно алмазов
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="font-black oswald border-t-[clamp(2px,0.3vw,4px)] border-zinc-900 pt-[clamp(0.25rem,1vh,1rem)] flex items-center justify-center gap-[clamp(0.25rem,1vw,1rem)] w-full" style={{fontSize: 'clamp(0.5rem, 1.5vw, 1.5rem)'}}>
          <span className="text-zinc-600 uppercase tracking-[0.5em]" style={{fontSize: '12px'}}>КАПИТАЛ:</span> 
          <span className="text-[#32CD32] tabular-nums drop-shadow-[0_0_20px_rgba(50,205,50,0.5)]" style={{fontSize: 'clamp(0.9rem, 3vw, 2.5rem)'}}>
            {state.coins.toLocaleString()} <span className="diamond-sparkle inline-block">💎</span>
          </span>
        </div>

        <button
          onClick={onOpenShop}
          className="mt-[clamp(0.25rem,1vh,1rem)] px-[clamp(0.75rem,2vw,2rem)] py-[clamp(0.375rem,1vh,1rem)] bg-black/80 backdrop-blur-sm border-[clamp(2px,0.3vw,4px)] border-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-[12px] font-black uppercase oswald text-[#D4AF37] transition-all cursor-pointer"
          style={{fontSize: 'clamp(0.5rem, 1.5vw, 1.2rem)'}}
        >
          ЗАЛУТАТЬ СТИЛЬ 💎
        </button>
      </div>
    </div>
  );
};
