import { Link } from 'react-router-dom';
import { FileCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function TermsOfService() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">{t('terms.of.service.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('last.updated')}</p>
      </div>

      <div className="space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="h-6 w-6 text-[#FF385C]" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('terms.agreement')}</h2>
          </div>
          <p>{t('terms.agreement.desc')}</p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-[#FF385C]" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('terms.user.responsibilities')}</h2>
          </div>
          <p className="mb-3">{t('terms.user.intro')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('user.accurate')}</li>
            <li>{t('user.lawful')}</li>
            <li>{t('user.respect')}</li>
            <li>{t('user.comply')}</li>
            <li>{t('user.security')}</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-[#FF385C]" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('terms.booking')}</h2>
          </div>
          <p className="mb-3">{t('terms.booking.intro')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('booking.contract')}</li>
            <li>{t('booking.payment')}</li>
            <li>{t('booking.cancellation')}</li>
            <li>{t('booking.damages')}</li>
            <li>{t('booking.refunds')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('terms.host.responsibilities')}</h2>
          <p className="mb-3">{t('terms.host.intro')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('host.accurate')}</li>
            <li>{t('host.maintain')}</li>
            <li>{t('host.honor')}</li>
            <li>{t('host.respond')}</li>
            <li>{t('host.comply')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('terms.liability')}</h2>
          <p>{t('terms.liability.desc')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('terms.modifications')}</h2>
          <p>{t('terms.modifications.desc')}</p>
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
