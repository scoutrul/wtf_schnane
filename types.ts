
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface WordInstrument {
  id: string;
  text: string;
  syllables: number;
  rhythm: string; // e.g. "2x1/8"
  character: string;
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
  unlockedDifficulties: Difficulty[];
  highScores: Record<Difficulty, number>;
}
