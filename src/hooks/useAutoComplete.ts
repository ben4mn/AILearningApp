import { useEffect, useRef, useCallback } from 'react';

const MIN_TIME_MS = 3000;

export function useAutoComplete(
  containerRef: React.RefObject<HTMLElement | null>,
  onComplete: () => void,
  enabled: boolean = true
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasCompleted = useRef(false);
  const mountTime = useRef(Date.now());
  const hasScrolled = useRef(false);
  const readyToComplete = useRef(false);

  // Reset all refs when lesson changes (enabled toggles per-lesson)
  useEffect(() => {
    hasCompleted.current = false;
    hasScrolled.current = false;
    readyToComplete.current = false;
    mountTime.current = Date.now();
  }, [enabled]);

  // Track scroll events to know user has actually scrolled
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const onScroll = () => {
      hasScrolled.current = true;
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [containerRef, enabled]);

  const handleComplete = useCallback(() => {
    if (hasCompleted.current || !enabled) return;

    const elapsed = Date.now() - mountTime.current;
    if (elapsed < MIN_TIME_MS) {
      // Not enough time yet — mark ready so backup trigger can fire later
      readyToComplete.current = true;
      return;
    }

    const container = containerRef.current;
    if (container) {
      const isScrollable = container.scrollHeight > container.clientHeight + 10;
      if (isScrollable && !hasScrolled.current) return;
    }

    hasCompleted.current = true;
    readyToComplete.current = false;
    onComplete();
  }, [onComplete, enabled, containerRef]);

  // IntersectionObserver on sentinel
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

  return { sentinelRef, readyToComplete };
}
