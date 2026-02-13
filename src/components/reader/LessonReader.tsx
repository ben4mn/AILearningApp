import { useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getLesson, getLessonId, getNextLesson, getPrevLesson } from '../../lib/curriculum';
import { ERA_COLORS } from '../../lib/constants';
import { useProgressStore } from '../../store/progressStore';
import { useStreakStore } from '../../store/streakStore';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useAutoComplete } from '../../hooks/useAutoComplete';
import { ReaderProgress } from './ReaderProgress';
import { ReaderHeader } from './ReaderHeader';
import { LessonNav } from './LessonNav';
import { markdownComponents } from './MarkdownComponents';

const MIN_TIME_MS = 3000;

export function LessonReader() {
  const { topicSlug, lessonSlug } = useParams<{ topicSlug: string; lessonSlug: string }>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const mountTime = useRef(Date.now());
  const progress = useScrollProgress(scrollRef);

  const result = topicSlug && lessonSlug ? getLesson(topicSlug, lessonSlug) : undefined;
  const markCompleted = useProgressStore((s) => s.markCompleted);
  const markInProgress = useProgressStore((s) => s.markInProgress);
  const updateScroll = useProgressStore((s) => s.updateScroll);
  const lessonStatus = useProgressStore((s) => {
    if (!topicSlug || !lessonSlug) return undefined;
    return s.lessons[getLessonId(topicSlug, lessonSlug)]?.status;
  });
  const recordCompletion = useStreakStore((s) => s.recordCompletion);
  const recordReading = useStreakStore((s) => s.recordReading);

  const isAlreadyCompleted = lessonStatus === 'completed';

  const handleAutoComplete = useCallback(() => {
    if (!topicSlug || !lessonSlug || isAlreadyCompleted) return;
    const id = getLessonId(topicSlug, lessonSlug);
    markCompleted(id, topicSlug);
    recordCompletion();
  }, [topicSlug, lessonSlug, isAlreadyCompleted, markCompleted, recordCompletion]);

  const { sentinelRef, readyToComplete } = useAutoComplete(scrollRef, handleAutoComplete, !isAlreadyCompleted);

  // Reset mount time when lesson changes
  useEffect(() => {
    mountTime.current = Date.now();
  }, [topicSlug, lessonSlug]);

  // Mark as in-progress on mount
  useEffect(() => {
    if (!topicSlug || !lessonSlug) return;
    const id = getLessonId(topicSlug, lessonSlug);
    markInProgress(id, topicSlug);
    recordReading();
  }, [topicSlug, lessonSlug, markInProgress, recordReading]);

  // Update scroll progress
  useEffect(() => {
    if (!topicSlug || !lessonSlug || isAlreadyCompleted) return;
    const id = getLessonId(topicSlug, lessonSlug);
    updateScroll(id, topicSlug, progress);
  }, [progress, topicSlug, lessonSlug, isAlreadyCompleted, updateScroll]);

  // Backup completion trigger: if observer fired too early and time has now passed
  useEffect(() => {
    if (isAlreadyCompleted || !topicSlug || !lessonSlug) return;
    if (progress >= 95 && readyToComplete.current && Date.now() - mountTime.current >= MIN_TIME_MS) {
      handleAutoComplete();
    }
  }, [progress, isAlreadyCompleted, topicSlug, lessonSlug, handleAutoComplete, readyToComplete]);

  // Scroll restore or scroll to top
  // Uses ResizeObserver to wait for ReactMarkdown content to render before restoring
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !topicSlug || !lessonSlug) return;

    const id = getLessonId(topicSlug, lessonSlug);
    const saved = useProgressStore.getState().lessons[id];
    const targetPercent = (saved?.status === 'in-progress' && saved.scrollPercent > 0 && saved.scrollPercent < 100)
      ? saved.scrollPercent
      : 0;

    if (targetPercent === 0) {
      el.scrollTo(0, 0);
      return;
    }

    // Content isn't rendered yet on first frame — watch for the container to grow
    let restored = false;
    const observer = new ResizeObserver(() => {
      if (restored) return;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable > 0) {
        restored = true;
        el.scrollTo(0, (targetPercent / 100) * scrollable);
        observer.disconnect();
      }
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [topicSlug, lessonSlug]);

  if (!result || !topicSlug || !lessonSlug) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        Section not found
      </div>
    );
  }

  const { topic, lesson, lessonIndex } = result;
  const color = ERA_COLORS[topic.eraId] || '#F59E0B';
  const next = getNextLesson(topicSlug, lessonSlug);
  const prev = getPrevLesson(topicSlug, lessonSlug);

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <ReaderProgress progress={progress} color={color} />
      <ReaderHeader
        title={lesson.title}
        lessonNumber={lessonIndex + 1}
        totalLessons={topic.lessons.length}
        color={color}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <article className="max-w-2xl mx-auto px-5 py-6">
          <ReactMarkdown components={markdownComponents}>
            {lesson.content}
          </ReactMarkdown>

          {/* Auto-complete sentinel */}
          <div ref={sentinelRef} className="h-4" />
        </article>

        <LessonNav prev={prev} next={next} isCompleted={!next && isAlreadyCompleted} />
      </div>
    </div>
  );
}
