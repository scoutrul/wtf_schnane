import { useCallback } from 'react';
import { Author, Difficulty, GameState } from '../types';

interface UsePurchaseHandlersProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export function usePurchaseHandlers({ gameState, setGameState }: UsePurchaseHandlersProps) {
  const handlePurchase = useCallback((type: 'word', id: string, price: number) => {
    setGameState(prev => {
      if (prev.coins < price) return prev;
      const newState = { ...prev, coins: prev.coins - price };
      if (type === 'word') newState.ownedWords = [...newState.ownedWords, id];
      return newState;
    });
  }, [setGameState]);

  const handleAuthorPurchase = useCallback((author: Author, price: number) => {
    setGameState(prev => {
      if (prev.coins < price) return prev;
      return {
        ...prev,
        coins: prev.coins - price,
        ownedAuthors: [...prev.ownedAuthors, author],
        unlockedDifficulties: {
          ...prev.unlockedDifficulties,
          [author]: [Difficulty.EASY]
        }
      };
    });
  }, [setGameState]);

  const handleDifficultyPurchase = useCallback((author: Author, difficulty: Difficulty, price: number) => {
    setGameState(prev => {
      if (prev.coins < price) return prev;
      const currentUnlocked = prev.unlockedDifficulties[author] || [];
      return {
        ...prev,
        coins: prev.coins - price,
        unlockedDifficulties: {
          ...prev.unlockedDifficulties,
          [author]: [...currentUnlocked, difficulty]
        }
      };
    });
  }, [setGameState]);

  return {
    handlePurchase,
    handleAuthorPurchase,
    handleDifficultyPurchase,
  };
}
