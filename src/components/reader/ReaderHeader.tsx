import { useNavigate } from 'react-router-dom';

interface ReaderHeaderProps {
  title: string;
  lessonNumber: number;
  totalLessons: number;
  color: string;
}

export function ReaderHeader({ title, lessonNumber, totalLessons, color }: ReaderHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50">
      <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </button>

        <h1 className="text-sm font-semibold text-slate-200 truncate flex-1">{title}</h1>

        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {lessonNumber} of {totalLessons}
        </span>
      </div>
    </header>
  );
}
