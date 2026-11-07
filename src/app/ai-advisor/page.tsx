'use client';

import { useState, useRef, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import FormattedMessage from '@/components/ai/FormattedMessage';
import { Sparkles, ArrowUpRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  action?: any;
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello Ayush. I have live access to your SpendX financial ledger. You can ask for spending advice, audit category budgets, or record transactions directly (e.g. "Spent ₹250 on groceries").',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || loading) return;

    const newMsgs: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
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
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to connect to the financial advisory engine. Please check your connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What is my recommended daily spending allowance?',
    'Logged ₹450 on dinner',
    'Which category am I spending the most on?',
    'Can I afford a ₹3,500 purchase this weekend?',
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-28 md:pb-12 font-sans flex flex-col">
      <DesktopNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
                <span>Financial Advisor</span>
                <span className="text-xs text-zinc-500 font-mono">Agnes 3.0</span>
              </h1>
              <p className="text-xs text-zinc-400">Context-aware spending analysis and transaction recording</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          data-lenis-prevent="true"
          className="flex-1 min-h-0 overflow-y-auto py-5 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-800"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] sm:max-w-xl rounded-xl p-4 text-xs ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-[#0c0c0e] border border-zinc-800/80 text-zinc-200'
                }`}
              >
                {m.role === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                ) : (
                  <FormattedMessage content={m.content} />
                )}
              </div>

              {m.action && (
                <div className="mt-2 max-w-md rounded-lg px-3 py-2 bg-zinc-900 border border-emerald-900/60 text-emerald-400 flex items-center gap-2 text-xs font-mono">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{m.action.message}</span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs py-2 px-3 bg-zinc-900/60 border border-zinc-800 rounded-lg w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <span>Analyzing cashflow and ledger context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div
          data-lenis-prevent="true"
          className="py-2.5 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0 border-t border-zinc-900"
        >
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 pb-4 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0c0c0e] border border-zinc-800 focus-within:border-zinc-700"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask financial advice or say 'Spent ₹350 on fuel'..."
              className="flex-1 px-3 py-2 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-3 py-2 rounded-lg bg-white hover:bg-zinc-200 disabled:opacity-30 text-black font-medium text-xs flex items-center gap-1 transition-colors"
            >
              <span>Send</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </main>

      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={() => {}}
      />

      <MobileNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
    </div>
  );
}
