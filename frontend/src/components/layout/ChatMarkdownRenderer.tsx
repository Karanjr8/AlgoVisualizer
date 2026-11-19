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
      // clipboard fallback
    }
  };

  return (
    <div className="my-2.5 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
        <span className="uppercase font-semibold tracking-wider text-zinc-300">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 px-2 py-0.5 rounded-md transition-colors cursor-pointer text-[10px]"
          title="Copy code"
          type="button"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-sans font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-zinc-400" />
              <span className="font-sans font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3.5 text-[11px] font-mono leading-relaxed max-h-[320px] custom-scrollbar">
        <pre className="m-0 p-0 whitespace-pre">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};

export const ChatMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="chat-markdown text-xs text-foreground leading-relaxed break-words space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xs font-bold text-foreground mt-3 mb-1.5 pb-1 border-b border-border/50 first:mt-0 tracking-tight">
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
            <blockquote className="border-l-2 border-primary pl-2.5 my-2 text-xs italic text-muted-foreground bg-primary/5 py-1 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2.5 rounded-xl border border-border/80 bg-muted/20 shadow-xs custom-scrollbar">
              <table className="min-w-full divide-y divide-border/60 text-xs text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50 font-semibold text-foreground">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/30">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-1.5 text-[11px] font-semibold text-foreground border-b border-border/60 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-1.5 text-[11px] text-foreground/90 whitespace-nowrap">
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
                className="bg-muted/80 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded text-[11px] font-mono text-primary font-medium border border-border/50"
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
