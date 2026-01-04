
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum Author {
  PUSHKIN = 'PUSHKIN',
  ESENIN = 'ESENIN',
  MAYAKOVSKY = 'MAYAKOVSKY'
}

export interface AuthorConfig {
  id: Author;
  name: string;
  displayName: string;
  poem: string[][]; // Массив фрагментов: [легкий, средний, сложный]
  style: string;
  price: number;
  color: string;
}

// Тип для ритмической записи: формат "количество×1/знаменатель"
// Примеры: '1×1/4', '2×1/8', '2×1/16', '4×1/8'
export type RhythmNotation = 
  | `${number}×1/4`
  | `${number}×1/8`
  | `${number}×1/16`
  | `${number}×1/2`
  | `${number}×1/32`;

export interface WordInstrument {
  id: string;
  text: string;
  syllables: number;
  rhythm: RhythmNotation;
  character: string;
  description: string;
  price: number;
  pitch: number; // For synth sound
}

export interface Stanza {
  lines: string[];
}

export interface DifficultyConfig {
  factor: number; // Коэффициент для конвертации Score → Coins
  label: string; // Отображаемое название уровня
  price: number; // Цена разблокировки уровня в монетах
}

export interface ScoreBreakdown {
  total: number;
  timing: number;
  rhythm: number;
  overlap: number;
  combo: number;
}

export interface GameState {
  score: number;
  coins: number;
  ownedWords: string[];
  ownedAuthors: Author[];
  unlockedDifficulties: Record<Author, Difficulty[]>;
  highScores: Record<Author, Record<Difficulty, number>>;
}
