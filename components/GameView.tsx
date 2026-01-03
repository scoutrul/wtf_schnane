
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Difficulty, GameState, WordInstrument, ScoreBreakdown } from '../types';
import { POEM_LUKOMORYE, DIFFICULTY_CONFIG, BEAT_DURATION, WORDS } from '../constants';
import { audioEngine } from '../services/audioEngine';
import { Button } from './Button';

interface GameViewProps {
  difficulty: Difficulty;
  gameState: GameState;
  onFinish: (score: number) => void;
  onQuit: () => void;
}

export const GameView: React.FC<GameViewProps> = ({ difficulty, gameState, onFinish, onQuit }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [beatCount, setBeatCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [lastInsert, setLastInsert] = useState<{ id: string; time: number } | null>(null);
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const spawnFeedback = (text: string, color: string = '#D4AF37') => {
    const id = Date.now();
    const x = 50 + (Math.random() * 40 - 20);
    const y = 30 + (Math.random() * 20 - 10);
    setFeedbacks(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => { setFeedbacks(prev => prev.filter(f => f.id !== id)); }, 800);
  };

  const calculateScore = useCallback((word: WordInstrument & { color: string }, timingOffset: number): ScoreBreakdown => {
    const absOffset = Math.abs(timingOffset);
    let timingMult = 0.1;
    let timingLabel = 'WEAK BRO...';
    let color = '#777';

    if (absOffset < 80) { timingMult = 3.0; timingLabel = 'MINTED! 💹'; color = '#32CD32'; }
    else if (absOffset < 160) { timingMult = 1.8; timingLabel = 'CASH! 💰'; color = '#D4AF37'; }
    else if (absOffset < 280) { timingMult = 1.0; timingLabel = 'HYPE'; color = '#FF1493'; }
    else if (absOffset < 400) { timingMult = 0.5; timingLabel = 'MID'; color = '#1E90FF'; }

    let currentPenalty = 0;
    if (linePresses >= 5) {
        timingLabel = 'SPAM IS FOR POOR';
        color = '#8a2be2';
        timingMult = -3.0; 
        currentPenalty = 1000;
    }

    spawnFeedback(timingLabel, color);

    const isPause = beatCount % 2 === 1;
    const rhythmMult = isPause ? 1.6 : 0.4;
    const overlapMult = isPause ? 1.8 : 0.2;

    let comboMult = 1;
    let newCombo = combo;
    if (lastInsert && lastInsert.id !== word.id && Date.now() - lastInsert.time < BEAT_DURATION * 3) {
      newCombo = Math.min(combo + 0.5, 15);
      comboMult = 1 + (newCombo - 1) * 0.8;
    } else {
      newCombo = 1;
    }
    setCombo(newCombo);

    const total = Math.round(500 * timingMult * rhythmMult * overlapMult * comboMult) - currentPenalty;

    setLineWords(prev => ({
      ...prev,
      [currentLineIndexRef.current]: [...(prev[currentLineIndexRef.current] || []), { text: word.text, color: word.color }]
    }));
    setLinePresses(p => p + 1);

    return { total, timing: timingMult, rhythm: rhythmMult, overlap: overlapMult, combo: comboMult };
  }, [beatCount, combo, lastInsert, linePresses]);

  const handleInput = useCallback((wordId: string) => {
    if (!isRunning || currentLineIndexRef.current < 0 || isCountingDown) return;
    const word = WORDS.find(w => w.id === wordId);
    if (!word) return;

    audioEngine.playWord(word.pitch);
    const now = Date.now();
    const nearestBeat = Math.round((now - startTimeRef.current) / BEAT_DURATION);
    const timingOffset = now - (startTimeRef.current + nearestBeat * BEAT_DURATION);

    const result = calculateScore(word, timingOffset);
    setScore(prev => Math.max(0, prev + result.total));
    setLastInsert({ id: wordId, time: now });
  }, [isRunning, calculateScore, isCountingDown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, number> = { 
        '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7,
        'z': 0, 'x': 1, 'c': 2, 'v': 3, 'b': 4, 'n': 5, 'm': 6, ',': 7
      };
      const index = keyMap[e.key.toLowerCase()];
      if (index !== undefined) {
        const owned = WORDS.filter(w => gameState.ownedWords.includes(w.id));
        if (owned[index]) handleInput(owned[index].id);
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
    if (finished) setTimeout(() => onFinish(score), 800);
  }, [onFinish, score]);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsRunning(true);
    setIsCountingDown(true);
    isCountingDownRef.current = true;
    currentLineIndexRef.current = -1;
    setCurrentLineIndex(-1);
    setScore(0);
    setCombo(0);
    setBeatCount(0);
    setLinePresses(0);
    setLineWords({});
    
    startTimeRef.current = Date.now();
    
    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const currentBeat = Math.floor((now - startTimeRef.current) / BEAT_DURATION);
      
      setBeatCount(prev => {
        if (currentBeat > prev) {
          audioEngine.playClick(currentBeat % 4 === 0 ? 660 : 330, 0.04, 0.02);

          if (currentBeat < 8) {
             // Ready?
          } else {
            if (isCountingDownRef.current) {
              isCountingDownRef.current = false;
              setIsCountingDown(false);
            }

            const poemBeat = currentBeat - 8;
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
        <div key={f.id} className="absolute font-black text-6xl md:text-[10rem] oswald animate-bounce z-50 pointer-events-none text-center whitespace-nowrap italic tracking-tighter" 
             style={{left: `${f.x}%`, top: `${f.y}%`, color: f.color, textShadow: `0 0 50px ${f.color}`}}>
          {f.text}
        </div>
      ))}

      <div className="w-full flex justify-between items-start px-8 pt-8 z-40 pointer-events-none">
        <div className="flex flex-col gap-4">
            <div className="bg-black/90 border-4 border-[#32CD32] px-8 py-5 rounded-3xl shadow-[0_0_30px_rgba(50,205,50,0.6)] pointer-events-auto min-w-[180px] flex flex-col items-center transform -rotate-2">
                <div className="text-[14px] text-[#32CD32] font-black uppercase tracking-[0.4em] oswald">TOTAL ASSETS</div>
                <div className="text-5xl font-black tabular-nums oswald text-white gold-glow">{score.toLocaleString()}</div>
            </div>
            {isRunning && (
                <div className="pointer-events-auto flex gap-3">
                    <button onClick={startGame} className="bg-[#32CD32] text-black border-2 border-white px-5 py-2 rounded-xl text-xs font-black uppercase oswald transition-all hover:scale-105">MINT AGAIN</button>
                    <button onClick={() => stopGame(false)} className="bg-red-700 text-white border-2 border-white px-5 py-2 rounded-xl text-xs font-black uppercase oswald transition-all hover:scale-105">CASH OUT</button>
                </div>
            )}
        </div>
        
        <div className="bg-black/90 border-4 border-[#FF1493] px-8 py-5 rounded-3xl shadow-[0_0_30px_rgba(255,20,147,0.6)] text-right pointer-events-auto min-w-[180px] flex flex-col items-center transform rotate-2">
          <div className="text-[14px] text-[#FF1493] font-black uppercase tracking-[0.4em] oswald">COMBO PROFIT</div>
          <div className="text-5xl font-black tabular-nums oswald text-[#FF1493]">{combo.toFixed(1)}x</div>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center z-10 relative px-6">
        {!isRunning ? (
          <div className="text-center space-y-12 animate-in zoom-in duration-500 w-full flex flex-col items-center">
            <h2 className="unbounded text-8xl md:text-[12rem] font-black luxury-gradient italic drop-shadow-[0_0_60px_rgba(50,205,50,0.5)] leading-tight">READY TO MINT?</h2>
            <div className="flex flex-col gap-8 w-full max-w-md">
               <Button onClick={startGame} className="text-4xl py-10 gold-glow w-full bg-[#32CD32] text-black border-white animate-pulse rounded-[4rem]">START MINTING 🔥</Button>
               <Button onClick={onQuit} variant="danger" className="text-xl font-bold w-full border-zinc-800">CANCELED</Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {isCountingDown ? (
                <div className="text-center space-y-10 flex flex-col items-center">
                    <div className="text-zinc-500 text-4xl uppercase tracking-[1em] font-black oswald">MINTING IN...</div>
                    <div className="text-[20rem] font-black text-white leading-none oswald gold-glow transform -rotate-6 italic">
                        {Math.max(1, 4 - Math.floor((beatCount % 8)/2))}
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-6xl flex flex-col items-center relative">
                    <div className="h-[50vh] w-full relative mask-fade flex items-center justify-center overflow-hidden">
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
                                    <div className={`font-black text-center px-8 max-w-full overflow-hidden text-ellipsis whitespace-nowrap tracking-tighter oswald ${isCurrent ? 'text-white drop-shadow-[0_0_30px_rgba(50,205,50,0.6)]' : 'text-zinc-800'}`} 
                                         style={{ fontSize: isCurrent ? '4.2rem' : '2.8rem' }}>
                                        {poem[idx]}
                                    </div>
                                    {isCurrent && (
                                         <div className="flex flex-wrap justify-center gap-6 mt-8 h-12">
                                            {lineWords[idx]?.map((w, i) => (
                                                <span key={i} className="text-sm font-black uppercase px-6 py-2 bg-black border-4 rounded-2xl shadow-3xl animate-in slide-in-from-bottom-4" style={{color: w.color, borderColor: w.color}}>
                                                    {w.text}
                                                </span>
                                            ))}
                                         </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="w-full flex flex-col items-center mt-12">
                        <div className="flex gap-8 mb-12">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className={`w-20 h-3 rounded-full transition-all duration-200 ${beatCount % 4 === i ? 'bg-[#32CD32] scale-x-150 shadow-[0_0_30px_#32CD32]' : 'bg-zinc-900'}`} />
                            ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl px-8">
                            {WORDS.filter(w => gameState.ownedWords.includes(w.id)).slice(0, 8).map((word, idx) => {
                                const isPressed = lastInsert?.id === word.id && Date.now() - lastInsert.time < 120;
                                return (
                                    <button
                                        key={word.id}
                                        onClick={() => handleInput(word.id)}
                                        className={`
                                            relative py-10 px-6 rounded-[2.5rem] border-4 transition-all active:scale-90 group overflow-hidden flex flex-col items-center justify-center
                                            bg-[#0a0a0a] border-zinc-800 shadow-2xl
                                            ${isPressed ? 'bg-white/15 scale-110 border-white shadow-[0_0_50px_rgba(255,255,255,0.4)]' : 'hover:border-[#32CD32]/50'}
                                        `}
                                        style={{ borderColor: isPressed ? word.color : undefined }}
                                    >
                                        <div className="absolute top-3 left-6 text-sm font-black opacity-40 oswald text-[#32CD32]">{idx + 1}</div>
                                        <div className="text-3xl md:text-4xl font-black uppercase tracking-tighter oswald italic" style={{ color: word.color }}>{word.text}</div>
                                        <div className="text-[11px] font-black text-zinc-600 uppercase mt-3 tracking-[0.3em]">{word.character}</div>
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

      <div className="absolute bottom-6 right-8 text-[12px] text-[#32CD32] font-mono tracking-[1em] uppercase opacity-50 flex items-center gap-4">
        <span className="diamond-sparkle">💸</span> PEPE RICHEST WORLD DOMINATION <span className="diamond-sparkle">💸</span>
      </div>
    </div>
  );
};
