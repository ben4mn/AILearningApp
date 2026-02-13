import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-slate-100 mt-8 mb-4 leading-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-slate-100 mt-8 mb-3 leading-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-semibold text-slate-200 mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-base text-slate-300 leading-[1.8] mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-5 mb-4 space-y-2 text-slate-300">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-5 mb-4 space-y-2 text-slate-300">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-base leading-[1.7] pl-1">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-amber-500/40 pl-4 my-4 text-slate-400 italic">{children}</blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className={`block bg-slate-800/80 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto mb-4 font-mono leading-relaxed ${className || ''}`}>
          {children}
        </code>
      );
    }
    return (
      <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto">{children}</pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-100">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-slate-300">{children}</em>
  ),
  hr: () => <hr className="border-slate-700 my-8" />,
  a: ({ href, children }) => (
    <a href={href} className="text-amber-400 underline underline-offset-2" target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm text-slate-300">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="text-left px-3 py-2 text-slate-200 font-semibold border-b border-slate-700">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-b border-slate-800">{children}</td>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt} className="rounded-lg my-4 max-w-full" />
  ),
};
