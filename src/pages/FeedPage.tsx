import { StatsBar } from '../components/feed/StatsBar';
import { ContinueCard } from '../components/feed/ContinueCard';
import { EraSection } from '../components/feed/EraSection';
import { eras } from '../content/curriculum';

export function FeedPage() {
  const sortedEras = [...eras].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-slate-900" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="max-w-lg mx-auto">
        <div className="px-5" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
          <h1 className="text-lg font-bold text-slate-100 pb-1">History of AI</h1>
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
