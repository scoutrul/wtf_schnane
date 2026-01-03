
import { useState, useEffect } from 'react';
import { GameState, Difficulty } from '../types';
import { storageGetItem, storageSetItem } from '../services/yandexStorage';

const STORAGE_KEY = 'pepi_fashnel_save_v8_money_god';

const INITIAL_STATE: GameState = {
  score: 0,
  coins: 0,
  ownedWords: ['pepe'], // Первое слово бесплатно
  unlockedDifficulties: [Difficulty.EASY], // Лёгкий уровень бесплатный
  highScores: { 
    [Difficulty.EASY]: 0, 
    [Difficulty.MEDIUM]: 0, 
    [Difficulty.HARD]: 0 
  }
};

/**
 * Хук для управления состоянием игры с автоматическим сохранением
 */
export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка состояния из storage
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await storageGetItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setGameState(parsed);
        }
      } catch (error) {
        console.warn('Failed to load state:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, []);

  // Сохранение состояния в storage с debounce
  useEffect(() => {
    if (!isLoaded) return;
    
    const timeoutId = setTimeout(() => {
      storageSetItem(STORAGE_KEY, JSON.stringify(gameState)).catch((error) => {
        console.warn('Failed to save state:', error);
      });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [gameState, isLoaded]);

  return { gameState, setGameState, isLoaded };
}
