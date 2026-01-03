
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Difficulty, GameState } from '../types';
import { POEM_LUKOMORYE, DIFFICULTY_CONFIG, BEAT_DURATION, WORDS } from '../constants';
import { audioEngine } from '../services/audioEngine';
import { Button } from './Button';
import { calculateInsertScore, getTimingQuality, getTimingLabel, getTimingColor } from '../core/scoring';
import { updateCombo, createInitialComboState, ComboState } from '../core/combo';
import { getTimingOffset } from '../core/rhythm';

interface GameViewProps {
  difficulty: Difficulty;
  gameState: GameState;
  onFinish: (score: number) => void;
  onQuit: () => void;
}

export const GameView: React.FC<GameViewProps> = ({ difficulty, gameState, onFinish, onQuit }) => {
  const [score, setScore] = useState(0);
  const [comboState, setComboState] = useState<ComboState>(createInitialComboState());
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [beatCount, setBeatCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [feedbacks, setFeedbacks] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);
  const [lineWords, setLineWords] = useState<Record<number, { text: string; color: string }[]>>({});
  const [linePresses, setLinePresses] = useState<number>(0);

  const config = DIFFICULTY_CONFIG[difficulty];
  const poem = POEM_LUKOMORYE.slice(0, config.stanzas * 4);
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isCountingDownRef = useRef(false);
  const currentLineIndexRef = useRef(-1);

  useEffect(() => {
    audioEngine.init();
    return () => { 
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const spawnFeedback = (text: string, color: string = '#D4AF37') => {
    const id = Date.now();
    const x = 50 + (Math.random() * 40 - 20);
    const y = 30 + (Math.random() * 20 - 10);
    setFeedbacks(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => { 
      setFeedbacks(prev => prev.filter(f => f.id !== id)); 
    }, 800);
  };

  const handleInput = useCallback((wordId: string) => {
    if (!isRunning || currentLineIndexRef.current < 0 || isCountingDown) return;
    
    const word = WORDS.find(w => w.id === wordId);
    if (!word) return;

    audioEngine.playWord(word.pitch);
    const now = Date.now();
    const timingOffset = getTimingOffset(now, startTimeRef.current);
    const timingQualityEnum = getTimingQuality(timingOffset);
    
    // Обновляем комбо (преобразуем enum в строку для совместимости)
    const timingQualityStr = timingQualityEnum as 'perfect' | 'good' | 'normal' | 'poor';
    const newComboState = updateCombo(comboState, wordId, now, timingQualityStr);
    setComboState(newComboState);
    
    // Вычисляем очки
    const result = calculateInsertScore(
      word,
      timingOffset,
      beatCount,
      newComboState.multiplier
    );
    
    setScore(prev => Math.max(0, prev + result.total));
    
    // Показываем фидбек
    const timingLabel = getTimingLabel(timingQualityEnum);
    const timingColor = getTimingColor(timingQualityEnum);
    spawnFeedback(timingLabel, timingColor);
    
    // Добавляем слово в визуализацию
    setLineWords(prev => ({
      ...prev,
      [currentLineIndexRef.current]: [
        ...(prev[currentLineIndexRef.current] || []), 
        { text: word.text, color: word.color }
      ]
    }));
    setLinePresses(p => p + 1);
  }, [isRunning, isCountingDown, beatCount, comboState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, number> = { 
        '1': 0, '2': 1, '3': 2, '4': 3,
        'z': 0, 'x': 1, 'c': 2, 'v': 3
      };
      const index = keyMap[e.key.toLowerCase()];
      if (index !== undefined) {
        const owned = WORDS.filter(w => gameState.ownedWords.includes(w.id));
        if (owned[index]) {
          handleInput(owned[index].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.ownedWords, handleInput]);

  const stopGame = useCallback((finished: boolean) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setIsCountingDown(false);
    isCountingDownRef.current = false;
    if (finished) {
      setTimeout(() => onFinish(score), 800);
    }
  }, [onFinish, score]);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsRunning(true);
    setIsCountingDown(true);
    isCountingDownRef.current = true;
    currentLineIndexRef.current = -1;
    setCurrentLineIndex(-1);
    setScore(0);
    setComboState(createInitialComboState());
    setBeatCount(0);
    setLinePresses(0);
    setLineWords({});
    
    startTimeRef.current = Date.now();
    
    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const currentBeat = Math.floor((now - startTimeRef.current) / BEAT_DURATION);
      
      setBeatCount(prev => {
        if (currentBeat > prev) {
          // Звук метронома
          audioEngine.playClick(currentBeat % 4 === 0 ? 660 : 330, 0.04, 0.02);

          if (currentBeat < 8) {
            // Обратный отсчет
          } else {
            if (isCountingDownRef.current) {
              isCountingDownRef.current = false;
              setIsCountingDown(false);
            }

            const poemBeat = currentBeat - 8;
            // Каждая строка занимает 8 битов
            if (poemBeat % 8 === 0) {
              const nextIdx = currentLineIndexRef.current + 1;
              if (nextIdx < poem.length) {
                currentLineIndexRef.current = nextIdx;
                setCurrentLineIndex(nextIdx);
                setLinePresses(0);
              } else if (poemBeat >= poem.length * 8 + 4) {
                stopGame(true);
              }
            }
          }
          return currentBeat;
        }
        return prev;
      });
    }, 16);
  }, [poem.length, stopGame]);

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-[#020202] overflow-hidden select-none h-screen w-screen">
      <div className="absolute inset-0 tattoo-pattern pointer-events-none opacity-20"></div>
      
      {feedbacks.map(f => (
        <div key={f.id} className="absolute font-black oswald animate-bounce z-50 pointer-events-none text-center whitespace-nowrap italic tracking-tighter" 
             style={{
               left: `${f.x}%`, 
               top: `${f.y}%`, 
               color: f.color, 
               textShadow: `0 0 50px ${f.color}`,
               fontSize: 'clamp(1.5rem, 8vw, 10rem)'
             }}>
          {f.text}
        </div>
      ))}

      <div className="w-full flex justify-between items-start px-[clamp(0.5rem,2vw,2rem)] pt-[clamp(0.5rem,2vh,2rem)] z-40 pointer-events-none">
        <div className="flex flex-col gap-[clamp(0.25rem,1vh,1rem)]">
            <div className="bg-black/90 border-[clamp(2px,0.3vw,4px)] border-[#32CD32] px-[clamp(0.5rem,2vw,2rem)] py-[clamp(0.25rem,1.5vh,1.25rem)] rounded-[clamp(0.5rem,1.5vw,1.5rem)] shadow-[0_0_30px_rgba(50,205,50,0.6)] pointer-events-auto min-w-[clamp(90px,20vw,180px)] flex flex-col items-center transform -rotate-2">
                <div className="text-[#32CD32] font-black uppercase tracking-[0.4em] oswald" style={{fontSize: 'clamp(0.35rem,0.9vw,0.875rem)'}}>TOTAL ASSETS</div>
                <div className="font-black tabular-nums oswald text-white gold-glow" style={{fontSize: 'clamp(1rem,3vw,3rem)'}}>{score.toLocaleString()}</div>
            </div>
            {isRunning && (
                <div className="pointer-events-auto flex gap-[clamp(0.25rem,0.75vw,0.75rem)]">
                    <button onClick={startGame} className="bg-[#32CD32] text-black border-2 border-white px-[clamp(0.25rem,1.25vw,1.25rem)] py-[clamp(0.125rem,0.5vh,0.5rem)] rounded-xl font-black uppercase oswald transition-all hover:scale-105" style={{fontSize: 'clamp(0.35rem,0.75vw,0.75rem)'}}>MINT AGAIN</button>
                    <button onClick={() => stopGame(false)} className="bg-red-700 text-white border-2 border-white px-[clamp(0.25rem,1.25vw,1.25rem)] py-[clamp(0.125rem,0.5vh,0.5rem)] rounded-xl font-black uppercase oswald transition-all hover:scale-105" style={{fontSize: 'clamp(0.35rem,0.75vw,0.75rem)'}}>CASH OUT</button>
                </div>
            )}
        </div>
        
        <div className="bg-black/90 border-[clamp(2px,0.3vw,4px)] border-[#FF1493] px-[clamp(0.5rem,2vw,2rem)] py-[clamp(0.25rem,1.5vh,1.25rem)] rounded-[clamp(0.5rem,1.5vw,1.5rem)] shadow-[0_0_30px_rgba(255,20,147,0.6)] text-right pointer-events-auto min-w-[clamp(90px,20vw,180px)] flex flex-col items-center transform rotate-2">
          <div className="text-[#FF1493] font-black uppercase tracking-[0.4em] oswald" style={{fontSize: 'clamp(0.35rem,0.9vw,0.875rem)'}}>COMBO PROFIT</div>
          <div className="font-black tabular-nums oswald text-[#FF1493]" style={{fontSize: 'clamp(1rem,3vw,3rem)'}}>{comboState.multiplier.toFixed(2)}x</div>
          <div className="text-[#FF1493] text-[clamp(0.3rem,0.7vw,0.7rem)] mt-1">COMBO: {comboState.length}</div>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center z-10 relative px-[clamp(0.25rem,1.5vw,1.5rem)] overflow-hidden">
        {!isRunning ? (
          <div className="text-center space-y-[clamp(0.5rem,3vh,3rem)] animate-in zoom-in duration-500 w-full flex flex-col items-center">
            <h2 className="unbounded font-black luxury-gradient italic drop-shadow-[0_0_60px_rgba(50,205,50,0.5)] leading-tight" style={{fontSize: 'clamp(2rem, 10vw, 12rem)'}}>READY TO MINT?</h2>
            <div className="flex flex-col gap-[clamp(0.5rem,2vh,2rem)] w-full max-w-[90vw]">
               <Button onClick={startGame} className="py-[clamp(0.5rem,2.5vh,2.5rem)] gold-glow w-full bg-[#32CD32] text-black border-white animate-pulse rounded-[clamp(1rem,8vw,4rem)]" style={{fontSize: 'clamp(0.75rem, 2.5vw, 2.25rem)'}}>START MINTING 🔥</Button>
               <Button onClick={onQuit} variant="danger" className="font-bold w-full border-zinc-800" style={{fontSize: 'clamp(0.5rem, 1.25vw, 1.25rem)'}}>CANCELED</Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
            {isCountingDown ? (
                <div className="text-center space-y-[clamp(0.5rem,2.5vh,2.5rem)] flex flex-col items-center">
                    <div className="text-zinc-500 uppercase tracking-[1em] font-black oswald" style={{fontSize: 'clamp(0.75rem, 2.5vw, 2.25rem)'}}>MINTING IN...</div>
                    <div className="font-black text-white leading-none oswald gold-glow transform -rotate-6 italic" style={{fontSize: 'clamp(8rem, 20vw, 20rem)'}}>
                        {Math.max(1, 4 - Math.floor((beatCount % 8)/2))}
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-[95vw] flex flex-col items-center relative h-full justify-center">
                    <div className="h-[clamp(20vh,40vh,50vh)] w-full relative mask-fade flex items-center justify-center overflow-hidden">
                        {[-2, -1, 0, 1, 2].map(offset => {
                            const idx = currentLineIndex + offset;
                            if (idx < 0 || idx >= poem.length) return null;
                            const isCurrent = offset === 0;
                            const absOffset = Math.abs(offset);
                            const opacity = isCurrent ? 1 : absOffset === 1 ? 0.5 : 0.15;
                            const scale = isCurrent ? 1.25 : absOffset === 1 ? 0.95 : 0.85;
                            const blur = isCurrent ? '0px' : '4px';

                            return (
                                <div key={idx} 
                                     className={`absolute transition-all duration-500 flex flex-col items-center transform w-full ${isCurrent ? 'z-20' : 'z-10'}`} 
                                     style={{ 
                                         top: `${50 + offset * 28}%`,
                                         opacity: opacity,
                                         scale: scale,
                                         filter: `blur(${blur})`
                                     }}>
                                    <div className={`font-black text-center px-[clamp(0.25rem,2vw,2rem)] max-w-full overflow-hidden text-ellipsis whitespace-nowrap tracking-tighter oswald ${isCurrent ? 'text-white drop-shadow-[0_0_30px_rgba(50,205,50,0.6)]' : 'text-zinc-800'}`} 
                                         style={{ fontSize: isCurrent ? 'clamp(1.5rem, 4.2vw, 4.2rem)' : 'clamp(1rem, 2.8vw, 2.8rem)' }}>
                                        {poem[idx]}
                                    </div>
                                    {isCurrent && (
                                         <div className="flex flex-wrap justify-center gap-[clamp(0.25rem,1.5vw,1.5rem)] mt-[clamp(0.25rem,2vh,2rem)]" style={{height: 'clamp(1.5rem, 3vh, 3rem)'}}>
                                            {lineWords[idx]?.map((w, i) => (
                                                <span key={i} className="font-black uppercase bg-black border-[clamp(2px,0.3vw,4px)] rounded-[clamp(0.5rem,1.5vw,1.5rem)] shadow-3xl animate-in slide-in-from-bottom-4" style={{color: w.color, borderColor: w.color, fontSize: 'clamp(0.35rem,0.875vw,0.875rem)', padding: 'clamp(0.125rem,0.5vw,0.5rem) clamp(0.25rem,1.5vw,1.5rem)'}}>
                                                    {w.text}
                                                </span>
                                            ))}
                                         </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="w-full flex flex-col items-center mt-[clamp(0.5rem,3vh,3rem)]">
                        <div className="flex gap-[clamp(0.25rem,2vw,2rem)] mb-[clamp(0.5rem,3vh,3rem)]">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className={`rounded-full transition-all duration-200 ${beatCount % 4 === i ? 'bg-[#32CD32] scale-x-150 shadow-[0_0_30px_#32CD32]' : 'bg-zinc-900'}`} style={{width: 'clamp(0.75rem, 5vw, 5rem)', height: 'clamp(2px, 0.75vh, 0.75rem)'}} />
                            ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(0.25rem,2vw,2rem)] w-full max-w-[95vw] px-[clamp(0.25rem,2vw,2rem)]">
                            {WORDS.filter(w => gameState.ownedWords.includes(w.id)).slice(0, 8).map((word, idx) => {
                                return (
                                    <button
                                        key={word.id}
                                        onClick={() => handleInput(word.id)}
                                        className="relative border-[clamp(2px,0.3vw,4px)] rounded-[clamp(0.75rem,5vw,2.5rem)] transition-all active:scale-90 group overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a] border-zinc-800 shadow-2xl hover:border-[#32CD32]/50"
                                        style={{ 
                                          padding: 'clamp(0.5rem, 2.5vh, 2.5rem) clamp(0.25rem, 1.5vw, 1.5rem)'
                                        }}
                                    >
                                        <div className="absolute top-[clamp(0.125rem,0.75vh,0.75rem)] left-[clamp(0.25rem,1.5vw,1.5rem)] font-black opacity-40 oswald text-[#32CD32]" style={{fontSize: 'clamp(0.35rem,0.875vw,0.875rem)'}}>{idx + 1}</div>
                                        <div className="font-black uppercase tracking-tighter oswald italic" style={{ color: word.color, fontSize: 'clamp(0.75rem, 2.5vw, 2.25rem)' }}>{word.text}</div>
                                        <div className="font-black text-zinc-600 uppercase mt-[clamp(0.125rem,0.75vh,0.75rem)] tracking-[0.3em]" style={{fontSize: 'clamp(0.275rem,0.7vw,0.7rem)'}}>{word.character}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-[clamp(0.25rem,1.5vh,1.5rem)] right-[clamp(0.25rem,2vw,2rem)] text-[#32CD32] font-mono uppercase opacity-50 flex items-center gap-[clamp(0.125rem,1vw,1rem)]" style={{fontSize: 'clamp(0.3rem,0.75vw,0.75rem)', letterSpacing: '1em'}}>
        <span className="diamond-sparkle">💸</span> PEPE RICHEST WORLD DOMINATION <span className="diamond-sparkle">💸</span>
      </div>
    </div>
  );
};
