import { useState } from 'react';
import { Author, Difficulty } from '../types';

export type Screen = 'author-select' | 'difficulty-select' | 'game' | 'shop' | 'result';

export function useScreenNavigation() {
  const [screen, setScreen] = useState<Screen>('author-select');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);

  const navigateToAuthorSelect = () => setScreen('author-select');
  const navigateToDifficultySelect = (author: Author) => {
    setSelectedAuthor(author);
    setScreen('difficulty-select');
  };
  const navigateToGame = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setScreen('game');
  };
  const navigateToShop = () => setScreen('shop');
  const navigateToResult = () => setScreen('result');

  return {
    screen,
    selectedAuthor,
    selectedDifficulty,
    navigateToAuthorSelect,
    navigateToDifficultySelect,
    navigateToGame,
    navigateToShop,
    navigateToResult,
  };
}
