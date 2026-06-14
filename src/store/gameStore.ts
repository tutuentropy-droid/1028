import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PhotonHit } from '@/types';

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

  photonHits: PhotonHit[];
  fringeContrast: number;
  consecutiveCorrectScientists: string[];
  unlockedInterferences: string[];
  specialLevelUnlocked: boolean;
  totalPhotons: number;

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

  addPhotonHit: (hit: PhotonHit) => void;
  removePhotons: (count: number) => void;
  setFringeContrast: (contrast: number) => void;
  addConsecutiveCorrectScientist: (scientistId: string) => boolean;
  resetConsecutiveCorrectScientists: () => void;
  unlockInterference: (id: string) => void;
  unlockSpecialLevel: () => void;
  clearAllPhotons: () => void;

  resetAll: () => void;
}

const INITIAL_LEVEL = 1;
const MAX_LEVEL = 5;
const CONTRAST_THRESHOLD = 70;

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

      photonHits: [],
      fringeContrast: 0,
      consecutiveCorrectScientists: [],
      unlockedInterferences: [],
      specialLevelUnlocked: false,
      totalPhotons: 0,

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

      addPhotonHit: (hit: PhotonHit) =>
        set((state) => {
          const newHits = [...state.photonHits, hit];
          const newTotal = state.totalPhotons + 1;
          const completed = state.completedPuzzles.length;
          const totalScientists = 6;
          const hitDensity = Math.min(100, newHits.length / 15);
          const completionBonus = (completed / totalScientists) * 40;
          const accuracyFactor = state.totalPhotons > 0
            ? Math.min(100, (state.totalPhotons / (state.totalPhotons + Math.max(0, state.totalPhotons - newHits.length * 0.5))) * 100)
            : 100;
          const newContrast = Math.min(100, hitDensity * 0.4 + completionBonus + accuracyFactor * 0.1);
          const shouldUnlock = newContrast >= CONTRAST_THRESHOLD && !state.specialLevelUnlocked;
          
          return {
            photonHits: newHits.slice(-500),
            totalPhotons: newTotal,
            fringeContrast: newContrast,
            specialLevelUnlocked: shouldUnlock || state.specialLevelUnlocked,
          };
        }),

      removePhotons: (count: number) =>
        set((state) => {
          const removeCount = Math.min(count, state.photonHits.length);
          const newHits = state.photonHits.slice(0, state.photonHits.length - removeCount);
          const hitDensity = Math.min(100, newHits.length / 15);
          const completed = state.completedPuzzles.length;
          const totalScientists = 6;
          const completionBonus = (completed / totalScientists) * 40;
          const newContrast = Math.max(0, hitDensity * 0.4 + completionBonus);
          
          return {
            photonHits: newHits,
            fringeContrast: newContrast,
          };
        }),

      setFringeContrast: (contrast: number) =>
        set(() => ({
          fringeContrast: Math.max(0, Math.min(100, contrast)),
        })),

      addConsecutiveCorrectScientist: (scientistId: string) => {
        const current = get().consecutiveCorrectScientists;
        if (current.length > 0 && current[current.length - 1] === scientistId) {
          return false;
        }
        const newList = [...current, scientistId].slice(-5);
        set({ consecutiveCorrectScientists: newList });
        return newList.length >= 2 && newList[newList.length - 1] !== newList[newList.length - 2];
      },

      resetConsecutiveCorrectScientists: () =>
        set(() => ({
          consecutiveCorrectScientists: [],
        })),

      unlockInterference: (id: string) =>
        set((state) => ({
          unlockedInterferences: state.unlockedInterferences.includes(id)
            ? state.unlockedInterferences
            : [...state.unlockedInterferences, id],
        })),

      unlockSpecialLevel: () =>
        set(() => ({
          specialLevelUnlocked: true,
        })),

      clearAllPhotons: () =>
        set(() => ({
          photonHits: [],
          fringeContrast: 0,
          totalPhotons: 0,
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
          photonHits: [],
          fringeContrast: 0,
          consecutiveCorrectScientists: [],
          unlockedInterferences: [],
          specialLevelUnlocked: false,
          totalPhotons: 0,
        })),
    }),
    {
      name: 'quantum-game-storage',
    }
  )
);
