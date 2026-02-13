import { TopicCard } from './TopicCard';
import { getTopicsByEra } from '../../lib/curriculum';
import { ERA_TEXT_CLASSES } from '../../lib/constants';
import type { Era } from '../../types';

interface EraSectionProps {
  era: Era;
}

export function EraSection({ era }: EraSectionProps) {
  const topics = getTopicsByEra(era.id);
  const textClass = ERA_TEXT_CLASSES[era.id] || 'text-slate-400';

  return (
    <section className="mb-6">
      <div className="px-5 mb-3">
        <h2 className={`text-sm font-bold ${textClass}`}>{era.name}</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory scrollbar-hide">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </section>
  );
}
