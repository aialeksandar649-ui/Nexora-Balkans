import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { sendAssistantMessage, type ChatMessage, type PropertyForAssistant } from '../lib/assistant';
import type { Property } from '../types';

export default function AssistantChat({ properties = [] }: { properties?: Property[] }) {
  const propertiesForAssistant: PropertyForAssistant[] = properties.map((p) => ({
    id: p.id,
    title: p.title,
    location: p.location ?? '',
    price: p.price,
  }));
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const nextMessages = [...messages, userMessage];
      const { content } = await sendAssistantMessage(nextMessages, propertiesForAssistant);
      setMessages((prev) => [...prev, { role: 'assistant', content }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('assistant.error');
      showToast(msg, 'error');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const isSr = language === 'sr';

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed right-4 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#FF385C] text-white shadow-lg transition hover:bg-[#E61E4D] focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}
        aria-label={t('assistant.title')}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed left-4 right-4 sm:left-auto sm:right-6 z-50 flex w-auto sm:max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
          style={{ height: 'min(420px, 70vh)', bottom: 'max(5.5rem, calc(env(safe-area-inset-bottom) + 5rem))' }}
        >
          <div className="border-b border-gray-200 bg-[#FF385C]/10 px-4 py-3 dark:border-gray-700 dark:bg-[#FF385C]/20">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('assistant.title')}</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('assistant.subtitle')}</p>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                {t('assistant.welcome')}
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-[#FF385C] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2 dark:bg-gray-700">
                  <Loader2 className="h-4 w-4 animate-spin text-[#FF385C]" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isSr ? 'Odgovaram...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('assistant.placeholder')}
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-[#FF385C] focus:outline-none focus:ring-1 focus:ring-[#FF385C] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF385C] text-white transition hover:bg-[#E61E4D] disabled:opacity-50"
                aria-label={isSr ? 'Pošalji' : 'Send'}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
