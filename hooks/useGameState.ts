
import { useState, useEffect } from 'react';
import { GameState, Difficulty, Author } from '../types';
import { storageGetItem, storageSetItem } from '../services/yandexStorage';

const STORAGE_KEY = 'pepi_fashnel_save_v9_author_system';

const INITIAL_STATE: GameState = {
  score: 0,
  coins: 500,
  ownedWords: ['pepe'], // Первое слово бесплатно
  ownedAuthors: [Author.PUSHKIN], // Пушкин доступен сразу
  unlockedDifficulties: {
    [Author.PUSHKIN]: [Difficulty.EASY], // Только лёгкий для Пушкина
    [Author.ESENIN]: [],
    [Author.MAYAKOVSKY]: []
  },
  highScores: {
    [Author.PUSHKIN]: {
      [Difficulty.EASY]: 0,
      [Difficulty.MEDIUM]: 0,
      [Difficulty.HARD]: 0
    },
    [Author.ESENIN]: {
      [Difficulty.EASY]: 0,
      [Difficulty.MEDIUM]: 0,
      [Difficulty.HARD]: 0
    },
    [Author.MAYAKOVSKY]: {
      [Difficulty.EASY]: 0,
      [Difficulty.MEDIUM]: 0,
      [Difficulty.HARD]: 0
    }
  }
};

// Миграция старых сохранений
function migrateOldState(oldState: any): GameState {
  // Если это старая версия без авторов
  if (!oldState.ownedAuthors || !oldState.unlockedDifficulties || typeof oldState.unlockedDifficulties === 'object' && !oldState.unlockedDifficulties[Author.PUSHKIN]) {
    const existingCoins = oldState.coins || 0;
    const migrated: GameState = {
      ...INITIAL_STATE,
      coins: Math.max(500, existingCoins), // Минимум 500 монет для всех игроков
      ownedWords: oldState.ownedWords || ['pepe'],
      ownedAuthors: [Author.PUSHKIN], // Пушкин доступен
      unlockedDifficulties: {
        [Author.PUSHKIN]: Array.isArray(oldState.unlockedDifficulties) 
          ? oldState.unlockedDifficulties 
          : [Difficulty.EASY],
        [Author.ESENIN]: [],
        [Author.MAYAKOVSKY]: []
      },
      highScores: {
        [Author.PUSHKIN]: {
          [Difficulty.EASY]: oldState.highScores?.[Difficulty.EASY] || 0,
          [Difficulty.MEDIUM]: oldState.highScores?.[Difficulty.MEDIUM] || 0,
          [Difficulty.HARD]: oldState.highScores?.[Difficulty.HARD] || 0
        },
        [Author.ESENIN]: {
          [Difficulty.EASY]: 0,
          [Difficulty.MEDIUM]: 0,
          [Difficulty.HARD]: 0
        },
        [Author.MAYAKOVSKY]: {
          [Difficulty.EASY]: 0,
          [Difficulty.MEDIUM]: 0,
          [Difficulty.HARD]: 0
        }
      }
    };
    return migrated;
  }
  // Для существующих сохранений также устанавливаем минимум 500
  const existingState = oldState as GameState;
  if (existingState.coins < 500) {
    existingState.coins = 500;
  }
  return existingState;
}

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
          const migrated = migrateOldState(parsed);
          setGameState(migrated);
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
