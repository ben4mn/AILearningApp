import { useEffect, useRef, useCallback } from 'react';

export function useAutoComplete(
  containerRef: React.RefObject<HTMLElement | null>,
  onComplete: () => void,
  enabled: boolean = true
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasCompleted = useRef(false);

  const handleComplete = useCallback(() => {
    if (hasCompleted.current || !enabled) return;
    hasCompleted.current = true;
    onComplete();
  }, [onComplete, enabled]);

  useEffect(() => {
    hasCompleted.current = false;
  }, [enabled]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleComplete();
        }
      },
      { root: container, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [containerRef, handleComplete, enabled]);

  return sentinelRef;
}
