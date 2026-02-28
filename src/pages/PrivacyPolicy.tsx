import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">{t('privacy.policy.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('last.updated')}</p>
      </div>

      <div className="space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-[#FF385C]" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('privacy.matters')}</h2>
          </div>
          <p>{t('privacy.intro')}</p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-[#FF385C]" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('info.collect')}</h2>
          </div>
          <p className="mb-3">{t('info.collect.intro')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('info.collect.account')}</li>
            <li>{t('info.collect.payment')}</li>
            <li>{t('info.collect.booking')}</li>
            <li>{t('info.collect.communications')}</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-6 w-6 text-[#FF385C]" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('how.use')}</h2>
          </div>
          <p className="mb-3">{t('how.use.intro')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('how.use.process')}</li>
            <li>{t('how.use.communicate')}</li>
            <li>{t('how.use.improve')}</li>
            <li>{t('how.use.offers')}</li>
            <li>{t('how.use.security')}</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-[#FF385C]" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('data.security')}</h2>
          </div>
          <p>{t('data.security.desc')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('your.rights')}</h2>
          <p className="mb-3">{t('your.rights.intro')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('rights.access')}</li>
            <li>{t('rights.correct')}</li>
            <li>{t('rights.delete')}</li>
            <li>{t('rights.optout')}</li>
            <li>{t('rights.portability')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('privacy.contact')}</h2>
          <p>
            {t('privacy.contact.desc')} <a href="mailto:support@gmail.com" className="text-[#FF385C] hover:underline">support@gmail.com</a>
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link 
          to="/" 
          className="inline-block bg-[#FF385C] hover:bg-[#E61E4D] text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          {t('back.to.home')}
        </Link>
      </div>
    </div>
  );
}
