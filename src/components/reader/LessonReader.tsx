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

export function LessonReader() {
  const { topicSlug, lessonSlug } = useParams<{ topicSlug: string; lessonSlug: string }>();
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const sentinelRef = useAutoComplete(scrollRef, handleAutoComplete, !isAlreadyCompleted);

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

  // Scroll to top when lesson changes
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [topicSlug, lessonSlug]);

  if (!result || !topicSlug || !lessonSlug) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        Lesson not found
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
