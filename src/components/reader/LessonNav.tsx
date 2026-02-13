import { useNavigate } from 'react-router-dom';

interface LessonNavProps {
  prev: { topicSlug: string; lessonSlug: string } | null;
  next: { topicSlug: string; lessonSlug: string } | null;
  isCompleted: boolean;
}

export function LessonNav({ prev, next, isCompleted }: LessonNavProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 px-5 py-4 border-t border-slate-800 mt-8" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      {prev ? (
        <button
          onClick={() => navigate(`/read/${prev.topicSlug}/${prev.lessonSlug}`)}
          className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium transition-colors active:bg-slate-700 min-h-[44px]"
        >
          ← Previous
        </button>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <button
          onClick={() => navigate(`/read/${next.topicSlug}/${next.lessonSlug}`)}
          className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-900 text-sm font-bold transition-colors active:bg-amber-400 min-h-[44px]"
        >
          Next →
        </button>
      ) : (
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold transition-colors active:bg-emerald-400 min-h-[44px]"
        >
          {isCompleted ? '🎉 All Done!' : '✓ Complete'}
        </button>
      )}
    </div>
  );
}
