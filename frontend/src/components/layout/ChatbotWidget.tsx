import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { ChatMarkdownRenderer } from './ChatMarkdownRenderer';

interface Message {
  role: 'user' | 'bot';
  text: string;
  isError?: boolean;
}

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (messageToSend?: string) => {
    const textToSend = (messageToSend ?? input).trim();
    if (!textToSend || loading) return;

    const updatedMessages: Message[] = [...messages, { role: 'user', text: textToSend }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Pass both message and conversation history to preserve multi-turn context
      const res = await api.post('/chatbot', {
        message: textToSend,
        prompt: textToSend,
        history: updatedMessages.map((m) => ({
          role: m.role,
          text: m.text,
        })),
      });

      setMessages((prev) => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        'Sorry, I am having trouble connecting to my AI brain. Please try again.';
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: errMsg, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryLast = () => {
    // Find the last user message to retry
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        const lastUserText = messages[i].text;
        // Remove the failed bot message
        setMessages((prev) => prev.filter((_, idx) => idx !== prev.length - 1));
        handleSend(lastUserText);
        break;
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
          aria-label="Open AI Tutor"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-card border border-border/50 shadow-2xl rounded-2xl w-[360px] sm:w-[420px] h-[540px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary px-4 py-3.5 flex justify-between items-center text-primary-foreground shadow-sm z-10">
            <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base tracking-tight">
              <MessageCircle className="w-5 h-5 shrink-0" /> AI Tutor
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/20 p-1.5 rounded-md transition-colors"
              aria-label="Close AI Tutor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 flex flex-col gap-3.5 bg-muted/30">
            <div className="bg-background border border-border/60 shadow-xs p-3 rounded-2xl rounded-tl-sm text-xs self-start max-w-[90%] leading-relaxed text-foreground">
              Hi! I'm your AI tutor powered by Gemini. Ask me anything about data structures, algorithms, or code optimization!
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 sm:p-3.5 rounded-2xl shadow-xs transition-all ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground self-end rounded-tr-sm text-xs font-medium max-w-[85%] whitespace-pre-wrap break-words leading-relaxed'
                    : m.isError
                    ? 'bg-destructive/10 border border-destructive/25 text-destructive self-start rounded-tl-sm text-xs max-w-[90%] break-words'
                    : 'bg-background border border-border/60 text-foreground self-start rounded-tl-sm max-w-[92%] sm:max-w-[90%] break-words overflow-hidden'
                }`}
              >
                {m.role === 'user' ? (
                  m.text
                ) : m.isError ? (
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold mb-1 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Connection Error</span>
                    </div>
                    <p className="leading-relaxed">{m.text}</p>
                    <button
                      onClick={handleRetryLast}
                      disabled={loading}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-destructive/15 hover:bg-destructive/25 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry question
                    </button>
                  </div>
                ) : (
                  <ChatMarkdownRenderer content={m.text} />
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground ml-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce"></span>
                <span>AI Tutor is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 sm:p-3.5 border-t bg-background flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about an algorithm..."
              disabled={loading}
              className="flex-1 bg-muted px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
