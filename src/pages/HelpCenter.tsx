import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const faqKeys = [
  { questionKey: 'faq.cancel', answerKey: 'faq.cancel.answer' },
  { questionKey: 'faq.payment', answerKey: 'faq.payment.answer' },
  { questionKey: 'faq.contact.host', answerKey: 'faq.contact.host.answer' },
  { questionKey: 'faq.problem', answerKey: 'faq.problem.answer' },
  { questionKey: 'faq.pets', answerKey: 'faq.pets.answer' },
  { questionKey: 'faq.refund', answerKey: 'faq.refund.answer' },
];

export default function HelpCenter() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = faqKeys.map(faq => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey)
  }));

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">{t('help.center.title')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">{t('find.answers')}</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={t('search.for.help')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('frequently.asked')}</h2>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-gray-100">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#FF385C] flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">{t('no.results')}</p>
          </div>
        )}
      </div>

      <div className="bg-[#FF385C]/10 dark:bg-[#FF385C]/20 rounded-2xl p-8 border border-[#FF385C]/20 dark:border-[#FF385C]/30">
        <div className="flex items-start gap-4">
          <MessageCircle className="h-8 w-8 text-[#FF385C] flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('still.need.help')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('support.available')}</p>
            <Link
              to="/contact"
              className="inline-block bg-[#FF385C] hover:bg-[#E61E4D] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
            >
              {t('contact.support')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
