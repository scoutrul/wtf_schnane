
import React, { useState, useEffect } from 'react';
import { Difficulty } from './types';
import { DIFFICULTY_CONFIG } from './constants';
import { GameView } from './components/GameView';
import { Shop } from './components/Shop';
import { Button } from './components/Button';
import { convertScoreToCoins } from './core/economy';
import { useGameState } from './hooks/useGameState';

const App: React.FC = () => {
  const { gameState, setGameState } = useGameState();

  // Блокировка горизонтальной ориентации на мобильных
  useEffect(() => {
    const lockOrientation = () => {
      if (window.innerWidth < 768) {
        const orientation = (window.screen as any).orientation;
        if (orientation && typeof orientation.lock === 'function') {
          orientation.lock('portrait').catch(() => {});
        }
      }
    };
    lockOrientation();
    window.addEventListener('resize', lockOrientation);
    return () => window.removeEventListener('resize', lockOrientation);
  }, []);

  const [screen, setScreen] = useState<'menu' | 'game' | 'shop' | 'result'>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [lastScore, setLastScore] = useState(0);
  const [coinsGained, setCoinsGained] = useState(0);

  const handlePurchase = (type: 'word' | 'diff', id: string, price: number) => {
    setGameState(prev => {
      if (prev.coins < price) return prev;
      const newState = { ...prev, coins: prev.coins - price };
      if (type === 'word') newState.ownedWords = [...newState.ownedWords, id];
      if (type === 'diff') newState.unlockedDifficulties = [...newState.unlockedDifficulties, id as Difficulty];
      return newState;
    });
  };

  const handleGameFinish = (score: number) => {
    const prevBest = gameState.highScores[selectedDifficulty] || 0;
    
    // Всегда начисляем алмазы за прохождение согласно ТЗ: Coins = sqrt(TotalScore) × DifficultyFactor
    const gained = convertScoreToCoins(score, selectedDifficulty);

    setGameState(prev => ({
      ...prev,
      coins: prev.coins + gained,
      highScores: {
        ...prev.highScores,
        [selectedDifficulty]: Math.max(prev.highScores[selectedDifficulty], score)
      }
    }));
    
    setLastScore(score);
    setCoinsGained(gained);
    setScreen('result');
  };

  if (screen === 'game') {
    return <GameView difficulty={selectedDifficulty} gameState={gameState} onFinish={handleGameFinish} onQuit={() => setScreen('menu')} />;
  }

  if (screen === 'shop') {
    return <Shop state={gameState} onPurchase={handlePurchase} onBack={() => setScreen('menu')} />;
  }

  return (
    <div className="h-screen w-screen bg-[#020202] flex flex-col items-center justify-center p-[clamp(0.5rem,2vw,1.5rem)] relative overflow-hidden">
      <div className="absolute inset-0 tattoo-pattern pointer-events-none opacity-30"></div>
      <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none select-none">
        <div className="absolute w-full h-[200vh] animate-scroll-up" style={{top: '100vh'}}>
          {Array.from({length: 80}).map((_, i) => (
            <div 
              key={i} 
              className="absolute font-black text-[clamp(0.8rem,2.5vw,3rem)] uppercase tracking-tighter transform -rotate-12 oswald text-[#32CD32] whitespace-nowrap flex items-center gap-[clamp(0.25rem,1vw,1.5rem)]"
              style={{
                left: `${(i % 5) * 20}%`,
                top: `${(i % 10) * 10}%`
              }}
            >
              <span>ПЭПЭ НА БОГАТОМ</span>
              <span className="diamond-sparkle text-white">🤑</span>
              <span className="text-[#D4AF37]">ТОЛЬКО КЭШ</span>
            </div>
          ))}
        </div>
      </div>

      <div className="z-10 text-center space-y-[clamp(0.5rem,2vh,2rem)] w-full max-w-[768px] mx-auto flex flex-col items-center">
        {screen === 'menu' ? (
          <div className="space-y-[clamp(0.5rem,2.5vh,2.5rem)] animate-in fade-in slide-in-from-bottom duration-1000 w-full flex flex-col items-center">
             <div className="title-container relative inline-block">
                <div className="absolute -left-[clamp(2rem,8vw,8rem)] top-0 text-[clamp(2rem,8vw,6rem)] opacity-40 transform -rotate-45">🏛️</div>
                <div className="absolute -right-[clamp(2rem,8vw,8rem)] bottom-0 text-[clamp(2rem,8vw,6rem)] opacity-40 transform rotate-45">💹</div>
                
                <h1 className="unbounded font-black italic luxury-gradient leading-[0.75] transform -skew-x-12 drop-shadow-[0_30px_80px_rgba(50,205,50,0.6)] gold-glow" style={{fontSize: 'clamp(2.5rem, 12vw, 14rem)'}}>
                    ПЭПЭ,<br/>ФАШНЕЛЬ!
                </h1>
                
                <div className="absolute -top-[clamp(1rem,4vh,4rem)] -left-[clamp(1rem,4vw,4rem)] text-[clamp(2rem,6vw,4.5rem)] diamond-sparkle">🐸</div>
                <div className="absolute top-1/2 -right-[clamp(1.5rem,6vw,6rem)] text-[clamp(2rem,6vw,4.5rem)] diamond-sparkle delay-200">💰</div>
                
                <div className="absolute -top-[clamp(0.75rem,3vh,3rem)] -right-[clamp(2rem,8vw,8rem)] bg-[#32CD32] text-black font-black px-[clamp(0.75rem,3vw,3rem)] py-[clamp(0.25rem,1.5vh,1.25rem)] text-[clamp(0.75rem,3vw,2.25rem)] rotate-12 shadow-[15px_15px_0px_#D4AF37] oswald border-[clamp(2px,0.3vw,4px)] border-black">
                    LEGUSHONOK BOSS
                </div>
             </div>
             
             <div className="p-[clamp(2px,0.3vw,8px)] text-white rounded-[clamp(2rem,10vw,5rem)] shadow-3xl w-full max-w-[90vw] transform hover:scale-[1.03] transition-all duration-500 border-[clamp(2px,0.3vw,4px)] border-[#D4AF37] bg-[#111]/90">
                 <div className="bg-[#050505]/98 backdrop-blur-3xl p-[clamp(0.5rem,2.5vw,2.5rem)] rounded-[clamp(1.9rem,9.6vw,4.8rem)] space-y-[clamp(0.5rem,2vh,2rem)] w-full border-2 border-white/5">
                    <div className="space-y-[clamp(0.5rem,1.5vh,1.5rem)]">
                       <h3 className="text-[clamp(0.6rem,1.5vw,1.5rem)] font-black tracking-[0.6em] text-[#D4AF37] uppercase oswald flex items-center justify-center gap-[clamp(0.25rem,1.5vw,1.5rem)]">
                          <span className="diamond-sparkle">💹</span>
                          ВЫБЕРИ УРОВЕНЬ ПРОФИТА
                          <span className="diamond-sparkle">💹</span>
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(0.5rem,2vw,2rem)]">
                          {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => {
                              const diff = key as Difficulty;
                              const unlocked = gameState.unlockedDifficulties.includes(diff);
                              const isSelected = selectedDifficulty === diff;
                              return (
                                  <button key={key} onClick={() => unlocked && setSelectedDifficulty(diff)} className={`
                                    border-[clamp(2px,0.3vw,4px)] p-[clamp(0.5rem,2vw,2rem)] rounded-[clamp(1rem,5vw,2.5rem)] transition-all font-black oswald tracking-widest
                                    ${isSelected ? 'bg-white text-black border-[#32CD32] scale-110 shadow-[0_0_40px_rgba(50,205,50,0.8)]' : 'bg-[#1a1a1a] text-zinc-300 border-zinc-700 hover:border-[#D4AF37] hover:bg-[#222]'}
                                    ${!unlocked ? 'cursor-not-allowed grayscale bg-white text-black border-zinc-400' : 'cursor-pointer'}
                                  `} style={{fontSize: 'clamp(0.6rem, 1.5vw, 1.5rem)'}}>
                                     {cfg.label}
                                     <div className="text-[clamp(0.35rem,0.8vw,0.8rem)] opacity-90 mt-[clamp(0.25rem,0.75vh,0.75rem)] font-mono text-[#32CD32]">МИНТ: {gameState.highScores[diff]}</div>
                                  </button>
                              );
                          })}
                       </div>
                    </div>

                    <div className="flex flex-col gap-[clamp(0.5rem,1.5vh,1.5rem)] w-full">
                       <Button 
                         onClick={() => setScreen('game')} 
                         variant="secondary"
                         className="w-full py-[clamp(0.5rem,2vh,2rem)] !bg-transparent !text-[#D4AF37] !border-[#D4AF37] hover:!bg-[#D4AF37]/10 hover:!text-[#D4AF37] hover:!border-[#D4AF37] gold-glow" 
                         style={{fontSize: 'clamp(0.75rem, 3vw, 2.5rem)'}}
                       >
                          ЗАФАРМИТЬ КЭШ 💸
                       </Button>
                       <Button onClick={() => setScreen('shop')} variant="secondary" className="w-full py-[clamp(0.5rem,1.5vh,1.5rem)] border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black" style={{fontSize: 'clamp(0.6rem, 2vw, 1.5rem)'}}>
                          ЗАЛУТАТЬ СТИЛЬ 💎
                       </Button>
                    </div>

                    <div className="font-black oswald border-t-[clamp(2px,0.3vw,4px)] border-zinc-900 pt-[clamp(0.5rem,2vh,2rem)] flex items-center justify-center gap-[clamp(0.25rem,1.5vw,1.5rem)]" style={{fontSize: 'clamp(0.6rem, 2.5vw, 2.5rem)'}}>
                       <span className="text-zinc-600 text-[clamp(0.3rem,0.6vw,0.7rem)] uppercase tracking-[1em]">КАПИТАЛ:</span> 
                       <span className="text-[#32CD32] tabular-nums drop-shadow-[0_0_20px_rgba(50,205,50,0.5)]" style={{fontSize: 'clamp(1.2rem, 5vw, 4rem)'}}>
                          {gameState.coins.toLocaleString()} <span className="diamond-sparkle inline-block">💎</span>
                       </span>
                    </div>
                 </div>
             </div>
          </div>
        ) : (
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
                      {lastScore}
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
                
                <Button onClick={() => setScreen('menu')} variant="primary" className="w-full py-[clamp(0.5rem,2vh,2rem)] gold-glow mt-[clamp(0.5rem,2vh,2rem)] bg-[#32CD32] text-black hover:bg-white border-white" style={{fontSize: 'clamp(0.6rem, 2.5vw, 2.5rem)'}}>
                    НАЗАД В ПЕНТХАУС 🦅
                </Button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
