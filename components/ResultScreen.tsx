import React from 'react';
import { Button } from './Button';

interface ResultScreenProps {
  score: number;
  coinsGained: number;
  previousRecord: number;
  newRecord: number;
  scoreDifference: number;
  onBack: () => void;
  onRetry?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ 
  score, 
  coinsGained, 
  previousRecord, 
  newRecord, 
  scoreDifference,
  onBack, 
  onRetry 
}) => {
  const isFirstRun = previousRecord === 0;
  const isRecordBeaten = score > previousRecord;
  const hasProfit = coinsGained > 0;
  
  return (
    <div className="h-screen w-screen bg-[#020202] flex flex-col items-center justify-center p-[clamp(0.5rem,2vw,1.5rem)] relative overflow-hidden">
      <div className="absolute inset-0 tattoo-pattern pointer-events-none opacity-30"></div>
      <div className="z-10 text-center space-y-[clamp(0.5rem,2vh,2rem)] w-full max-w-[768px] mx-auto flex flex-col items-center">
        <div className="p-[clamp(2px,0.5vw,12px)] rounded-[clamp(2rem,12vw,6rem)] animate-in zoom-in duration-700 w-full max-w-[90vw] border-[clamp(4px,1vw,8px)] border-[#32CD32] bg-[#111]/90">
          <div className="bg-black/95 backdrop-blur-3xl p-[clamp(0.5rem,4vw,4rem)] rounded-[clamp(2.2rem,11vw,5.5rem)] space-y-[clamp(0.5rem,3vh,3rem)] text-center flex flex-col items-center w-full">
            {/* Показываем "ПРОФИТ!" только если есть профит */}
            {hasProfit && (
              <div className="relative">
                <h2 className="unbounded font-black italic luxury-gradient drop-shadow-[0_0_60px_rgba(50,205,50,0.8)] leading-none" style={{fontSize: 'clamp(2rem, 10vw, 12rem)'}}>
                  ПРОФИТ!
                </h2>
              </div>
            )}
            
            <div className="space-y-[clamp(0.5rem,2vh,2rem)] w-full">
              {/* Если рекорд побит - показываем новый рекорд */}
              {isRecordBeaten ? (
                <div className="space-y-[clamp(0.25rem,1vh,1rem)]">
                  <div className="text-[#32CD32] font-black uppercase tracking-[0.6em] text-[clamp(0.6rem, 1.5vw, 1.5rem)] oswald animate-pulse">
                    {isFirstRun ? 'НОВЫЙ РЕКОРД!' : 'РЕКОРД ПОБИТ!'}
                  </div>
                  <div className="font-black text-[#32CD32] oswald drop-shadow-[0_0_80px_#32CD32] leading-none transform rotate-2 italic" style={{fontSize: 'clamp(2.5rem, 15vw, 15rem)', transform: 'scale(1.2) rotate(2deg)'}}>
                    {newRecord.toLocaleString()}
                  </div>
                </div>
              ) : (
                /* Если рекорд не побит - показываем текущий счет */
                <div className="space-y-[clamp(0.25rem,1vh,1rem)]">
                  <div className="text-zinc-500 font-bold uppercase tracking-[0.8em] text-[clamp(0.4rem,0.9vw,1rem)] oswald">
                    ОЧКИ ЗА ЗАБЕГ
                  </div>
                  <div className="font-black text-white drop-shadow-[0_0_80px_#32CD32] oswald leading-none transform rotate-2 italic" style={{fontSize: 'clamp(2.5rem, 15vw, 15rem)', transform: 'scale(1.2) rotate(2deg)'}}>
                    {score.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Полученные алмазы */}
              <div className={isRecordBeaten ? "pt-[clamp(0.5rem,2vh,2rem)] border-t border-zinc-800" : ""}>
                {coinsGained > 0 ? (
                  <div className="text-[#D4AF37] font-black italic oswald tracking-widest animate-bounce flex items-center justify-center gap-[clamp(0.25rem,2vw,2rem)]" style={{fontSize: 'clamp(1.2rem, 5vw, 5rem)'}}>
                    <span className="diamond-sparkle" style={{fontSize: 'clamp(1.5rem, 5vw, 5rem)'}}>💎</span>
                    ПОЛУЧЕНО: +{coinsGained.toLocaleString()}
                    <span className="diamond-sparkle" style={{fontSize: 'clamp(1.5rem, 5vw, 5rem)'}}>💎</span>
                  </div>
                ) : (
                  <div className="text-[clamp(0.6rem, 2vw, 1.875rem)] text-zinc-600 oswald uppercase tracking-[0.6em] italic">
                    ПОЛУЧЕНО: +0 💎
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-[clamp(0.5rem,2vh,2rem)] w-full mt-[clamp(0.5rem,2vh,2rem)]">
              {onRetry && (
                <Button onClick={onRetry} variant="primary" className="w-full py-[clamp(0.5rem,2vh,2rem)] bg-transparent text-white border-white hover:border-[#32CD32] hover:text-[#32CD32]" style={{fontSize: 'clamp(0.6rem, 2.5vw, 2.5rem)'}}>
                  ПОПРОБОВАТЬ ЕЩЕ
                </Button>
              )}
              <Button onClick={onBack} variant="primary" className="w-full py-[clamp(0.5rem,2vh,2rem)] gold-glow bg-[#32CD32] text-black hover:bg-white border-white" style={{fontSize: 'clamp(0.6rem, 2.5vw, 2.5rem)'}}>
                БЭК
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
