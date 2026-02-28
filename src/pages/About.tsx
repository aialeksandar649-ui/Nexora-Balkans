import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';
import { AUTHOR_NAME, AUTHOR_URL } from '../config/portfolio';

export default function About() {
  const { language, t } = useLanguage();
  const isSr = language === 'sr';

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 bg-white dark:bg-gray-900 min-h-screen">
      <SEO
        title={isSr ? 'O projektu' : 'About'}
        description={isSr ? 'O Nexori i ovom portfolio projektu.' : 'About Nexora and this portfolio project.'}
      />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 tracking-tight">
        {isSr ? 'O projektu' : 'About'}
      </h1>

      <section className="space-y-6 text-gray-600 dark:text-gray-400">
        <p className="text-lg leading-relaxed">
          {isSr
            ? 'Nexora je platforma za otkrivanje i rezervaciju smeštaja na Balkanu. Ovaj sajt je portfolio projekat koji demonstrira full-stack razvoj: React, TypeScript, Supabase (autentifikacija, baza, RLS), responzivan UI, višejezičnost i pristupačnost.'
            : 'Nexora is a platform for discovering and booking accommodations in the Balkans. This site is a portfolio project demonstrating full-stack development: React, TypeScript, Supabase (auth, database, RLS), responsive UI, internationalization, and accessibility.'}
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-10">
          {isSr ? 'Šta je urađeno' : 'What I built'}
        </h2>
        <p className="text-lg leading-relaxed">
          {isSr
            ? 'Kompletan flow za goste i domaćine: pretraga i filteri, rezervacije s kalendarom i blokiranim datumima, profil korisnika, omiljene, inbox za poruke gost–domaćin, recenzije i ocene. Domaćini mogu dodavati oglase s uploadom slika (Supabase Storage ili ImgBB), izborom lokacije na mapi (Leaflet) i upravljati rezervacijama. Dodatno: AI asistent (Perplexity), brisanje naloga preko Edge Function, mapa nekretnina, uporedba oglasa, dark mode i EN/SR jezik.'
            : 'Full guest and host flow: search and filters, bookings with calendar and blocked dates, user profile, favorites, guest–host inbox, reviews and ratings. Hosts can add listings with image upload (Supabase Storage or ImgBB), map location picker (Leaflet), and manage reservations. Plus: AI assistant (Perplexity), account deletion via Edge Function, property map, comparison tool, dark mode, and EN/SR language.'}
        </p>
        <p className="text-lg leading-relaxed">
          {isSr
            ? 'Tehnologije: React 18, TypeScript, Vite, Tailwind CSS, React Router, Supabase (PostgreSQL, Auth, Row Level Security, Storage, Edge Functions), Lucide ikone. Deploy: Netlify.'
            : 'Tech stack: React 18, TypeScript, Vite, Tailwind CSS, React Router, Supabase (PostgreSQL, Auth, RLS, Storage, Edge Functions), Lucide icons. Deployed on Netlify.'}
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-10">
          {isSr ? 'Zašto Balkan?' : 'Why the Balkans?'}
        </h2>
        <p className="text-lg leading-relaxed">
          {isSr
            ? 'Balkan nudi autentičan smještaj, lokalne domaćine i destinacije koje tek čekaju da ih otkriješ — od obale do planina, od gradova do sela. Nexora povezuje putnike s domaćinima koji nude više od sobe: doživljaj, savjet i osjećaj kao kod kuće.'
            : 'The Balkans offer authentic stays, local hosts, and destinations still off the beaten path — from coast to mountains, cities to villages. Nexora connects travellers with hosts who offer more than a room: local insight, stories, and a real sense of place.'}
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-10">
          {isSr ? 'Šta bih dodao dalje' : 'What I\'d do next'}
        </h2>
        <p className="text-lg leading-relaxed">
          {isSr
            ? 'Plaćanja (npr. Stripe), email notifikacije za rezervacije i poruke, više jezika (npr. hrvatski, makedonski), E2E testovi (Playwright), i poboljšanja PWA za bolji offline rad.'
            : 'Payments (e.g. Stripe), email notifications for bookings and messages, more languages (e.g. Croatian, Macedonian), E2E tests (Playwright), and PWA improvements for better offline support.'}
        </p>

        <p className="text-lg leading-relaxed mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
          {t('about.builtBy')}{' '}
          <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="text-[#FF385C] hover:underline font-medium">
            {AUTHOR_NAME}
          </a>
          {isSr ? ' — portfolio projekat.' : ' — portfolio project.'}
        </p>
      </section>
    </div>
  );
}
