
import { Difficulty } from '../types';
import { DIFFICULTY_CONFIG } from '../constants';

/**
 * Модуль для работы с экономикой игры согласно ТЗ
 * 
 * Конвертация Score → Coins:
 * Coins = sqrt(TotalScore) × DifficultyFactor
 * 
 * Коэффициенты сложности:
 * - Лёгкий: 0.6
 * - Средний: 1.0
 * - Сложный: 1.4
 */

/**
 * Конвертирует очки (Score) в монеты (Coins) согласно ТЗ
 * 
 * @param totalScore - общее количество очков за игру
 * @param difficulty - уровень сложности
 * @returns количество монет
 */
export function convertScoreToCoins(totalScore: number, difficulty: Difficulty): number {
  const factor = DIFFICULTY_CONFIG[difficulty].factor;
  const coins = Math.sqrt(totalScore) * factor;
  return Math.round(coins);
}

/**
 * Вычисляет количество монет, заработанных за текущую игру
 * (только за превышение предыдущего рекорда)
 * 
 * @param currentScore - текущий счет
 * @param previousBestScore - предыдущий лучший счет
 * @param difficulty - уровень сложности
 * @returns количество заработанных монет
 */
export function calculateCoinsGained(
  currentScore: number,
  previousBestScore: number,
  difficulty: Difficulty
): number {
  const currentCoins = convertScoreToCoins(currentScore, difficulty);
  const previousCoins = convertScoreToCoins(previousBestScore, difficulty);
  const gained = Math.max(0, currentCoins - previousCoins);
  return gained;
}
