import { useNavigate } from 'react-router-dom';
import { useCompletedSet } from '../../hooks/useProgress';
import { getTopicCompletionCount, isTopicComplete, getLessonId } from '../../lib/curriculum';
import { ERA_COLORS } from '../../lib/constants';
import type { Topic } from '../../types';

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const navigate = useNavigate();
  const completedSet = useCompletedSet();
  const completed = getTopicCompletionCount(topic.slug, completedSet);
  const done = isTopicComplete(topic.slug, completedSet);
  const total = topic.lessons.length;
  const pct = Math.round((completed / total) * 100);
  const color = ERA_COLORS[topic.eraId];

  const handleClick = () => {
    const firstUnread = topic.lessons.find(
      (l) => !completedSet.has(getLessonId(topic.slug, l.slug))
    );
    const target = firstUnread || topic.lessons[0];
    navigate(`/read/${topic.slug}/${target.slug}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex-shrink-0 w-40 rounded-xl bg-slate-800/60 border border-slate-700/40 p-4 text-left snap-start transition-transform active:scale-[0.97]"
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {done && (
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      <h3 className="text-sm font-semibold text-slate-200 leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
        {topic.title}
      </h3>

      <span className="text-xs text-slate-500 mb-3 block">
        {completed}/{total} lessons
      </span>

      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </button>
  );
}
