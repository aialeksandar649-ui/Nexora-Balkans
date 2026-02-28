import { Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { thumbnailUrl } from '../lib/images';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

interface PropertyCardProps extends Property {
  id: string;
}

export default function PropertyCard({ id, imageUrl, images, location, title, price, rating, reviews }: PropertyCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const favorite = isFavorite(id);

  // Prioritize images array, then imageUrl; use smaller size for card (LCP/bandwidth)
  const rawImage = (images && images.length > 0) ? images[0] : (imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=80');
  const displayImage = thumbnailUrl(rawImage, 400);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasFavorite = favorite;
    toggleFavorite(id);
    if (!wasFavorite) {
      showToast(t('added.to.favorites'), 'success');
    } else {
      showToast(t('removed.from.favorites'), 'info');
    }
  };

  return (
    <article 
      className="group cursor-pointer flex flex-col h-full animate-fade-in hover-lift active:scale-[0.98]"
      onClick={() => navigate(`/property/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/property/${id}`);
        }
      }}
      aria-label={`${title} in ${location}, $${price} per night`}
    >
      {/* Property Image Container */}
      <div className="relative w-full aspect-[4/3] mb-2 sm:mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={displayImage}
          alt={title}
          width={400}
          height={300}
          decoding="async"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ filter: 'none', opacity: 1 }}
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 p-2 sm:p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center z-10"
          aria-label={favorite ? t('remove.from.favorites') : t('add.to.favorites')}
          aria-pressed={favorite}
          tabIndex={0}
        >
          <Heart 
            className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
              favorite 
                ? 'fill-[#FF385C] text-[#FF385C]' 
                : 'text-gray-700 dark:text-gray-300'
            }`} 
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Property Info - Fixed Height */}
      <div className="flex flex-col flex-1 space-y-1 sm:space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-[15px] leading-tight truncate">
              {location}
            </h3>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0" role="img" aria-label={reviews > 0 ? `Rating: ${rating} out of 5 stars` : t('no.reviews.yet', 'No reviews yet')}>
            {reviews > 0 ? (
              <>
                <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-black dark:fill-white text-black dark:text-white" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{rating}</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('no.reviews.yet', 'No reviews yet')}</span>
            )}
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-[15px] line-clamp-2 min-h-[2.5rem] leading-snug">{title}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-[15px] mt-auto">
          <span className="font-semibold text-gray-900 dark:text-gray-100">${price}</span>
          <span className="text-gray-500 dark:text-gray-400"> {t('night')}</span>
        </p>
      </div>
    </article>
  );
}
