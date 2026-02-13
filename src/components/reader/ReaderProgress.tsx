interface ReaderProgressProps {
  progress: number;
  color: string;
}

export function ReaderProgress({ progress, color }: ReaderProgressProps) {
  return (
    <div
      className="fixed left-0 right-0 z-50 h-[2px] bg-slate-800"
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{ width: `${progress}%`, backgroundColor: color }}
      />
    </div>
  );
}
