
/**
 * Модуль для работы с комбо-системой согласно ТЗ
 * 
 * Правила комбо:
 * - Комбо засчитывается, если вставки идут подряд без больших пауз
 * - Используются разные слова (повторы запрещены)
 * - Каждая вставка оценена не ниже "хорошо"
 * 
 * Формула: ComboMultiplier = 1 + (ComboLength - 1) × 0.35
 * Максимум в MVP: 4
 */

export interface ComboState {
  length: number;
  multiplier: number;
  lastWordId: string | null;
  lastInsertTime: number;
}

const MAX_COMBO_MULTIPLIER = 4;
const COMBO_COEFFICIENT = 0.35;
const COMBO_TIME_WINDOW = 3000; // 3 секунды для поддержания комбо

/**
 * Вычисляет множитель комбо согласно ТЗ
 * ComboMultiplier = 1 + (ComboLength - 1) × 0.35
 */
export function calculateComboMultiplier(length: number): number {
  const multiplier = 1 + (length - 1) * COMBO_COEFFICIENT;
  return Math.min(multiplier, MAX_COMBO_MULTIPLIER);
}

/**
 * Обновляет состояние комбо на основе новой вставки
 * 
 * @param currentState - текущее состояние комбо
 * @param wordId - ID вставленного слова
 * @param insertTime - время вставки
 * @param timingQuality - качество тайминга (должно быть не ниже "хорошо")
 * @returns новое состояние комбо
 */
export function updateCombo(
  currentState: ComboState,
  wordId: string,
  insertTime: number,
  timingQuality: 'perfect' | 'good' | 'normal' | 'poor'
): ComboState {
  const now = insertTime;
  const timeSinceLastInsert = now - currentState.lastInsertTime;
  
  // Проверка: комбо прерывается, если:
  // 1. Прошло слишком много времени (> COMBO_TIME_WINDOW)
  // 2. Использовано то же слово (повтор запрещен)
  // 3. Тайминг ниже "хорошо" (normal или poor)
  
  const isTimingGood = timingQuality === 'perfect' || timingQuality === 'good';
  const isDifferentWord = currentState.lastWordId !== wordId;
  const isWithinTimeWindow = timeSinceLastInsert <= COMBO_TIME_WINDOW;
  
  if (!isTimingGood || !isDifferentWord || !isWithinTimeWindow) {
    // Комбо прерывается, начинаем заново
    return {
      length: 1,
      multiplier: 1,
      lastWordId: wordId,
      lastInsertTime: now
    };
  }
  
  // Комбо продолжается
  const newLength = currentState.length + 1;
  const newMultiplier = calculateComboMultiplier(newLength);
  
  return {
    length: newLength,
    multiplier: newMultiplier,
    lastWordId: wordId,
    lastInsertTime: now
  };
}

/**
 * Создает начальное состояние комбо
 */
export function createInitialComboState(): ComboState {
  return {
    length: 0,
    multiplier: 1,
    lastWordId: null,
    lastInsertTime: 0
  };
}
