'use client';

import { useState, useRef, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import { Sparkles, Bot, Send, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';
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
        'Hello Ayush! 🌟 I am your dedicated SpendX AI Financial Advisor powered by Agnes 3.0 Flash.\n\nI have live, private access to your balances, category spendings, and budget limits in Indian Rupees (₹). You can ask me for advice, budget audits, or simply tell me what you spent (e.g. "I spent ₹250 on tea and snacks") and I will automatically record it into your ledger!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I had trouble reaching the Agnes advisor engine. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'How much can I safely spend per day for the rest of this month?',
    'I spent ₹450 on McDonald\'s dinner',
    'Which category am I spending the most on?',
    'Can I afford a ₹3,500 weekend shopping trip?',
    'Received freelance payment of ₹12,000',
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-28 md:pb-12 transition-colors">
      <DesktopNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>SpendX AI Financial Advisor</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-600 text-white">
                  Agnes 3.0 Flash
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live contextual guidance • Autonomous transaction logging
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xl rounded-3xl p-4 sm:p-5 text-sm ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-br-none shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>

              {m.action && (
                <div className="mt-2 max-w-md rounded-2xl p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 text-xs font-bold shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{m.action.message}</span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 text-slate-400 text-xs py-2 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
              <span>Agnes AI is calculating financial impact...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="py-2 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 shadow-sm transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-2 shrink-0 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything or log spend (e.g. 'I spent 400 on petrol')..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-md active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
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
