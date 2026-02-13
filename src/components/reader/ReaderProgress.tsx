interface ReaderProgressProps {
  progress: number;
  color: string;
}

export function ReaderProgress({ progress, color }: ReaderProgressProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-slate-800">
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{ width: `${progress}%`, backgroundColor: color }}
      />
    </div>
  );
}
