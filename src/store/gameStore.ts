import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  energyLevel: number;
  maxEnergyLevel: number;
  completedPuzzles: string[];
  unlockedRecordings: string[];
  currentScientist: string | null;
  
  superpositionTotalGuesses: number;
  superpositionCorrectGuesses: number;
  superpositionConsecutiveCorrect: number;
  catEmojiRewardActive: boolean;

  incrementLevel: () => void;
  decrementLevel: () => void;
  resetLevel: () => void;
  completePuzzle: (puzzleId: string) => void;
  unlockRecording: (recordingId: string) => void;
  setCurrentScientist: (id: string | null) => void;
  isPuzzleCompleted: (puzzleId: string) => boolean;
  isRecordingUnlocked: (recordingId: string) => boolean;
  recordSuperpositionGuess: (isCorrect: boolean) => void;
  activateCatEmojiReward: () => void;
  consumeCatEmojiReward: () => void;
  resetAll: () => void;
}

const INITIAL_LEVEL = 1;
const MAX_LEVEL = 5;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      energyLevel: INITIAL_LEVEL,
      maxEnergyLevel: INITIAL_LEVEL,
      completedPuzzles: [],
      unlockedRecordings: [],
      currentScientist: null,
      superpositionTotalGuesses: 0,
      superpositionCorrectGuesses: 0,
      superpositionConsecutiveCorrect: 0,
      catEmojiRewardActive: false,

      incrementLevel: () =>
        set((state) => {
          const newLevel = Math.min(state.energyLevel + 1, MAX_LEVEL);
          return {
            energyLevel: newLevel,
            maxEnergyLevel: Math.max(state.maxEnergyLevel, newLevel),
          };
        }),

      decrementLevel: () =>
        set((state) => ({
          energyLevel: Math.max(state.energyLevel - 1, 0),
        })),

      resetLevel: () =>
        set(() => ({
          energyLevel: INITIAL_LEVEL,
        })),

      completePuzzle: (puzzleId: string) =>
        set((state) => ({
          completedPuzzles: state.completedPuzzles.includes(puzzleId)
            ? state.completedPuzzles
            : [...state.completedPuzzles, puzzleId],
        })),

      unlockRecording: (recordingId: string) =>
        set((state) => ({
          unlockedRecordings: state.unlockedRecordings.includes(recordingId)
            ? state.unlockedRecordings
            : [...state.unlockedRecordings, recordingId],
        })),

      setCurrentScientist: (id: string | null) =>
        set(() => ({
          currentScientist: id,
        })),

      isPuzzleCompleted: (puzzleId: string) =>
        get().completedPuzzles.includes(puzzleId),

      isRecordingUnlocked: (recordingId: string) =>
        get().unlockedRecordings.includes(recordingId),

      recordSuperpositionGuess: (isCorrect: boolean) =>
        set((state) => {
          const newConsecutive = isCorrect
            ? state.superpositionConsecutiveCorrect + 1
            : 0;
          const shouldActivateReward = newConsecutive >= 3 && !state.catEmojiRewardActive;
          return {
            superpositionTotalGuesses: state.superpositionTotalGuesses + 1,
            superpositionCorrectGuesses: state.superpositionCorrectGuesses + (isCorrect ? 1 : 0),
            superpositionConsecutiveCorrect: shouldActivateReward ? 0 : newConsecutive,
            catEmojiRewardActive: shouldActivateReward || state.catEmojiRewardActive,
          };
        }),

      activateCatEmojiReward: () =>
        set(() => ({
          catEmojiRewardActive: true,
        })),

      consumeCatEmojiReward: () =>
        set(() => ({
          catEmojiRewardActive: false,
        })),

      resetAll: () =>
        set(() => ({
          energyLevel: INITIAL_LEVEL,
          maxEnergyLevel: INITIAL_LEVEL,
          completedPuzzles: [],
          unlockedRecordings: [],
          currentScientist: null,
          superpositionTotalGuesses: 0,
          superpositionCorrectGuesses: 0,
          superpositionConsecutiveCorrect: 0,
          catEmojiRewardActive: false,
        })),
    }),
    {
      name: 'quantum-game-storage',
    }
  )
);
