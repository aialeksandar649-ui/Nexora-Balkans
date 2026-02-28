import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import SEO from '../components/SEO';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      showToast(error.message || t('reset.failed'), 'error');
      return;
    }
    showToast(t('password.updated') || 'Password updated!', 'success');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <SEO title={t('reset.password') || 'Set New Password'} description="Set your new password" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('reset.password') || 'Set New Password'}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('reset.new.password.instructions')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('password')}
            </label>
            <input
              id="new-password"
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
            {loading ? '...' : (t('reset.update.password') || 'Update password')}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <Link to="/login" className="text-[#FF385C] font-semibold hover:underline">
            {t('back')} {t('log.in')}
          </Link>
        </p>
      </div>
    </div>
  );
}
