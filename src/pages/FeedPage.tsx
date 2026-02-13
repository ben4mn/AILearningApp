import { StatsBar } from '../components/feed/StatsBar';
import { ContinueCard } from '../components/feed/ContinueCard';
import { EraSection } from '../components/feed/EraSection';
import { eras } from '../content/curriculum';

export function FeedPage() {
  const sortedEras = [...eras].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-safe-top">
          <h1 className="text-lg font-bold text-slate-100 pt-4 pb-1">History of AI</h1>
        </div>

        <StatsBar />
        <ContinueCard />

        {sortedEras.map((era) => (
          <EraSection key={era.id} era={era} />
        ))}
      </div>
    </div>
  );
}
