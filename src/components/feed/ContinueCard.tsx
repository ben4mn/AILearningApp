import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import { useCompletedSet } from '../../hooks/useProgress';
import { findContinuePoint, getTopic, getLesson, getLessonId, getTopicCompletionCount } from '../../lib/curriculum';
import { ERA_COLORS } from '../../lib/constants';
import { eras } from '../../content/curriculum';

export function ContinueCard() {
  const navigate = useNavigate();
  const completedSet = useCompletedSet();
  const lessons = useProgressStore((s) => s.lessons);

  const continuePoint = findContinuePoint(completedSet);
  if (!continuePoint) {
    return (
      <div className="mx-5 mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 p-6 text-center">
        <span className="text-3xl mb-2 block">🎉</span>
        <h2 className="text-lg font-bold text-slate-100">All Complete!</h2>
        <p className="text-sm text-slate-400 mt-1">You've read all 108 sections. Incredible.</p>
      </div>
    );
  }

  const { topicSlug, lessonSlug } = continuePoint;
  const topic = getTopic(topicSlug)!;
  const result = getLesson(topicSlug, lessonSlug)!;
  const era = eras.find((e) => e.id === topic.eraId);
  const lessonId = getLessonId(topicSlug, lessonSlug);
  const progress = lessons[lessonId];
  const completedInTopic = getTopicCompletionCount(topicSlug, completedSet);
  const isInProgress = progress?.status === 'in-progress';

  return (
    <button
      onClick={() => navigate(`/read/${topicSlug}/${lessonSlug}`)}
      className="mx-5 mb-6 rounded-2xl bg-slate-800/80 border border-slate-700/50 p-5 text-left w-[calc(100%-2.5rem)] transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: ERA_COLORS[topic.eraId] }}
        />
        <span className="text-xs font-medium text-slate-400">{era?.name}</span>
      </div>

      <h2 className="text-base font-bold text-slate-100 mb-1">
        {isInProgress ? 'Continue Reading' : 'Start Reading'}
      </h2>
      <p className="text-sm text-slate-300 mb-3">{result.lesson.title}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {topic.title} · {completedInTopic}/{topic.lessons.length} sections
        </span>
        <span className="text-xs text-slate-500">{result.lesson.readingTimeMinutes} min</span>
      </div>

      {isInProgress && progress.scrollPercent > 0 && (
        <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all"
            style={{ width: `${progress.scrollPercent}%` }}
          />
        </div>
      )}
    </button>
  );
}
