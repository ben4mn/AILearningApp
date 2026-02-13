import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StreakData } from '../types';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

interface StreakState extends StreakData {
  recordReading: () => void;
  recordCompletion: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastReadDate: null,
      readDates: [],
      totalLessonsCompleted: 0,

      recordReading: () =>
        set((state) => {
          const today = todayStr();
          if (state.lastReadDate === today) return state;

          const gap = state.lastReadDate ? daysBetween(state.lastReadDate, today) : 0;
          const newStreak = gap === 1 ? state.currentStreak + 1 : gap === 0 ? state.currentStreak : 1;

          return {
            currentStreak: newStreak,
            longestStreak: Math.max(state.longestStreak, newStreak),
            lastReadDate: today,
            readDates: state.readDates.includes(today)
              ? state.readDates
              : [...state.readDates, today],
          };
        }),

      recordCompletion: () => {
        get().recordReading();
        set((state) => ({
          totalLessonsCompleted: state.totalLessonsCompleted + 1,
        }));
      },
    }),
    { name: 'historyapp-streak' }
  )
);
