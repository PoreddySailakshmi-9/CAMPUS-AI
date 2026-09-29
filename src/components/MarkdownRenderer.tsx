import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple, clean markdown parser for standard assistant responses
  const lines = content.split('\n');

  const renderInline = (text: string): React.ReactNode[] => {
    // Parse bold **text** and inline code `code`
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-slate-900 dark:text-slate-100">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-[11px] font-mono text-indigo-600 dark:text-indigo-400"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-slate-700 dark:text-slate-300">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className="space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Horizontal rule
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="my-2 border-slate-200 dark:border-slate-800" />;
        }

        // H3 Header
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 mb-1 flex items-center gap-1.5"
            >
              {renderInline(trimmed.slice(4))}
            </h4>
          );
        }

        // H2 Header
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2 mb-1"
            >
              {renderInline(trimmed.slice(3))}
            </h3>
          );
        }

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-indigo-500 font-bold leading-tight mt-0.5">•</span>
              <span className="flex-1">{renderInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="font-mono text-indigo-500 font-bold text-[10px] mt-0.5">
                {numMatch[1]}.
              </span>
              <span className="flex-1">{renderInline(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
};
