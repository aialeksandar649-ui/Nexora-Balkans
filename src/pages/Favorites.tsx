import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';
import { useProperties } from '../contexts/PropertiesContext';
import PropertyCard from '../components/PropertyCard';
import EmptyState from '../components/EmptyState';
import { useToast } from '../contexts/ToastContext';
import SEO from '../components/SEO';

export default function Favorites() {
  const { t } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites();
  const { properties } = useProperties();
  const { showToast } = useToast();

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  const handleRemoveFavorite = (propertyId: string) => {
    toggleFavorite(propertyId);
    showToast(t('removed.from.favorites'), 'info');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO 
        title={t('saved.properties')}
        description={`View your saved properties. ${favoriteProperties.length} ${favoriteProperties.length === 1 ? t('saved.property') : t('saved.properties')}.`}
      />
      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#FF385C] transition-colors mb-4 min-h-[44px]"
            aria-label={t('back')}
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            <span>{t('back')}</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-[#FF385C] fill-[#FF385C]" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {t('saved.properties')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {favoriteProperties.length} {favoriteProperties.length === 1 ? t('saved.property') : t('saved.properties')}
          </p>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
            {favoriteProperties.map((property) => (
                <div key={`favorite-${property.id}`} className="relative" role="listitem">
                  <PropertyCard {...property} id={property.id} />
                  <button
                    onClick={() => handleRemoveFavorite(property.id)}
                    className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={t('remove.from.favorites')}
                  >
                    <Heart className="h-5 w-5 text-[#FF385C] fill-[#FF385C]" aria-hidden="true" />
                  </button>
                </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title={t('no.favorites')}
            description={t('no.favorites.desc')}
            actionLabel={t('browse.properties') || 'Browse Properties'}
            onAction={() => window.location.href = '/'}
          />
        )}
      </div>
    </div>
  );
}
