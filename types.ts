
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
  poem: string[];
  style: string;
  price: number;
  color: string;
}

export interface WordInstrument {
  id: string;
  text: string;
  syllables: number;
  rhythm: string; // e.g. "2x1/8"
  character: string;
  description: string;
  price: number;
  pitch: number; // For synth sound
}

export interface Stanza {
  lines: string[];
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
