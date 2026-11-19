import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Bot,
  Minus,
  RotateCcw,
  ArrowDown,
  Zap,
  Lightbulb,
  GitCompare,
  Code2,
  ChevronUp,
} from 'lucide-react';
import { api } from '../../lib/api';
import { ChatMarkdownRenderer } from './ChatMarkdownRenderer';

interface Message {
  role: 'user' | 'bot';
  text: string;
  isError?: boolean;
  timestamp?: string;
}

interface SuggestionPrompt {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  prompt: string;
}

const SUGGESTIONS: SuggestionPrompt[] = [
  {
    id: 'binary-search',
    icon: Zap,
    title: 'Explain Binary Search',
    description: 'O(log n) divide & conquer mechanics',
    prompt: 'Explain Binary Search with a concrete example, step-by-step walkthrough, and time complexity table.',
  },
  {
    id: 'dp',
    icon: Lightbulb,
    title: 'Understand Dynamic Programming',
    description: 'Memoization & tabulation fundamentals',
    prompt: 'Help me understand Dynamic Programming with a simple problem like Fibonacci or Climbing Stairs, comparing memoization vs tabulation.',
  },
  {
    id: 'bfs-dfs',
    icon: GitCompare,
    title: 'Compare BFS vs DFS',
    description: 'Traversal trade-offs & applications',
    prompt: 'Compare BFS and DFS: when to use each, their data structure requirements, and time/space complexity.',
  },
  {
    id: 'two-sum',
    icon: Code2,
    title: 'Two Sum Optimal Solution',
    description: 'Hash map vs two-pointer approaches',
    prompt: 'Give me the optimal solution for Two Sum in Python or C++, explaining how the hash map achieves O(n) time.',
  },
];

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isNearBottomRef = useRef(true);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Scroll to bottom helper
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior,
    });
    isNearBottomRef.current = true;
    setShowScrollBottom(false);
  }, []);

  // Monitor user scroll position: do not force scroll if user scrolled up
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNear = distanceFromBottom < 80;
    isNearBottomRef.current = isNear;
    setShowScrollBottom(distanceFromBottom > 140);
  };

  // Auto-scroll when messages update, but only if user is already at the bottom
  useEffect(() => {
    if (isOpen && !isMinimized && isNearBottomRef.current) {
      scrollToBottom('smooth');
    }
  }, [messages, loading, isOpen, isMinimized, scrollToBottom]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 110)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async (messageToSend?: string) => {
    const textToSend = (messageToSend ?? input).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      role: 'user',
      text: textToSend,
      timestamp: formatTimestamp(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);

    // Ensure scroll to bottom on user send
    isNearBottomRef.current = true;
    setTimeout(() => scrollToBottom('smooth'), 50);

    try {
      const res = await api.post('/chatbot', {
        message: textToSend,
        prompt: textToSend,
        history: updatedMessages.map((m) => ({
          role: m.role,
          text: m.text,
        })),
      });

      const botReply = res.data?.reply || "I couldn't process that. Please ask again!";
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: botReply,
          timestamp: formatTimestamp(),
        },
      ]);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        'Sorry, I am having trouble connecting to my AI brain. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: errMsg,
          isError: true,
          timestamp: formatTimestamp(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryLast = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        const lastUserText = messages[i].text;
        setMessages((prev) => prev.filter((_, idx) => idx !== prev.length - 1));
        handleSend(lastUserText);
        break;
      }
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear conversation history and start a fresh chat?')) {
      setMessages([]);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* 1. FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-primary via-purple-600 to-indigo-600 text-white shadow-xl hover:shadow-primary/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-primary/20 cursor-pointer"
          aria-label="Open AlgoVis AI Tutor"
        >
          <div className="relative">
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-1 ring-white"></span>
            </span>
          </div>

          {/* Hover Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-card border border-border text-foreground font-semibold text-xs whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask AI Tutor ✨
          </span>
        </button>
      )}

      {/* 2. MINIMIZED FLOATING PILL */}
      {isOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card border border-border/80 shadow-2xl hover:border-primary/50 text-foreground transition-all duration-300 hover:scale-105 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-none flex items-center gap-1.5">
              AI Tutor
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">Click to expand</span>
          </div>
          <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
        </button>
      )}

      {/* 3. MAIN CHATBOT WINDOW */}
      {isOpen && !isMinimized && (
        <div className="bg-card border border-border/80 shadow-2xl rounded-3xl w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[calc(100vh-5rem)] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300 ring-1 ring-border/50">
          {/* HEADER (Fixed / Non-shrinking) */}
          <div className="shrink-0 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 px-4 py-3.5 flex justify-between items-center text-primary-foreground shadow-sm z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-xs ring-1 ring-white/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight leading-none text-white">
                    AlgoVis AI Tutor
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-bold text-white uppercase tracking-wider">
                    Gemini
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] text-white/80 font-medium leading-none">
                    Online • Ready to assist
                  </span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="hover:bg-white/15 p-1.5 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(true)}
                className="hover:bg-white/15 p-1.5 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/15 p-1.5 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CONVERSATION AREA (Independently Scrollable with min-h-0 and custom-scrollbar) */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 sm:p-4 flex flex-col gap-3.5 bg-muted/15 dark:bg-zinc-950/40 relative"
          >
            {/* WELCOME SCREEN (When no messages yet) */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center my-auto py-2 text-center animate-in fade-in-50 duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 via-purple-500/20 to-indigo-500/20 border border-primary/30 flex items-center justify-center text-primary mb-3 shadow-xs">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-extrabold text-sm text-foreground mb-1">
                  Welcome to AlgoVis AI Tutor! 🚀
                </h4>
                <p className="text-[11px] text-muted-foreground max-w-[280px] leading-relaxed mb-4">
                  Ask me anything about algorithms, code optimization, time complexity, or problem-solving.
                </p>

                {/* Suggestion Chips */}
                <div className="w-full flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                    Suggested topics
                  </span>
                  {SUGGESTIONS.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSend(item.prompt)}
                        className="group flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all cursor-pointer shadow-xs text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MESSAGE LIST */}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`transition-all duration-200 ${
                  m.role === 'user' ? 'self-end max-w-[85%]' : 'self-start max-w-[92%] sm:max-w-[90%]'
                }`}
              >
                {m.role === 'user' ? (
                  <div className="rounded-2xl rounded-tr-xs bg-primary text-primary-foreground p-3 sm:p-3.5 text-xs font-medium shadow-xs break-words leading-relaxed border border-primary/20">
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    {m.timestamp && (
                      <div className="text-[9px] text-primary-foreground/70 mt-1 text-right">
                        {m.timestamp}
                      </div>
                    )}
                  </div>
                ) : m.isError ? (
                  <div className="rounded-2xl rounded-tl-xs bg-destructive/10 border border-destructive/25 text-destructive p-3.5 text-xs shadow-xs break-words">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Connection Interrupted</span>
                    </div>
                    <p className="leading-relaxed">{m.text}</p>
                    <button
                      onClick={handleRetryLast}
                      disabled={loading}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-destructive/15 hover:bg-destructive/25 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry Question
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl rounded-tl-xs bg-card border border-border/80 dark:border-zinc-800 text-foreground p-3.5 sm:p-4 text-xs shadow-xs break-words overflow-hidden">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-[10px] text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5 font-semibold text-primary">
                        <Sparkles className="w-3 h-3 text-primary" /> AI Tutor
                      </span>
                      {m.timestamp && <span className="opacity-70">{m.timestamp}</span>}
                    </div>
                    <ChatMarkdownRenderer content={m.text} />
                  </div>
                )}
              </div>
            ))}

            {/* THINKING / LOADING INDICATOR */}
            {loading && (
              <div className="self-start max-w-[85%] rounded-2xl rounded-tl-xs bg-card border border-border/80 dark:border-zinc-800 p-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">AI Tutor is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* FLOATING SCROLL-TO-BOTTOM BUTTON */}
          {showScrollBottom && (
            <div className="relative">
              <button
                onClick={() => scrollToBottom('smooth')}
                className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-card/95 hover:bg-card border border-border text-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-lg transition-all animate-in fade-in-0 slide-in-from-bottom-2 cursor-pointer hover:border-primary/50"
                aria-label="Scroll to newest message"
              >
                <ArrowDown className="w-3.5 h-3.5 text-primary animate-bounce" />
                <span className="text-[11px] font-semibold">New messages</span>
              </button>
            </div>
          )}

          {/* INPUT AREA (Fixed / Non-shrinking) */}
          <div className="shrink-0 p-3 sm:p-3.5 border-t border-border/60 bg-background/95 backdrop-blur-md flex flex-col gap-1.5">
            <div className="flex items-end gap-2 bg-muted/40 dark:bg-zinc-900/60 border border-border/80 dark:border-zinc-800 rounded-2xl p-1.5 px-3 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about an algorithm (Shift+Enter for newline)..."
                disabled={loading}
                className="flex-1 bg-transparent border-0 resize-none max-h-24 py-1.5 text-xs sm:text-sm focus:outline-none placeholder:text-muted-foreground/60 disabled:opacity-50 text-foreground custom-scrollbar"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="p-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-40 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-xs cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground/60">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-primary" /> AlgoVis Intelligent Assistant
              </span>
              <span>Enter ↵ to send</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
