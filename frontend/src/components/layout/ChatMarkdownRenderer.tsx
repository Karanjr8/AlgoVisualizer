import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-border/60 bg-zinc-950 text-zinc-100 shadow-xs">
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-900 border-b border-zinc-800 text-[10px] font-mono text-zinc-400">
        <span className="uppercase font-semibold tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-zinc-200 transition-colors p-0.5 rounded cursor-pointer"
          title="Copy code"
          type="button"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3 text-[11px] font-mono leading-relaxed max-h-[300px] scrollbar-thin">
        <pre className="m-0 p-0 whitespace-pre">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};

export const ChatMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="chat-markdown text-xs text-foreground leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xs font-bold text-foreground mt-3 mb-1.5 pb-1 border-b border-border/50 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xs font-bold text-foreground mt-2.5 mb-1 tracking-wide first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-semibold text-foreground/95 mt-2 mb-1 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-xs text-foreground/90 leading-relaxed mb-2 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/90">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-4 space-y-1 my-1.5 text-xs text-foreground/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-4 space-y-1 my-1.5 text-xs text-foreground/90">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/70 pl-2.5 my-2 text-xs italic text-muted-foreground bg-muted/20 py-1 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 rounded-lg border border-border/60 bg-muted/15 shadow-xs">
              <table className="min-w-full divide-y divide-border/60 text-xs text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/40 font-semibold text-foreground">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/30">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/25 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-2.5 py-1.5 text-[11px] font-semibold text-foreground border-b border-border/60 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2.5 py-1.5 text-[11px] text-foreground/90 whitespace-nowrap">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline inline-flex items-center gap-0.5 font-medium transition-colors"
            >
              <span>{children}</span>
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const rawString = String(children).replace(/\n$/, '');
            const isMultiline = rawString.includes('\n') || Boolean(match);

            if (isMultiline) {
              return <CodeBlock language={match ? match[1] : ''} value={rawString} />;
            }

            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono text-primary font-medium border border-border/40"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
