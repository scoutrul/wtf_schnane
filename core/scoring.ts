
import { WordInstrument, ScoreBreakdown } from '../types';

// Константы для подсчета очков согласно ТЗ
export const BASE_INSERT_SCORE = 100;

// Модификаторы тайминга согласно ТЗ
export enum TimingQuality {
  POOR = 'poor',      // ×0.2
  NORMAL = 'normal',  // ×0.6
  GOOD = 'good',      // ×1.0
  PERFECT = 'perfect' // ×1.4
}

export const TIMING_MULTIPLIERS = {
  [TimingQuality.POOR]: 0.2,
  [TimingQuality.NORMAL]: 0.6,
  [TimingQuality.GOOD]: 1.0,
  [TimingQuality.PERFECT]: 1.4,
};

// Пороги для определения качества тайминга (в миллисекундах)
export const TIMING_THRESHOLDS = {
  PERFECT: 80,   // < 80ms - идеально
  GOOD: 160,     // < 160ms - хорошо
  NORMAL: 280,   // < 280ms - нормально
  // > 280ms - плохо
};

/**
 * Определяет качество тайминга на основе отклонения от бита
 */
export function getTimingQuality(offsetMs: number): TimingQuality {
  const absOffset = Math.abs(offsetMs);
  
  if (absOffset < TIMING_THRESHOLDS.PERFECT) {
    return TimingQuality.PERFECT;
  } else if (absOffset < TIMING_THRESHOLDS.GOOD) {
    return TimingQuality.GOOD;
  } else if (absOffset < TIMING_THRESHOLDS.NORMAL) {
    return TimingQuality.NORMAL;
  } else {
    return TimingQuality.POOR;
  }
}

/**
 * Модификаторы ритмической уместности согласно ТЗ
 */
export enum RhythmQuality {
  CONFLICT = 'conflict',  // ×0.5
  ACCEPTABLE = 'acceptable', // ×1.0
  APPROPRIATE = 'appropriate' // ×1.2
}

export const RHYTHM_MULTIPLIERS = {
  [RhythmQuality.CONFLICT]: 0.5,
  [RhythmQuality.ACCEPTABLE]: 1.0,
  [RhythmQuality.APPROPRIATE]: 1.2,
};

/**
 * Определяет ритмическую уместность
 * Упрощенная версия: паузы (нечетные биты) более уместны
 */
export function getRhythmQuality(beatCount: number): RhythmQuality {
  const isPause = beatCount % 2 === 1;
  // Паузы более уместны для вставок
  if (isPause) {
    return RhythmQuality.APPROPRIATE;
  }
  return RhythmQuality.ACCEPTABLE;
}

/**
 * Модификаторы перекрытия согласно ТЗ
 */
export enum OverlapType {
  PAUSE = 'pause',           // ×1.2
  UNSTRESSED = 'unstressed', // ×1.0
  STRESSED = 'stressed'      // ×0.6
}

export const OVERLAP_MULTIPLIERS = {
  [OverlapType.PAUSE]: 1.2,
  [OverlapType.UNSTRESSED]: 1.0,
  [OverlapType.STRESSED]: 0.6,
};

/**
 * Определяет тип перекрытия
 * Упрощенная версия: паузы (нечетные биты) считаются паузами
 */
export function getOverlapType(beatCount: number): OverlapType {
  const isPause = beatCount % 2 === 1;
  if (isPause) {
    return OverlapType.PAUSE;
  }
  // Упрощение: четные биты считаем безударными слогами
  return OverlapType.UNSTRESSED;
}

/**
 * Вычисляет очки за вставку согласно ТЗ
 * InsertScore = BaseInsertScore × TimingMultiplier × RhythmMultiplier × OverlapMultiplier × ComboMultiplier
 */
export function calculateInsertScore(
  word: WordInstrument,
  timingOffset: number,
  beatCount: number,
  comboMultiplier: number
): ScoreBreakdown {
  const timingQuality = getTimingQuality(timingOffset);
  const timingMult = TIMING_MULTIPLIERS[timingQuality];
  
  const rhythmQuality = getRhythmQuality(beatCount);
  const rhythmMult = RHYTHM_MULTIPLIERS[rhythmQuality];
  
  const overlapType = getOverlapType(beatCount);
  const overlapMult = OVERLAP_MULTIPLIERS[overlapType];
  
  const total = Math.round(
    BASE_INSERT_SCORE * 
    timingMult * 
    rhythmMult * 
    overlapMult * 
    comboMultiplier
  );
  
  return {
    total,
    timing: timingMult,
    rhythm: rhythmMult,
    overlap: overlapMult,
    combo: comboMultiplier
  };
}

/**
 * Получает текстовую метку для качества тайминга
 */
export function getTimingLabel(quality: TimingQuality): string {
  switch (quality) {
    case TimingQuality.PERFECT:
      return 'МИНТ! 💹';
    case TimingQuality.GOOD:
      return 'КЭШ! 💰';
    case TimingQuality.NORMAL:
      return 'ХАЙП';
    case TimingQuality.POOR:
      return 'СЛАБО БРО...';
  }
}

/**
 * Получает цвет для качества тайминга
 */
export function getTimingColor(quality: TimingQuality): string {
  switch (quality) {
    case TimingQuality.PERFECT:
      return '#32CD32';
    case TimingQuality.GOOD:
      return '#D4AF37';
    case TimingQuality.NORMAL:
      return '#FF1493';
    case TimingQuality.POOR:
      return '#777';
  }
}
