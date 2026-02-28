import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { AUTHOR_NAME, AUTHOR_URL } from '../config/portfolio';

export default function Footer() {
  const { t, language } = useLanguage();
  return (
    <footer role="contentinfo" className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12 sm:mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <nav aria-label="Support">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-4">{t('support')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('help.center')}
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('safety.information')}
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('cancellation.options')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('contact.us')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Hosting">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-4">{t('hosting')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/become-host" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('become.host')}
                </Link>
              </li>
              <li>
                <Link to="/become-host" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('host.resources')}
                </Link>
              </li>
              <li>
                <Link to="/become-host" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('community.forum')}
                </Link>
              </li>
              <li>
                <Link to="/become-host" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('hosting.responsibly')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Nexora">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-4">Nexora</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('about') || 'About'}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('how.it.works')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('newsroom')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('careers')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('investors')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-4">{t('legal')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('privacy.policy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors min-h-[44px] inline-flex items-center">
                  {t('terms.of.service')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 sm:pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>© 2025 Nexora, Inc.</span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span>{t('all.rights.reserved')}</span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span>
                {t('footer.builtBy')}{' '}
                <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="text-[#FF385C] hover:underline">
                  {AUTHOR_NAME}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <button className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors min-h-[44px] px-2" aria-label="Language">
                {language === 'en' ? 'English (US)' : 'Srpski (RS)'}
              </button>
              <span>€ EUR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
