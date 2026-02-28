import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-4">
      <SEO title={t('page.not.found') || 'Page not found'} description="The page you are looking for does not exist." />
      <h1 className="text-8xl font-bold text-[#FF385C] mb-2" aria-hidden="true">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {t('page.not.found') || 'Page not found'}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
        {t('page.not.found.desc') || "The page you're looking for doesn't exist or has been moved."}
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-semibold transition-colors min-h-[44px]"
          aria-label={t('go.home') || 'Go to home'}
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          {t('go.home') || 'Go Home'}
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-semibold transition-colors min-h-[44px]"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          {t('explore.properties') || 'Explore Properties'}
        </Link>
      </div>
    </div>
  );
}
