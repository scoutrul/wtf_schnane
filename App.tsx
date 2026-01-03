
import React, { useState, useEffect } from 'react';
import { Difficulty, GameState } from './types';
import { DIFFICULTY_CONFIG } from './constants';
import { GameView } from './components/GameView';
import { Shop } from './components/Shop';
import { Button } from './components/Button';

const STORAGE_KEY = 'pepi_fashnel_save_v8_money_god';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      score: 0,
      coins: 0,
      ownedWords: ['pepe'],
      unlockedDifficulties: [Difficulty.EASY],
      highScores: { [Difficulty.EASY]: 0, [Difficulty.MEDIUM]: 0, [Difficulty.HARD]: 0 }
    };
  });

  const [screen, setScreen] = useState<'menu' | 'game' | 'shop' | 'result'>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [lastScore, setLastScore] = useState(0);
  const [coinsGained, setCoinsGained] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

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
    const factor = DIFFICULTY_CONFIG[selectedDifficulty].factor;
    
    // Сверхзвуковая доходность: множитель 200
    const newCoinsPotential = Math.round(Math.sqrt(score) * 200 * factor);
    const oldCoinsPotential = Math.round(Math.sqrt(prevBest) * 200 * factor);
    const gained = Math.max(0, newCoinsPotential - oldCoinsPotential);

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
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 tattoo-pattern pointer-events-none opacity-30"></div>
      <div className="absolute inset-0 flex flex-wrap content-start items-center justify-center opacity-50 pointer-events-none select-none">
        {Array.from({length: 40}).map((_, i) => (
            <div key={i} className="m-12 font-black text-5xl uppercase tracking-tighter transform -rotate-12 oswald text-[#32CD32] whitespace-nowrap flex items-center gap-6">
               <span>ПЭПЭ НА БОГАТОМ</span>
               <span className="diamond-sparkle text-white">🤑</span>
               <span className="text-[#D4AF37]">CASH ONLY</span>
            </div>
        ))}
      </div>

      <div className="z-10 text-center space-y-12 w-full max-w-5xl flex flex-col items-center">
        {screen === 'menu' ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom duration-1000 w-full flex flex-col items-center">
             <div className="title-container relative inline-block">
                <div className="absolute -left-32 top-0 text-8xl opacity-40 transform -rotate-45">🏛️</div>
                <div className="absolute -right-32 bottom-0 text-8xl opacity-40 transform rotate-45">💹</div>
                
                <h1 className="unbounded text-8xl md:text-[14rem] font-black italic luxury-gradient leading-[0.75] transform -skew-x-12 drop-shadow-[0_30px_80px_rgba(50,205,50,0.6)] gold-glow">
                    ПЭПЭ,<br/>ФАШНЕЛЬ!
                </h1>
                
                <div className="absolute -top-16 -left-16 text-7xl diamond-sparkle">🐸</div>
                <div className="absolute top-1/2 -right-24 text-7xl diamond-sparkle delay-200">💰</div>
                
                <div className="absolute -top-12 -right-32 bg-[#32CD32] text-black font-black px-12 py-5 text-4xl rotate-12 shadow-[15px_15px_0px_#D4AF37] oswald border-4 border-black">
                    LEGUSHONOK BOSS
                </div>
             </div>
             
             <div className="shiny-pants p-2 text-white rounded-[5rem] shadow-3xl w-full max-w-3xl transform hover:scale-[1.03] transition-all duration-500 border-4 border-[#D4AF37]">
                 <div className="bg-[#050505]/98 backdrop-blur-3xl p-16 rounded-[4.8rem] space-y-14 w-full border-2 border-white/5">
                    <div className="space-y-10">
                       <h3 className="text-2xl font-black tracking-[0.6em] text-[#D4AF37] uppercase oswald flex items-center justify-center gap-6">
                          <span className="diamond-sparkle">💹</span>
                          SELECT YOUR PROFIT LEVEL
                          <span className="diamond-sparkle">💹</span>
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => {
                              const diff = key as Difficulty;
                              const unlocked = gameState.unlockedDifficulties.includes(diff);
                              const isSelected = selectedDifficulty === diff;
                              return (
                                  <button key={key} onClick={() => unlocked && setSelectedDifficulty(diff)} className={`
                                    border-4 p-8 rounded-[2.5rem] transition-all font-black text-2xl oswald tracking-widest
                                    ${isSelected ? 'bg-white text-black border-[#32CD32] scale-110 shadow-[0_0_40px_rgba(50,205,50,0.8)]' : 'bg-black text-zinc-600 border-zinc-900'}
                                    ${!unlocked ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:border-[#D4AF37]'}
                                  `}>
                                     {cfg.label}
                                     <div className="text-[13px] opacity-90 mt-3 font-mono text-[#32CD32]">MINTED: {gameState.highScores[diff]}</div>
                                  </button>
                              );
                          })}
                       </div>
                    </div>

                    <div className="flex flex-col gap-10 w-full">
                       <Button onClick={() => setScreen('game')} className="text-6xl py-12 bg-[#32CD32] text-black hover:bg-white border-black w-full gold-glow animate-pulse rounded-[3rem]">
                          MAKE IT RAIN 💸
                       </Button>
                       <Button onClick={() => setScreen('shop')} variant="secondary" className="text-4xl w-full py-10 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                          WORLD BOUTIQUE 💎
                       </Button>
                    </div>

                    <div className="text-5xl font-black oswald border-t-4 border-zinc-900 pt-12 flex items-center justify-center gap-8">
                       <span className="text-zinc-600 text-sm uppercase tracking-[1em]">CAPITAL:</span> 
                       <span className="text-[#32CD32] tabular-nums text-8xl drop-shadow-[0_0_20px_rgba(50,205,50,0.5)]">
                          {gameState.coins.toLocaleString()} <span className="diamond-sparkle inline-block">👑</span>
                       </span>
                    </div>
                 </div>
             </div>
          </div>
        ) : (
          <div className="shiny-pants p-3 rounded-[6rem] animate-in zoom-in duration-700 w-full max-w-5xl border-8 border-[#32CD32]">
              <div className="bg-[#000]/95 backdrop-blur-3xl p-28 rounded-[5.5rem] space-y-20 text-center flex flex-col items-center w-full">
                <div className="relative">
                    <h2 className="unbounded text-9xl md:text-[12rem] font-black italic luxury-gradient drop-shadow-[0_0_60px_rgba(50,205,50,0.8)] leading-none">
                        PROFIT!
                    </h2>
                    <div className="absolute -top-16 -right-16 text-8xl diamond-sparkle">🏦</div>
                </div>
                
                <div className="space-y-12 w-full">
                  <div className="text-zinc-500 font-bold uppercase tracking-[1.5em] text-sm oswald flex items-center justify-center gap-8">
                     <span className="h-1 w-24 bg-[#32CD32]"></span>
                     STATUS: MONEY GOD
                     <span className="h-1 w-24 bg-[#32CD32]"></span>
                  </div>
                  <div className="text-[18rem] font-black text-white drop-shadow-[0_0_80px_#32CD32] oswald leading-none scale-125 transform rotate-2 italic">
                      {lastScore}
                  </div>
                  {coinsGained > 0 ? (
                      <div className="text-7xl text-[#D4AF37] font-black italic oswald tracking-widest animate-bounce mt-16 flex items-center justify-center gap-8">
                         <span className="diamond-sparkle text-8xl">👑</span>
                         + {coinsGained.toLocaleString()} BUCKS
                         <span className="diamond-sparkle text-8xl">👑</span>
                      </div>
                  ) : (
                      <div className="text-3xl text-zinc-600 oswald uppercase tracking-[0.6em] italic">GET MORE POPULARITY, BRO.</div>
                  )}
                </div>
                
                <Button onClick={() => setScreen('menu')} variant="primary" className="w-full py-12 text-5xl gold-glow mt-10 bg-[#32CD32] text-black hover:bg-white border-white">
                    BACK TO PENTHOUSE 🦅
                </Button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
