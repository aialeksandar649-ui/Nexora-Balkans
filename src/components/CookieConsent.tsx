import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const STORAGE_KEY = 'nexora-cookie-consent';

export default function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg"
      role="dialog"
      aria-label={t('cookie.consent') || 'Cookie consent'}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t('cookie.message') || 'We use cookies to improve your experience. By continuing, you accept our '}
          <Link to="/privacy" className="text-[#FF385C] hover:underline">
            {t('privacy.policy')}
          </Link>
          {' '}{t('cookie.and') || 'and'} {' '}
          <Link to="/terms" className="text-[#FF385C] hover:underline">
            {t('terms.of.service')}
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="flex-shrink-0 px-6 py-2.5 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-semibold transition-colors"
        >
          {t('cookie.accept') || 'Accept'}
        </button>
      </div>
    </div>
  );
}
