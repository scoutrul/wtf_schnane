
import { Difficulty } from '../types';
import { DIFFICULTY_CONFIG } from '../constants';

/**
 * Модуль для работы с экономикой игры
 * 
 * Начисление алмазов:
 * - Первый проход: Diamonds = floor(S_current * K_difficulty / 100)
 * - Повторный проход (побил рекорд): Diamonds = floor(ΔS * K_difficulty / 100), где ΔS = S_current - S_record
 * - Повторный проход (не побил): Diamonds = 0
 * 
 * Коэффициенты сложности:
 * - Лёгкий: 1.0
 * - Средний: 1.5
 * - Сложный: 2.0
 */

/**
 * Вычисляет количество алмазов, заработанных за текущую игру
 * Алмазы начисляются ТОЛЬКО за улучшение результата
 * 
 * @param currentScore - текущий счет
 * @param previousBestScore - предыдущий лучший счет (0 если первый проход)
 * @param difficulty - уровень сложности
 * @returns количество заработанных алмазов
 */
export function calculateCoinsGained(
  currentScore: number,
  previousBestScore: number,
  difficulty: Difficulty
): number {
  const factor = DIFFICULTY_CONFIG[difficulty].factor;
  
  // Первый проход (рекорда нет)
  if (previousBestScore === 0) {
    return Math.floor(currentScore * factor / 100);
  }
  
  // Повторный проход - начисляем только за улучшение
  if (currentScore > previousBestScore) {
    const deltaScore = currentScore - previousBestScore;
    return Math.floor(deltaScore * factor / 100);
  }
  
  // Не побил рекорд - алмазов нет
  return 0;
}

/**
 * Вычисляет потенциальный профит (алмазы) для текущего счета
 * Используется для отображения во время игры
 * 
 * @param currentScore - текущий счет
 * @param previousBestScore - предыдущий лучший счет
 * @param difficulty - уровень сложности
 * @returns потенциальное количество алмазов
 */
export function calculatePotentialCoins(
  currentScore: number,
  previousBestScore: number,
  difficulty: Difficulty
): number {
  return calculateCoinsGained(currentScore, previousBestScore, difficulty);
}
