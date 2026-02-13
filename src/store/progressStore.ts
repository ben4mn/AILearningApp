import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonProgress } from '../types';

interface ProgressState {
  lessons: Record<string, LessonProgress>;
  markInProgress: (lessonId: string, topicId: string) => void;
  markCompleted: (lessonId: string, topicId: string) => void;
  updateScroll: (lessonId: string, topicId: string, scrollPercent: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      lessons: {},

      markInProgress: (lessonId, topicId) =>
        set((state) => {
          const existing = state.lessons[lessonId];
          if (existing?.status === 'completed') return state;
          return {
            lessons: {
              ...state.lessons,
              [lessonId]: {
                lessonId,
                topicId,
                status: 'in-progress',
                scrollPercent: existing?.scrollPercent ?? 0,
                completedAt: null,
              },
            },
          };
        }),

      markCompleted: (lessonId, topicId) =>
        set((state) => ({
          lessons: {
            ...state.lessons,
            [lessonId]: {
              lessonId,
              topicId,
              status: 'completed',
              scrollPercent: 100,
              completedAt: new Date().toISOString(),
            },
          },
        })),

      updateScroll: (lessonId, topicId, scrollPercent) =>
        set((state) => {
          const existing = state.lessons[lessonId];
          if (existing?.status === 'completed') return state;
          return {
            lessons: {
              ...state.lessons,
              [lessonId]: {
                lessonId,
                topicId,
                status: 'in-progress',
                scrollPercent,
                completedAt: null,
              },
            },
          };
        }),
    }),
    { name: 'historyapp-progress' }
  )
);
