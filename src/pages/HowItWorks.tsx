import { Search, Calendar, Key, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">{t('how.works.title')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">{t('discover.steps')}</p>
      </div>

      <div className="space-y-12">
        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-[#FF385C]/10 dark:bg-[#FF385C]/20 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-[#FF385C]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('search.step')}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('search.step.desc')}
            </p>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-[#FF385C]/10 dark:bg-[#FF385C]/20 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-[#FF385C]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('book.step')}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('book.step.desc')}
            </p>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-[#FF385C]/10 dark:bg-[#FF385C]/20 rounded-full flex items-center justify-center">
            <Key className="h-8 w-8 text-[#FF385C]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('stay.step')}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('stay.step.desc')}
            </p>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-[#FF385C]/10 dark:bg-[#FF385C]/20 rounded-full flex items-center justify-center">
            <Star className="h-8 w-8 text-[#FF385C]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('review.step')}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('review.step.desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link 
          to="/" 
          className="inline-block bg-[#FF385C] hover:bg-[#E61E4D] text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          {t('start.search')}
        </Link>
      </div>
    </div>
  );
}
