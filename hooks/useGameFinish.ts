import { useState, useCallback } from 'react';
import { Author, Difficulty, GameState } from '../types';
import { calculateCoinsGained } from '../core/economy';

interface UseGameFinishProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  selectedAuthor: Author | null;
  selectedDifficulty: Difficulty;
  onNavigateToResult: () => void;
}

export function useGameFinish({
  gameState,
  setGameState,
  selectedAuthor,
  selectedDifficulty,
  onNavigateToResult,
}: UseGameFinishProps) {
  const [lastScore, setLastScore] = useState(0);
  const [coinsGained, setCoinsGained] = useState(0);
  const [previousRecord, setPreviousRecord] = useState(0);
  const [newRecord, setNewRecord] = useState(0);
  const [scoreDifference, setScoreDifference] = useState(0);

  const handleGameFinish = useCallback((score: number) => {
    if (!selectedAuthor || !selectedDifficulty) {
      console.warn('handleGameFinish: missing author or difficulty', { selectedAuthor, selectedDifficulty, score });
      return;
    }
    
    // Вычисляем gained до обновления стейта
    const prevBest = gameState.highScores[selectedAuthor]?.[selectedDifficulty] || 0;
    const gained = calculateCoinsGained(score, prevBest, selectedDifficulty);
    const newBest = Math.max(prevBest, score);
    const difference = score > prevBest ? score - prevBest : 0;
    
    console.log('handleGameFinish:', { score, prevBest, gained, newBest, difference, selectedAuthor, selectedDifficulty });
    
    // Сначала обновляем локальное состояние для ResultScreen
    setLastScore(score);
    setCoinsGained(gained);
    setPreviousRecord(prevBest);
    setNewRecord(newBest);
    setScoreDifference(difference);
    
    // Затем обновляем глобальное состояние
    setGameState(prev => {
      return {
        ...prev,
        coins: prev.coins + gained,
        highScores: {
          ...prev.highScores,
          [selectedAuthor]: {
            ...prev.highScores[selectedAuthor],
            [selectedDifficulty]: newBest
          }
        }
      };
    });
    
    // Переходим на экран результата
    onNavigateToResult();
  }, [selectedAuthor, selectedDifficulty, setGameState, onNavigateToResult, gameState.highScores]);

  return {
    lastScore,
    coinsGained,
    previousRecord,
    newRecord,
    scoreDifference,
    handleGameFinish,
  };
}
