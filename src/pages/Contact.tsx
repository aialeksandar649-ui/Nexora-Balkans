import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { submitContact } from '../lib/contact';

export default function Contact() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await submitContact(formData);
    setSending(false);
    if (error) {
      showToast(t('contact.error') || 'Failed to send. Try again.', 'error');
      return;
    }
    setSubmitted(true);
    showToast(t('contact.success') || 'Message sent. We will get back to you.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">{t('contact.us.title')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">{t('here.to.help')}</p>
      </div>

      <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
        {t('contact.demo.note') || 'Portfolio demo. Messages are stored in Supabase. Use the form to get in touch.'}
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="space-y-8 mb-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#FF385C]/10 dark:bg-[#FF385C]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-[#FF385C]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t('email')}</h3>
                <a href="mailto:contact@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-[#FF385C] transition-colors">
                  contact@gmail.com
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#FF385C]/10 dark:bg-[#FF385C]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-[#FF385C]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t('phone')}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t('contact.via.form') || 'Via contact form'}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#FF385C]/10 dark:bg-[#FF385C]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-[#FF385C]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t('office')}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t('contact.region') || 'Balkans'}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FF385C]/10 dark:bg-[#FF385C]/20 rounded-xl p-6 border border-[#FF385C]/20 dark:border-[#FF385C]/30">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{t('support.hours')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Monday - Friday: 9:00 AM - 6:00 PM CET<br />
              Saturday - Sunday: 10:00 AM - 4:00 PM CET<br />
              <span className="font-semibold">{t('support.hours.note') || 'Support available on weekdays.'}</span>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('send.message')}</h2>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-[#FF385C] mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('message.sent')}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{t('get.back')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('name')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('email')}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('subject')}</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('message')}</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-[#FF385C] hover:bg-[#E61E4D] text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
                {sending ? (t('sending') || 'Sending...') : t('send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
