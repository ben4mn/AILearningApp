import { ERA_TEXT_CLASSES } from '../../lib/constants';

interface EraNodeProps {
  eraId: string;
  name: string;
}

export function EraNode({ eraId, name }: EraNodeProps) {
  const textClass = ERA_TEXT_CLASSES[eraId] || 'text-slate-400';

  return (
    <div className="flex items-center gap-3 py-4 pl-1">
      <div className={`text-xs font-bold uppercase tracking-wider ${textClass}`}>
        {name}
      </div>
      <div className="flex-1 h-px bg-slate-700" />
    </div>
  );
}
