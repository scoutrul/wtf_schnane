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

  const handleGameFinish = useCallback((score: number) => {
    if (!selectedAuthor) return;
    
    // Вычисляем gained до обновления стейта
    const prevBest = gameState.highScores[selectedAuthor]?.[selectedDifficulty] || 0;
    const gained = calculateCoinsGained(score, prevBest, selectedDifficulty);
    
    setGameState(prev => {
      return {
        ...prev,
        coins: prev.coins + gained,
        highScores: {
          ...prev.highScores,
          [selectedAuthor]: {
            ...prev.highScores[selectedAuthor],
            [selectedDifficulty]: Math.max(prevBest, score)
          }
        }
      };
    });
    
    setLastScore(score);
    setCoinsGained(gained);
    onNavigateToResult();
  }, [selectedAuthor, selectedDifficulty, setGameState, onNavigateToResult, gameState.highScores]);

  return {
    lastScore,
    coinsGained,
    handleGameFinish,
  };
}
