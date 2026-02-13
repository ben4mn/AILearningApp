import { useMemo } from 'react';
import { useProgressStore } from '../store/progressStore';

/** Stable completed set — only recomputes when `lessons` object changes */
export function useCompletedSet(): Set<string> {
  const lessons = useProgressStore((s) => s.lessons);
  return useMemo(() => {
    return new Set(
      Object.values(lessons)
        .filter((l) => l.status === 'completed')
        .map((l) => l.lessonId)
    );
  }, [lessons]);
}

/** Stable completed count */
export function useCompletedCount(): number {
  const lessons = useProgressStore((s) => s.lessons);
  return useMemo(() => {
    return Object.values(lessons).filter((l) => l.status === 'completed').length;
  }, [lessons]);
}
