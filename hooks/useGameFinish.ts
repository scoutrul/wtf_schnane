import { useState, useCallback } from 'react';
import { Author, Difficulty, GameState } from '../types';
import { convertScoreToCoins } from '../core/economy';

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
    
    const gained = convertScoreToCoins(score, selectedDifficulty);

    setGameState(prev => {
      const prevBest = prev.highScores[selectedAuthor]?.[selectedDifficulty] || 0;
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
  }, [selectedAuthor, selectedDifficulty, setGameState, onNavigateToResult]);

  return {
    lastScore,
    coinsGained,
    handleGameFinish,
  };
}
