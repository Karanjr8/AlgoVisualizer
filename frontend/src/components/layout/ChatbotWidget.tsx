import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { api } from '../../lib/api';

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot', { prompt: userMessage });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting to my AI brain.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-card border border-border/50 shadow-2xl rounded-2xl w-[350px] h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground shadow-sm z-10">
            <h3 className="font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> AI Tutor
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/20 p-1 rounded-md transition-colors"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-muted/30">
            <div className="bg-background border shadow-sm p-3 rounded-2xl rounded-tl-sm text-sm self-start max-w-[85%]">
              Hi! I'm your AI tutor powered by Gemini. Ask me anything about the algorithms you're visualizing!
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground self-end rounded-tr-sm' : 'bg-background border self-start rounded-tl-sm'}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="text-xs font-medium text-muted-foreground ml-2 animate-pulse">AI is typing...</div>}
          </div>

          <div className="p-4 border-t bg-background flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-muted px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
