export type PuzzleType = 'drag-number' | 'photon-match' | 'drag-orbit' | 'schrodinger-quiz' | 'entanglement-match';

export interface PuzzleTarget {
  id: string;
  label: string;
  correctOptionId: string;
}

export interface PuzzleOption {
  id: string;
  label: string;
  value: string;
}

export interface Puzzle {
  type: PuzzleType;
  title: string;
  instruction: string;
  targets: PuzzleTarget[];
  options: PuzzleOption[];
  question?: string;
  correctAnswerId?: string;
  distractors?: PuzzleOption[];
}

export interface Recording {
  title: string;
  text: string;
  speaker: string;
  year: string;
}

export interface ScientistConcept {
  title: string;
  formula: string;
  formulaParts: {
    left: string;
    blank: string;
    right: string;
  };
  description: string;
  history: string;
}

export interface ScientistAnecdote {
  id: string;
  title: string;
  scientist: string;
  content: string;
  year?: string;
}

export interface Scientist {
  id: string;
  name: string;
  nameEn: string;
  years: string;
  contribution: string;
  accentColor: 'cyan' | 'purple' | 'orange';
  concept: ScientistConcept;
  puzzle: Puzzle;
  recording: Recording;
  anecdotes?: ScientistAnecdote[];
}
