import { eras, topics } from '../../content/curriculum';
import { getTopicsByEra } from '../../lib/curriculum';
import { EraNode } from './EraNode';
import { TopicNode } from './TopicNode';

export function ProgressPath() {
  const sortedEras = [...eras].sort((a, b) => a.order - b.order);
  const allTopics = [...topics].sort((a, b) => a.linearOrder - b.linearOrder);
  const lastTopicSlug = allTopics[allTopics.length - 1]?.slug;

  return (
    <div className="px-5 pb-8">
      {sortedEras.map((era) => {
        const eraTopics = getTopicsByEra(era.id);
        return (
          <div key={era.id}>
            <EraNode eraId={era.id} name={era.name} />
            {eraTopics.map((topic) => (
              <TopicNode
                key={topic.slug}
                topic={topic}
                isLast={topic.slug === lastTopicSlug}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
