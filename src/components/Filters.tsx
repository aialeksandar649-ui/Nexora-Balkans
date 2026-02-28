import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
}

export interface FilterState {
  priceRange: [number, number];
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  guests: number | null;
  amenities: string[];
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'popular';
}

const defaultFilters: FilterState = {
  priceRange: [0, 500],
  bedrooms: null,
  beds: null,
  bathrooms: null,
  guests: null,
  amenities: [],
  sortBy: 'popular'
};

const amenitiesList = ['WiFi', 'Kitchen', 'Parking', 'Air Conditioning', 'Washer', 'TV', 'Heating', 'Balcony'];

export default function Filters({ onFilterChange, onClose }: FiltersProps) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFiltersCount = [
    filters.bedrooms !== null,
    filters.beds !== null,
    filters.bathrooms !== null,
    filters.guests !== null,
    filters.amenities.length > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 500
  ].filter(Boolean).length;

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('sort.by')}
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
          className="w-full px-4 py-3 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none text-base sm:text-sm min-h-[44px]"
        >
          <option value="popular">{t('most.popular')}</option>
          <option value="rating">{t('highest.rated')}</option>
          <option value="price-asc">{t('price.low.high')}</option>
          <option value="price-desc">{t('price.high.low')}</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('price.per.night')}: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="500"
            value={filters.priceRange[0]}
            onChange={(e) => handleFilterChange({ priceRange: [Number(e.target.value), filters.priceRange[1]] })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF385C]"
          />
          <input
            type="range"
            min="0"
            max="500"
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF385C]"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('bedrooms')}
        </label>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => handleFilterChange({ bedrooms: filters.bedrooms === num ? null : num })}
              className={`px-4 py-2.5 sm:py-2 rounded-lg border transition-colors min-h-[44px] ${
                filters.bedrooms === num
                  ? 'bg-[#FF385C] text-white border-[#FF385C]'
                  : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-500 active:bg-gray-50 dark:active:bg-gray-700'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Beds */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('beds')}
        </label>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => handleFilterChange({ beds: filters.beds === num ? null : num })}
              className={`px-4 py-2 rounded-lg border transition-colors min-h-[44px] ${
                filters.beds === num
                  ? 'bg-[#FF385C] text-white border-[#FF385C]'
                  : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-500'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('bathrooms')}
        </label>
        <div className="flex gap-2 flex-wrap">
          {[1, 1.5, 2, 2.5, 3].map(num => (
            <button
              key={num}
              onClick={() => handleFilterChange({ bathrooms: filters.bathrooms === num ? null : num })}
              className={`px-4 py-2 rounded-lg border transition-colors min-h-[44px] ${
                filters.bathrooms === num
                  ? 'bg-[#FF385C] text-white border-[#FF385C]'
                  : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-500'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('guests')}
        </label>
        <select
          value={filters.guests || ''}
          onChange={(e) => handleFilterChange({ guests: e.target.value ? Number(e.target.value) : null })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none min-h-[44px]"
        >
          <option value="">{t('any')}</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <option key={num} value={num}>{num} {num === 1 ? t('guest') : t('guests.plural')}</option>
          ))}
        </select>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('amenities')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="flex items-center gap-2 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={(e) => {
                  const newAmenities = e.target.checked
                    ? [...filters.amenities, amenity]
                    : filters.amenities.filter(a => a !== amenity);
                  handleFilterChange({ amenities: newAmenities });
                }}
                className="w-5 h-5 text-[#FF385C] border-gray-300 rounded focus:ring-[#FF385C]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-900 dark:hover:border-gray-500 active:bg-gray-50 dark:active:bg-gray-700 transition-colors bg-white dark:bg-gray-800 w-full justify-center min-h-[44px]"
        >
          <Filter className="h-5 w-5" />
          <span className="font-medium">{t('filters')}</span>
          {activeFiltersCount > 0 && (
            <span className="bg-[#FF385C] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel - Mobile Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setShowFilters(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('filters')}</h3>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-[#FF385C] hover:underline min-h-[44px] px-2"
                  >
                    {t('reset')}
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {renderFilterContent()}
          </div>
        </div>
      )}

      {/* Filter Panel - Desktop Sidebar */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('filters')}</h3>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-[#FF385C] hover:underline min-h-[44px] px-2"
              >
                {t('reset')}
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        {renderFilterContent()}
      </div>
    </div>
  );
}
