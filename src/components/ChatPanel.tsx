import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare } from 'lucide-react';
import type { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isResponding: boolean;
  hasReport: boolean;
}

export function ChatPanel({ messages, onSend, isResponding, hasReport }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isResponding) {
      onSend(input.trim());
      setInput('');
    }
  };

  if (!hasReport) return null;

  return (
    <div className="bg-surface-800/30 border border-surface-700/50 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-700/50 flex items-center gap-2">
        <MessageSquare size={14} className="text-primary-400" />
        <h3 className="text-xs font-semibold text-surface-200">Follow-up Discussion</h3>
        <span className="text-[10px] text-surface-500 ml-auto">
          Context: current analysis session
        </span>
      </div>

      {/* Messages */}
      <div className="max-h-72 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <MessageSquare size={24} className="mx-auto text-surface-600 mb-2" />
            <p className="text-xs text-surface-500">
              Ask follow-up questions about the analysis above
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {[
                'What if I want to be more conservative?',
                'How would this change with a 5-year horizon?',
                'What about adding crypto exposure?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => onSend(q)}
                  className="text-[11px] px-3 py-1.5 rounded-full bg-surface-800 border border-surface-700 text-surface-400 hover:border-primary-500 hover:text-primary-300 cursor-pointer transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'bg-accent-500/20 text-accent-400'
              }`}
            >
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-500/15 text-primary-100 rounded-tr-sm'
                  : 'bg-surface-800 text-surface-300 rounded-tl-sm border border-surface-700/50'
              }`}
              dangerouslySetInnerHTML={{
                __html: msg.content.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-surface-100">$1</strong>'
                ),
              }}
            />
          </div>
        ))}

        {isResponding && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-accent-500/20 text-accent-400">
              <Bot size={14} />
            </div>
            <div className="px-3.5 py-2.5 rounded-xl rounded-tl-sm bg-surface-800 border border-surface-700/50">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-surface-700/50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={isResponding}
            className="flex-1 px-3.5 py-2.5 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isResponding}
            className="p-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
