import { useParams, useNavigate } from 'react-router-dom';
import { getTopic, getLessonId, getTopicCompletionCount } from '../lib/curriculum';
import { ERA_COLORS } from '../lib/constants';
import { useProgressStore } from '../store/progressStore';
import { useCompletedSet } from '../hooks/useProgress';
import { eras } from '../content/curriculum';

export function ChapterPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const navigate = useNavigate();
  const completedSet = useCompletedSet();
  const lessons = useProgressStore((s) => s.lessons);
  const markUnread = useProgressStore((s) => s.markUnread);

  const topic = topicSlug ? getTopic(topicSlug) : undefined;

  if (!topic || !topicSlug) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        Chapter not found
      </div>
    );
  }

  const era = eras.find((e) => e.id === topic.eraId);
  const color = ERA_COLORS[topic.eraId] || '#F59E0B';
  const completed = getTopicCompletionCount(topicSlug, completedSet);
  const total = topic.lessons.length;
  const totalWords = topic.lessons.reduce((sum, l) => sum + l.wordCount, 0);
  const totalMinutes = topic.lessons.reduce((sum, l) => sum + l.readingTimeMinutes, 0);

  return (
    <div className="min-h-screen bg-slate-900" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
            </button>
            {era && (
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {era.name}
              </span>
            )}
          </div>
        </div>

        {/* Chapter info */}
        <div className="px-5 pb-4">
          <h1 className="text-xl font-bold text-slate-100 mb-2">{topic.title}</h1>
          <p className="text-sm text-slate-400 mb-3">{topic.description}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{total} sections</span>
            <span>·</span>
            <span>{totalMinutes} min</span>
            <span>·</span>
            <span>{totalWords.toLocaleString()} words</span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${total > 0 ? Math.round((completed / total) * 100) : 0}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-xs text-slate-500 mt-1 block">{completed}/{total} completed</span>
        </div>

        {/* Section list */}
        <div className="px-5 pb-8">
          {topic.lessons.map((lesson, index) => {
            const lessonId = getLessonId(topicSlug, lesson.slug);
            const progress = lessons[lessonId];
            const isCompleted = progress?.status === 'completed';
            const isInProgress = progress?.status === 'in-progress';

            return (
              <div key={lesson.slug} className="flex items-start gap-3 mb-1">
                <button
                  onClick={() => navigate(`/read/${topicSlug}/${lesson.slug}`)}
                  className="flex-1 flex items-start gap-3 py-3 text-left min-h-[44px] rounded-lg active:bg-slate-800/50 transition-colors"
                >
                  {/* Status indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: color }}
                      >
                        <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : isInProgress ? (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center border-2"
                        style={{ borderColor: color }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-600">
                        <span className="text-xs font-medium text-slate-500">{index + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium leading-tight ${isCompleted ? 'text-slate-300' : isInProgress ? 'text-slate-200' : 'text-slate-400'}`}>
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>{lesson.readingTimeMinutes} min</span>
                      <span>·</span>
                      <span>{lesson.wordCount.toLocaleString()} words</span>
                    </div>
                    {isInProgress && progress.scrollPercent > 0 && (
                      <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden w-full max-w-[200px]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${progress.scrollPercent}%`, backgroundColor: color }}
                        />
                      </div>
                    )}
                  </div>
                </button>

                {/* Mark unread button */}
                {isCompleted && (
                  <button
                    onClick={() => markUnread(lessonId)}
                    className="flex-shrink-0 mt-3 p-2 text-slate-600 hover:text-slate-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Mark unread"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
