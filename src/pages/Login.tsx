import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import SEO from '../components/SEO';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { signIn, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/';

  if (user) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      showToast(t('login.failed') || error.message, 'error');
      return;
    }
    showToast(t('welcome') || 'Welcome back!', 'success');
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <SEO title={t('log.in')} description={t('login.subtitle')} />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('login.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('login.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email.address')}
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('password')}
              </label>
              <Link to="/forgot-password" className="text-sm text-[#FF385C] hover:underline">
                {t('forgot.password') || 'Forgot password?'}
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#FF385C] hover:bg-[#E61E4D] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? '...' : t('sign.in')}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          {t('no.account')}{' '}
          <Link to={`/register${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-[#FF385C] font-semibold hover:underline">
            {t('sign.up')}
          </Link>
        </p>
      </div>
    </div>
  );
}
