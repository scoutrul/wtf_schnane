
import { BPM, BEAT_DURATION, SUBDIVISION } from '../constants';

/**
 * Модуль для работы с ритмической системой согласно ТЗ
 * 
 * Параметры:
 * - BPM: 96
 * - Размер: 4/4
 * - Минимальная ритмическая единица: 1/8
 */

/**
 * Вычисляет ближайший бит к заданному времени
 * 
 * @param currentTime - текущее время в миллисекундах
 * @param startTime - время начала игры в миллисекундах
 * @returns номер бита (начиная с 0)
 */
export function getNearestBeat(currentTime: number, startTime: number): number {
  const elapsed = currentTime - startTime;
  return Math.round(elapsed / BEAT_DURATION);
}

/**
 * Вычисляет отклонение от ближайшего бита
 * 
 * @param currentTime - текущее время в миллисекундах
 * @param startTime - время начала игры в миллисекундах
 * @returns отклонение в миллисекундах (может быть отрицательным)
 */
export function getTimingOffset(currentTime: number, startTime: number): number {
  const elapsed = currentTime - startTime;
  const nearestBeat = Math.round(elapsed / BEAT_DURATION);
  const beatTime = startTime + nearestBeat * BEAT_DURATION;
  return currentTime - beatTime;
}

/**
 * Проверяет, является ли бит паузой (нечетный бит)
 * Паузы считаются лучшими местами для вставок согласно ТЗ
 * 
 * @param beatCount - номер бита
 * @returns true, если это пауза
 */
export function isPauseBeat(beatCount: number): boolean {
  return beatCount % 2 === 1;
}

/**
 * Вычисляет номер такта (4/4 размер)
 * 
 * @param beatCount - номер бита
 * @returns номер такта (начиная с 0)
 */
export function getBarNumber(beatCount: number): number {
  return Math.floor(beatCount / 4);
}

/**
 * Вычисляет позицию внутри такта (0-3)
 * 
 * @param beatCount - номер бита
 * @returns позиция в такте (0, 1, 2, 3)
 */
export function getBeatInBar(beatCount: number): number {
  return beatCount % 4;
}
