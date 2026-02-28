import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Categories from '../components/Categories';
import MapView from '../components/MapView';
import PropertyCard from '../components/PropertyCard';
import Filters, { FilterState } from '../components/Filters';
import SkeletonCard from '../components/SkeletonCard';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecentViews } from '../hooks/useRecentViews';
import { useDebounce } from '../hooks/useDebounce';
import { Property } from '../types';

// Funkcija za dobijanje prevedenog naziva kategorije
const getCategoryLabel = (originalKey: string, t: (key: string) => string): string => {
  const categoryMap: Record<string, string> = {
    'Mansions': 'mansions',
    'Cabins': 'cabins',
    'Beach': 'beach',
    'Mountains': 'mountains',
    'City': 'city',
    'Lofts': 'lofts',
    'Countryside': 'countryside',
    'Camping': 'camping',
  };
  const key = categoryMap[originalKey];
  return key ? t(key) : originalKey;
};

interface HomeProps {
  properties: Property[];
  loading?: boolean;
  error?: string | null;
}

export default function Home({ properties, loading: propertiesLoading, error: propertiesError }: HomeProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 500],
    bedrooms: null,
    beds: null,
    bathrooms: null,
    guests: null,
    amenities: [],
    sortBy: 'popular'
  });
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const { t } = useLanguage();
  const { recentViews, clearRecentViews } = useRecentViews();

  const isLoading = propertiesLoading || isFilterLoading;

  useEffect(() => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => setIsFilterLoading(false), 200);
    return () => clearTimeout(timer);
  }, [debouncedSearchQuery, selectedCategory, filters]);

  const filteredProperties = useMemo(() => {
    const byPlace = new Map<string, Property>();
    properties.forEach((p) => {
      const key = `${(p.location ?? '').toLowerCase().trim()}|${(p.title ?? '').toLowerCase().trim()}`;
      if (!key.replace(/\|/g, '')) return;
      if (!byPlace.has(key)) byPlace.set(key, p);
    });
    let filtered = Array.from(byPlace.values());

    // Search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.location.toLowerCase().includes(query) ||
          property.title.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.category.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((property) =>
        property.category.includes(selectedCategory)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (property) =>
        property.price >= filters.priceRange[0] &&
        property.price <= filters.priceRange[1]
    );

    // Bedrooms filter
    if (filters.bedrooms !== null) {
      filtered = filtered.filter((property) => property.bedrooms >= filters.bedrooms!);
    }

    // Beds filter
    if (filters.beds !== null) {
      filtered = filtered.filter((property) => property.beds >= filters.beds!);
    }

    // Bathrooms filter
    if (filters.bathrooms !== null) {
      filtered = filtered.filter((property) => property.bathrooms >= filters.bathrooms!);
    }

    // Guests filter
    if (filters.guests !== null) {
      filtered = filtered.filter((property) => property.guests >= filters.guests!);
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((property) =>
        filters.amenities.every(amenity => property.amenities.includes(amenity))
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (filters.sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return sorted;
  }, [properties, debouncedSearchQuery, selectedCategory, filters]);

  const seoTitle = debouncedSearchQuery 
    ? `Search Results for "${debouncedSearchQuery}"`
    : selectedCategory
      ? `${getCategoryLabel(selectedCategory, t)} Properties`
      : 'Discover Unique Places to Stay in the Balkans';

  const seoDescription = debouncedSearchQuery
    ? `Find the perfect accommodation in the Balkans. Search results for "${debouncedSearchQuery}".`
    : 'Discover unique places to stay in the Balkans. Book authentic accommodations in Bosnia, Serbia, Montenegro, Croatia, and more.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nexora',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    description: 'Discover unique places to stay in the Balkans. Book authentic accommodations.',
    publisher: {
      '@type': 'Organization',
      name: 'Nexora',
      url: typeof window !== 'undefined' ? window.location.origin : '',
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        jsonLd={jsonLd}
      />
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[65vh] min-h-[400px] sm:min-h-[500px] md:min-h-[500px] max-h-[650px] overflow-hidden" aria-label="Hero section">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80"
            alt="Balkans"
            width={1200}
            height={675}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-lg">
              {t('find.adventure')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-2xl mx-auto px-2 drop-shadow-md">
              {t('discover.places')}
            </p>
          </div>
        </div>
      </section>

      {/* Supabase load error - show fallback message */}
      {propertiesError && (
        <section className="container mx-auto px-3 sm:px-4 lg:px-8 pt-4" aria-live="polite">
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-amber-800 dark:text-amber-200 text-sm">
            {t('properties.load.error') || 'Could not load latest listings. Showing cached data.'} {propertiesError}
          </div>
        </section>
      )}

      {/* Categories */}
      <Categories onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />

      {/* Recent Views */}
      {recentViews.length > 0 && !debouncedSearchQuery && !selectedCategory && (
        <section className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8" aria-labelledby="recent-views-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="recent-views-heading" className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {t('recent.views')}
            </h2>
            <button
              onClick={clearRecentViews}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#FF385C] transition-colors min-h-[44px] px-2"
              aria-label={t('clear.recent.views')}
            >
              {t('clear.recent.views')}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" role="list">
            {recentViews.slice(0, 4).map((property) => (
              <div key={`recent-${property.id}`} role="listitem">
                <PropertyCard {...property} id={property.id} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Map preview */}
      {filteredProperties.length > 0 && (
        <section className="container mx-auto px-3 sm:px-4 lg:px-8 py-6" aria-labelledby="map-heading">
          <h2 id="map-heading" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sr-only">{t('explore.map') || 'Explore on map'}</h2>
          <MapView properties={filteredProperties.slice(0, 20)} onPropertyClick={(p) => navigate(`/property/${p.id}`)} />
        </section>
      )}

      {/* Filters and Properties */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 md:py-12" aria-labelledby="properties-heading">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1" aria-label="Filters">
            <Filters onFilterChange={setFilters} />
          </aside>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
        {propertiesLoading ? (
          <>
            <div className="mb-10 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" role="status" aria-label="Loading properties">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : filteredProperties.length > 0 ? (
          <>
            <div className="mb-10">
              <h2 id="properties-heading" className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {debouncedSearchQuery 
                  ? `${t('search.results')} "${debouncedSearchQuery}"` 
                  : selectedCategory 
                    ? `${getCategoryLabel(selectedCategory, t)} ${t('properties')}` 
                    : t('explore.all')
                }
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-[15px] sm:text-base">
                {filteredProperties.length} {filteredProperties.length === 1 ? t('stay') : t('stays')}
              </p>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" role="status" aria-label="Filtering">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" role="list">
                {filteredProperties.map((property) => (
                  <div key={`property-${property.id}`} role="listitem">
                    <PropertyCard {...property} id={property.id} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20" role="status">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('no.properties')}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">{t('try.adjusting')}</p>
          </div>
        )}
          </div>
        </div>
      </section>
    </div>
  );
}
