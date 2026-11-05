'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import FormattedMessage from './FormattedMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  action?: any;
}

interface ChatDrawerProps {
  onTransactionLogged?: () => void;
}

export default function ChatDrawer({ onTransactionLogged }: ChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello Ayush. I have access to your live SpendX financial ledger. You can ask for spending advice, analyze your daily allowance, or record transactions directly (e.g. "Spent ₹450 on books").',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.content,
          action: data.action,
        },
      ]);

      if (data.action) {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
        if (onTransactionLogged) onTransactionLogged();
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to reach the financial advisory engine right now. Please check your network connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'What is my daily allowance today?',
    'Logged ₹350 for lunch at Subway',
    'Where is most of my money going?',
    'Can I afford a ₹3,000 purchase this week?',
  ];

  return (
    <>
      {/* Sleek Floating Launcher — Vercel / Apple Style */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-5 z-40 px-3.5 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-xl backdrop-blur-md flex items-center gap-2 transition-all hover:border-zinc-500 active:scale-95 text-xs font-medium"
          aria-label="Open AI Advisor"
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>Financial Advisor</span>
        </button>
      )}

      {/* Sleek Slide-out Drawer */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[440px] h-[580px] max-h-[85vh] rounded-2xl bg-[#09090b] border border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-100 animate-in fade-in slide-in-from-bottom-3"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                <Sparkles className="w-3 h-3 text-zinc-300" />
              </div>
              <div>
                <div className="text-xs font-semibold tracking-tight text-white flex items-center gap-2">
                  Financial Advisor
                  <span className="text-[10px] text-zinc-500 font-mono">Agnes 3.0</span>
                </div>
                <div className="text-[11px] text-zinc-400">Contextual financial intelligence</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container — Guaranteed Scroll with Lenis Prevention */}
          <div
            ref={messagesContainerRef}
            data-lenis-prevent="true"
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3.5 text-xs scrollbar-thin scrollbar-thumb-zinc-700"
          >
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[88%] rounded-xl px-3.5 py-2.5 ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  ) : (
                    <FormattedMessage content={m.content} />
                  )}
                </div>

                {/* Structured Action Receipt */}
                {m.action && (
                  <div className="mt-1.5 max-w-[88%] rounded-lg px-3 py-2 bg-zinc-900 border border-emerald-900/60 text-emerald-400 flex items-center gap-2 text-[11px] font-mono">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{m.action.message}</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs py-2 px-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                <span>Evaluating financial balance and allowance...</span>
              </div>
            )}
          </div>

          {/* Quick Queries */}
          <div
            data-lenis-prevent="true"
            className="px-3 py-2 bg-zinc-950 border-t border-zinc-800/80 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0"
          >
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-zinc-800 bg-[#09090b] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask financial advice or log spend (e.g. 'Spent ₹350 on fuel')..."
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-white hover:bg-zinc-200 disabled:opacity-30 text-black transition-colors"
                aria-label="Send"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
