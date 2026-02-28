import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import SEO from '../components/SEO';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { signUp, user } = useAuth();
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
    const { error } = await signUp(email.trim(), password, fullName.trim() || undefined);
    setLoading(false);
    if (error) {
      showToast(t('register.failed') || error.message, 'error');
      return;
    }
    showToast(t('register.success', 'Account created successfully'), 'success');
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <SEO title={t('register')} description={t('register.subtitle')} />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('register.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('register.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div>
            <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('full.name')} <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email.address')}
            </label>
            <input
              id="register-email"
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
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('password')}
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Min 6 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#FF385C] hover:bg-[#E61E4D] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? '...' : t('sign.up')}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          {t('have.account')}{' '}
          <Link to={`/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-[#FF385C] font-semibold hover:underline">
            {t('log.in')}
          </Link>
        </p>
      </div>
    </div>
  );
}
