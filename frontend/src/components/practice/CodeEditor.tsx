import { useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  onRun?: () => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  readOnly = false,
  onRun,
  onSubmit,
  placeholder = '// Enter your code here...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync scrolling between line numbers and textarea
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Keyboard navigation & indentation handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key inserts 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Restore cursor position after state update
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    // Ctrl + Enter or Cmd + Enter to run code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey && onSubmit) {
        onSubmit();
      } else if (onRun) {
        onRun();
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full rounded-2xl border border-border/80 bg-[#16171d] overflow-hidden shadow-md font-mono text-xs sm:text-sm">
      {/* Code Editor Header */}
      <div className="h-9 px-4 bg-[#1e2029] border-b border-border/60 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-2 text-foreground font-mono">solution.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 rounded bg-muted/80 border border-border text-[9px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted/80 border border-border text-[9px]">Enter</kbd> to run
          </span>
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-wider">
            {language}
          </span>
        </div>
      </div>

      {/* Editor Body: Line numbers + Textarea */}
      <div className="flex-1 relative flex overflow-hidden min-h-[300px]">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="w-12 py-3 bg-[#13141a] border-r border-border/40 text-right pr-3 select-none text-muted-foreground/40 font-mono text-xs leading-6 overflow-hidden"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-[#e2e8f0] font-mono text-xs sm:text-sm leading-6 resize-none outline-none border-none overflow-auto whitespace-pre selection:bg-primary/30"
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="h-6 px-3 bg-[#111217] border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground/70 select-none">
        <div>UTF-8 • Spaces: 2</div>
        <div>{lines.length} lines • {value.length} chars</div>
      </div>
    </div>
  );
};
