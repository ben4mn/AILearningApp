import { useCompletedCount } from '../hooks/useProgress';
import { useStreakStore } from '../store/streakStore';
import { totalLessons, estimatedTotalMinutes } from '../content/curriculum';
import { ProgressPath } from '../components/progress/ProgressPath';

export function ProgressPage() {
  const completedCount = useCompletedCount();
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const longestStreak = useStreakStore((s) => s.longestStreak);
  const pct = Math.round((completedCount / totalLessons) * 100);
  const remainingMinutes = Math.round(((totalLessons - completedCount) / totalLessons) * estimatedTotalMinutes);

  return (
    <div className="min-h-screen bg-slate-900" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="max-w-lg mx-auto">
        <div className="px-5" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
          <h1 className="text-lg font-bold text-slate-100 pb-4">Your Journey</h1>
        </div>

        <div className="mx-5 mb-6 rounded-2xl bg-slate-800/60 border border-slate-700/40 p-5">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-400">{pct}%</div>
              <div className="text-xs text-slate-500 mt-0.5">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-200">{completedCount}</div>
              <div className="text-xs text-slate-500 mt-0.5">of {totalLessons} sections</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-200">
                {currentStreak > 0 ? `🔥 ${currentStreak}` : '0'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Day streak{longestStreak > 0 ? ` (best: ${longestStreak})` : ''}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-200">
                {remainingMinutes > 0 ? `${Math.round(remainingMinutes / 60)}h` : '0h'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Remaining</div>
            </div>
          </div>
        </div>

        <ProgressPath />
      </div>
    </div>
  );
}
