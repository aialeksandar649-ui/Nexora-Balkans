import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import SEO from '../components/SEO';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);
    if (error) {
      showToast(error.message || t('reset.failed'), 'error');
      return;
    }
    setSent(true);
    showToast(t('reset.email.sent'), 'success');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <SEO title={t('forgot.password') || 'Forgot Password'} description="Reset your password" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('forgot.password') || 'Forgot Password'}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {sent ? t('reset.check.email') : t('reset.instructions')}
          </p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('email.address')}
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#FF385C] hover:bg-[#E61E4D] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? '...' : (t('reset.send') || 'Send reset link')}
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-700 dark:text-gray-300">{t('reset.check.email.detail')}</p>
          </div>
        )}
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <Link to="/login" className="text-[#FF385C] font-semibold hover:underline">
            {t('back')} {t('log.in')}
          </Link>
        </p>
      </div>
    </div>
  );
}
