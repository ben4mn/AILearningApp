import { useStreakStore } from '../../store/streakStore';
import { useCompletedCount } from '../../hooks/useProgress';
import { totalLessons } from '../../content/curriculum';

export function StatsBar() {
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const completedCount = useCompletedCount();
  const pct = Math.round((completedCount / totalLessons) * 100);

  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center justify-between px-5 py-3">
      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <span className="text-xl">{currentStreak > 0 ? '🔥' : '💤'}</span>
        <span className="text-sm font-semibold text-slate-300">
          {currentStreak} day{currentStreak !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lesson count */}
      <span className="text-sm text-slate-400">
        {completedCount}/{totalLessons} lessons
      </span>

      {/* Completion ring */}
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#334155" strokeWidth="3" />
          <circle
            cx="20" cy="20" r="16" fill="none"
            stroke="#F59E0B" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-amber-400">
          {pct}%
        </span>
      </div>
    </div>
  );
}
