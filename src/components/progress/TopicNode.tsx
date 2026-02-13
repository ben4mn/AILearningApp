import { useNavigate } from 'react-router-dom';
import { useCompletedSet } from '../../hooks/useProgress';
import { getTopicCompletionCount, isTopicComplete } from '../../lib/curriculum';
import { ERA_COLORS } from '../../lib/constants';
import type { Topic } from '../../types';

interface TopicNodeProps {
  topic: Topic;
  isLast: boolean;
}

export function TopicNode({ topic, isLast }: TopicNodeProps) {
  const navigate = useNavigate();
  const completedSet = useCompletedSet();
  const completed = getTopicCompletionCount(topic.slug, completedSet);
  const done = isTopicComplete(topic.slug, completedSet);
  const total = topic.lessons.length;
  const hasStarted = completed > 0;
  const color = ERA_COLORS[topic.eraId];

  const handleClick = () => {
    navigate(`/chapter/${topic.slug}`);
  };

  return (
    <div className="flex items-stretch gap-4">
      <div className="flex flex-col items-center w-10 flex-shrink-0">
        <button
          onClick={handleClick}
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all min-h-[44px] min-w-[44px]"
          style={{
            borderColor: color,
            backgroundColor: done ? color : 'transparent',
          }}
        >
          {done ? (
            <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          ) : hasStarted ? (
            <span className="text-xs font-bold" style={{ color }}>{completed}/{total}</span>
          ) : null}
        </button>

        {!isLast && (
          <div className="w-0.5 flex-1 min-h-[24px]" style={{ backgroundColor: done ? color : '#334155' }} />
        )}
      </div>

      <button
        onClick={handleClick}
        className="flex-1 pb-6 text-left min-h-[44px] flex flex-col justify-center"
      >
        <h3 className={`text-sm font-semibold ${done ? 'text-slate-200' : hasStarted ? 'text-slate-300' : 'text-slate-500'}`}>
          {topic.title}
        </h3>
        <span className="text-xs text-slate-500 mt-0.5">
          {completed}/{total} sections · {topic.estimatedMinutes} min
        </span>
      </button>
    </div>
  );
}
