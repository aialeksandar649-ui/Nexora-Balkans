import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getConversations, getMessages, sendMessage, markConversationAsRead, type Conversation, type Message } from '../lib/messages';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';

export default function Inbox() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const openId = searchParams.get('open');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const showList = useMemo(() => !selected || !isMobile, [selected, isMobile]);
  const showChat = selected;

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/inbox', { replace: true });
      return;
    }
    let cancelled = false;
    getConversations(user.id).then((c) => {
      if (!cancelled) {
        setConversations(c);
        if (openId) {
          const conv = c.find((x) => x.id === openId);
          if (conv) setSelected(conv);
        }
      }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, navigate, openId]);

  useEffect(() => {
    if (!selected || !user) return;
    let cancelled = false;
    getMessages(selected.id, user.id).then((m) => {
      if (!cancelled) setMessages(m);
    });
    markConversationAsRead(selected.id, user.id).then(async () => {
      window.dispatchEvent(new CustomEvent('inbox-updated'));
      const updated = await getConversations(user.id);
      if (!cancelled) setConversations(updated);
    });
    return () => { cancelled = true; };
  }, [selected, user]);

  const handleSend = async () => {
    if (!input.trim() || !selected || !user) return;
    setSending(true);
    const { error } = await sendMessage(selected.id, user.id, input.trim());
    setSending(false);
    if (error) {
      showToast(error, 'error');
      return;
    }
    setInput('');
    const [updatedMessages, updatedConvs] = await Promise.all([
      getMessages(selected.id, user.id),
      getConversations(user.id),
    ]);
    setMessages(updatedMessages);
    setConversations(updatedConvs);
    const stillSelected = updatedConvs.find((x) => x.id === selected.id);
    if (stillSelected) setSelected(stillSelected);
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-[#FF385C] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <SEO title={t('inbox') || 'Inbox'} description="Your conversations with hosts" />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('inbox') || 'Inbox'}</h1>
          <EmptyState
            icon={MessageCircle}
            title={t('no.messages') || 'No messages yet'}
            description={t('no.messages.desc') || 'Contact a host from a property page to start a conversation.'}
            actionLabel={t('explore.properties')}
            onAction={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <SEO title={t('inbox') || 'Inbox'} description="Your conversations" />
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="container mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={t('back')}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('inbox') || 'Inbox'}</h1>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Conversation list - hidden on mobile when chat is open */}
        <aside
          className={`flex flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-800 shrink-0 ${
            showList ? 'w-full md:w-80' : 'hidden md:flex md:w-80'
          }`}
          aria-hidden={!showList}
        >
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`w-full text-left px-4 py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                selected?.id === c.id ? 'bg-[#FF385C]/10 dark:bg-[#FF385C]/20' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {c.other_party_name || (c.property as { title?: string })?.title || 'Conversation'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {(c.property as { title?: string })?.title || 'Property'}
                  </div>
                  {c.last_message_preview && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 truncate mt-1 italic">
                      {c.last_message_preview}
                    </div>
                  )}
                </div>
                {(c.unread_count ?? 0) > 0 && (
                  <span className="flex-shrink-0 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#FF385C] px-2 text-xs font-bold text-white">
                    {c.unread_count! > 99 ? '99+' : c.unread_count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </aside>

        <main className={`flex-1 flex flex-col min-w-0 min-h-0 ${showChat ? 'flex' : 'hidden md:flex'}`}>
          {selected ? (
            <>
              {/* Mobile: back button to return to list */}
              {isMobile && (
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-800 md:hidden">
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                    aria-label={t('back')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {selected.other_party_name || (selected.property as { title?: string })?.title}
                  </span>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        m.isOwn
                          ? 'bg-[#FF385C] text-white rounded-br-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('type.message') || 'Type a message...'}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF385C] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="p-3 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-xl disabled:opacity-50 transition-colors"
                    aria-label={t('send')}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 p-4 text-center">
              {t('select.conversation') || 'Select a conversation'}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
