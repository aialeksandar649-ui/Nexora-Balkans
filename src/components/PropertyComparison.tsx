import { X, Star, MapPin, Users, Bed, Bath, Wifi, Car, Utensils, Tv, Wind, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyComparisonProps {
  properties: Property[];
  onClose: () => void;
  onRemove: (index: number) => void;
}

const amenityIcons: Record<string, LucideIcon> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Kitchen': Utensils,
  'TV': Tv,
  'Air Conditioning': Wind,
};

export default function PropertyComparison({ properties, onClose, onRemove }: PropertyComparisonProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (properties.length === 0) {
    return null;
  }

  const allAmenities = Array.from(new Set(properties.flatMap(p => p.amenities)));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="comparison-title">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="comparison-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('compare.properties') || 'Compare Properties'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t('close') || 'Close'}
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full" role="table">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sticky left-0 bg-gray-50 dark:bg-gray-800 z-10" scope="col">
                    {t('feature') || 'Feature'}
                  </th>
                  {properties.map((property, index) => (
                    <th key={index} className="p-4 text-left min-w-[250px] relative" scope="col">
                      <button
                        onClick={() => onRemove(index)}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={`Remove ${property.title} from comparison`}
                      >
                        <X className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </button>
                      <div
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/property/${property.id}`);
                          }
                        }}
                        aria-label={`View ${property.title}`}
                      >
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                          loading="lazy"
                        />
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                          {property.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          {property.location}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          {property.reviews > 0 ? (
                            <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${property.rating} out of 5 stars`}>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                              <span className="font-medium">{property.rating}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">{t('no.reviews.yet', 'No reviews yet')}</span>
                          )}
                          <span className="text-gray-500">${property.price}/{t('night') || 'night'}</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Price */}
                <tr>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 z-10">
                    {t('price.per.night') || 'Price per night'}
                  </td>
                  {properties.map((property, index) => (
                    <td key={index} className="p-4 text-gray-700 dark:text-gray-300">
                      ${property.price}
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 z-10">
                    {t('rating') || 'Rating'}
                  </td>
                  {properties.map((property, index) => (
                    <td key={index} className="p-4">
                      {property.reviews > 0 ? (
                        <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${property.rating} out of 5 stars`}>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {property.rating} ({property.reviews} {t('reviews') || 'reviews'})
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">{t('no.reviews.yet', 'No reviews yet')}</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Guests */}
                <tr>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 z-10">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" aria-hidden="true" />
                      {t('guests') || 'Guests'}
                    </div>
                  </td>
                  {properties.map((property, index) => (
                    <td key={index} className="p-4 text-gray-700 dark:text-gray-300">
                      {property.guests}
                    </td>
                  ))}
                </tr>

                {/* Bedrooms */}
                <tr>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 z-10">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4" aria-hidden="true" />
                      {t('bedrooms') || 'Bedrooms'}
                    </div>
                  </td>
                  {properties.map((property, index) => (
                    <td key={index} className="p-4 text-gray-700 dark:text-gray-300">
                      {property.bedrooms}
                    </td>
                  ))}
                </tr>

                {/* Beds */}
                <tr>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 z-10">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4" aria-hidden="true" />
                      {t('beds') || 'Beds'}
                    </div>
                  </td>
                  {properties.map((property, index) => (
                    <td key={index} className="p-4 text-gray-700 dark:text-gray-300">
                      {property.beds}
                    </td>
                  ))}
                </tr>

                {/* Bathrooms */}
                <tr>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 z-10">
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4" aria-hidden="true" />
                      {t('bathrooms') || 'Bathrooms'}
                    </div>
                  </td>
                  {properties.map((property, index) => (
                    <td key={index} className="p-4 text-gray-700 dark:text-gray-300">
                      {property.bathrooms}
                    </td>
                  ))}
                </tr>

                {/* Amenities */}
                {allAmenities.map((amenity) => {
                  const Icon = amenityIcons[amenity];
                  return (
                    <tr key={amenity}>
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 z-10">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                          {amenity}
                        </div>
                      </td>
                      {properties.map((property, index) => (
                        <td key={index} className="p-4">
                          {property.amenities.includes(amenity) ? (
                            <div className="text-green-600 dark:text-green-400" aria-label="Available">✓</div>
                          ) : (
                            <div className="text-gray-300 dark:text-gray-600" aria-label="Not available">—</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
            aria-label={t('close') || 'Close'}
          >
            {t('close') || 'Close'}
          </button>
          {properties.length > 0 && (
            <button
              onClick={() => {
                navigate(`/property/${properties[0].id}`);
                onClose();
              }}
              className="px-6 py-2 rounded-lg bg-[#FF385C] hover:bg-[#E61E4D] text-white transition-colors min-h-[44px]"
              aria-label={t('view.property') || 'View Property'}
            >
              {t('view.property') || 'View Property'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
