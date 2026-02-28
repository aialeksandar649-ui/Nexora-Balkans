import { useState, useEffect, ComponentType } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Share2, ArrowLeft, Wifi, Car, Utensils, Tv, Wind, Droplets, Shield, Clock, MapPin, CheckCircle, MessageCircle } from 'lucide-react';
import BookingCalendar from '../components/BookingCalendar';
import MapView from '../components/MapView';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useRecentViews } from '../hooks/useRecentViews';
import { useToast } from '../contexts/ToastContext';
import { createBooking, fetchPropertyBookedDates, datesOverlapBooked } from '../lib/bookings';
import { fetchPropertyReviews, submitReview, userAlreadyReviewed, type ReviewWithAuthor } from '../lib/reviews';
import { createConversation } from '../lib/messages';
import { Property } from '../types';

interface PropertyDetailProps {
  properties: Property[];
  loading?: boolean;
  refetchProperty?: () => Promise<void>;
}

const amenityIcons: { [key: string]: ComponentType<{ className?: string }> } = {
  'WiFi': Wifi,
  'Parking': Car,
  'Kitchen': Utensils,
  'TV': Tv,
  'Air Conditioning': Wind,
  'Washer': Droplets,
  'Heating': Wind,
};

export default function PropertyDetail({ properties, loading: propertiesLoading, refetchProperty }: PropertyDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const property = id ? properties.find((p) => p.id === id) : undefined;
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [reservationStatus, setReservationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [showCalendar, setShowCalendar] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [propertyReviews, setPropertyReviews] = useState<ReviewWithAuthor[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState<{ check_in: string; check_out: string }[]>([]);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecentView } = useRecentViews();
  const { showToast } = useToast();
  const { user } = useAuth();
  const propertyId = property?.id ?? '';

  useEffect(() => {
    if (property) {
      addRecentView(property);
    }
  }, [property, addRecentView]);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    fetchPropertyBookedDates(propertyId)
      .then((ranges) => { if (!cancelled) setBlockedDates(ranges); })
      .catch(() => { if (!cancelled) setBlockedDates([]); });
    return () => { cancelled = true; };
  }, [propertyId]);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    setReviewsLoading(true);
    fetchPropertyReviews(propertyId)
      .then((data) => { if (!cancelled) setPropertyReviews(data); })
      .catch(() => { if (!cancelled) setPropertyReviews([]); })
      .finally(() => { if (!cancelled) setReviewsLoading(false); });
    return () => { cancelled = true; };
  }, [propertyId]);

  useEffect(() => {
    if (!user?.id || !propertyId) {
      setUserHasReviewed(false);
      return;
    }
    let cancelled = false;
    userAlreadyReviewed(propertyId, user.id).then((ok) => {
      if (!cancelled) setUserHasReviewed(ok);
    });
    return () => { cancelled = true; };
  }, [user?.id, propertyId]);

  const handleSubmitReview = async () => {
    if (!user || !propertyId) {
      navigate(`/login?redirect=${encodeURIComponent(`/property/${property?.id ?? ''}`)}`);
      showToast(t('login.to.review'), 'info');
      return;
    }
    setReviewSubmitting(true);
    const { error } = await submitReview(propertyId, user.id, reviewRating, reviewComment);
    setReviewSubmitting(false);
    if (error) {
      showToast(error || t('review.failed'), 'error');
      return;
    }
    showToast(t('review.submitted'), 'success');
    setReviewComment('');
    setReviewRating(5);
    const updated = await fetchPropertyReviews(propertyId);
    setPropertyReviews(updated);
    setUserHasReviewed(true);
    refetchProperty?.();
  };

  const formatReviewDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'sr' ? 'sr-Latn' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (propertiesLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#FF385C] border-t-transparent rounded-full" aria-hidden="true" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('property.not.found')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('property.not.exist')}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-semibold transition-colors min-h-[44px]"
            aria-label={t('go.home')}
          >
            {t('go.home')}
          </button>
        </div>
      </div>
    );
  }

  const handleReserve = async () => {
    if (!selectedDates.start || !selectedDates.end) {
      showToast(t('select.dates.first'), 'warning');
      return;
    }
    if (datesOverlapBooked(selectedDates.start, selectedDates.end, blockedDates)) {
      showToast(t('dates.unavailable') || 'Selected dates are no longer available.', 'error');
      return;
    }
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/property/${property.id}`)}`);
      showToast(t('reserve.requires.login'), 'info');
      return;
    }
    setIsReserving(true);
    setReservationStatus('idle');
    try {
      const result = await createBooking(
        user.id,
        property.id,
        selectedDates.start,
        selectedDates.end,
        selectedGuests,
        total
      );
      if ('error' in result) {
        setReservationStatus('error');
        showToast(result.error || t('reservation.failed'), 'error');
        return;
      }
      setReservationStatus('success');
      showToast(t('reservation.successful'), 'success');
      setTimeout(() => {
        setSelectedDates({ start: null, end: null });
        setSelectedGuests(1);
      }, 2000);
    } catch {
      setReservationStatus('error');
      showToast(t('reservation.failed'), 'error');
    } finally {
      setIsReserving(false);
    }
  };

  const handleContactHost = async () => {
    if (!user || !propertyId || !contactMessage.trim()) return;
    setContactSending(true);
    const { conversationId, error } = await createConversation(propertyId, user.id, contactMessage.trim());
    setContactSending(false);
    if (error) {
      showToast(error, 'error');
      return;
    }
    setShowContactModal(false);
    setContactMessage('');
    showToast(t('message.sent'), 'success');
    if (conversationId) navigate(`/inbox?open=${conversationId}`);
  };

  const handleFavoriteToggle = () => {
    const wasFavorite = isFavorite(propertyId);
    toggleFavorite(propertyId);
    if (!wasFavorite) {
      showToast(t('added.to.favorites'), 'success');
    } else {
      showToast(t('removed.from.favorites'), 'info');
    }
  };

  const baseGuests = 2;
  const extraGuestFee = 15;
  const additionalGuests = Math.max(0, selectedGuests - baseGuests);
  const pricePerNight = property.price + (additionalGuests * extraGuestFee);

  const totalNights = selectedDates.start && selectedDates.end 
    ? Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const subtotal = pricePerNight * totalNights;
  const cleaningFee = Math.round(pricePerNight * totalNights * 0.15);
  const serviceFee = Math.round(pricePerNight * totalNights * 0.17);
  const total = subtotal + cleaningFee + serviceFee;

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const displayReviewCount = propertyReviews.length > 0 ? propertyReviews.length : property.reviews;
  const displayRating =
    property.reviews > 0
      ? property.rating
      : propertyReviews.length > 0
        ? (propertyReviews.reduce((a, r) => a + r.rating, 0) / propertyReviews.length).toFixed(1)
        : 0;

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-20 border-b border-gray-800">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
              aria-label={t('back')}
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 m-0">{t('back')}</p>
            </button>
          </div>
        </div>
        <div className="p-4 pt-8">
          <div className="max-w-6xl mx-auto columns-2 md:columns-3 gap-4">
            {property.images.map((image, index) => (
              <div key={index} className="mb-4 break-inside-avoid">
                {!imageErrors.has(index) ? (
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="w-full rounded-lg shadow-md"
                    loading="lazy"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400 dark:text-gray-500 m-0">{t('image.unavailable')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: property.title,
    description: property.description,
    image: property.images,
    address: { '@type': 'PostalAddress', addressLocality: property.location },
    numberOfRooms: property.bedrooms,
    amenityFeature: property.amenities?.map((a) => ({ '@type': 'LocationFeatureSpecification', name: a })),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
    },
  };
  if (property.reviews > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: property.rating,
      reviewCount: property.reviews,
    };
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO 
        title={property.title}
        description={property.description}
        image={property.images[0]}
        url={window.location.href}
        type="article"
        jsonLd={jsonLd}
      />
      {/* Header with back button */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
              aria-label={t('back')}
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 m-0">{t('back')}</p>
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={t('share') || 'Share'}
                  aria-expanded={showShareMenu}
                >
                  <Share2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
                {showShareMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowShareMenu(false)}
                      aria-hidden="true"
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50" role="menu">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          setShowShareMenu(false);
                          showToast(t('link.copied', 'Link copied!'), 'success');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                        role="menuitem"
                      >
                        {t('copy.link')}
                      </button>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                        onClick={() => setShowShareMenu(false)}
                        role="menuitem"
                      >
                        {t('share.facebook')}
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(property.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                        onClick={() => setShowShareMenu(false)}
                        role="menuitem"
                      >
                        {t('share.twitter')}
                      </a>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleFavoriteToggle}
                className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isFavorite(propertyId) ? t('remove.from.favorites') : t('add.to.favorites')}
                aria-pressed={isFavorite(propertyId)}
              >
                <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${isFavorite(propertyId) ? 'fill-[#FF385C] text-[#FF385C]' : 'text-gray-700 dark:text-gray-300'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-8">
          {/* Title and Rating */}
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{property.title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              {displayReviewCount > 0 ? (
                <>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-black dark:fill-white text-black dark:text-white" aria-hidden="true" />
                    <p className="font-semibold text-gray-900 dark:text-gray-100 m-0">{displayRating}</p>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 m-0" aria-hidden="true">·</p>
                  <p className="underline font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 m-0">
                    {displayReviewCount} {t('reviews')}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 m-0" aria-hidden="true">·</p>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 font-medium m-0">{t('no.reviews.yet', 'No reviews yet')}</p>
              )}
              <div className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <p className="font-semibold m-0">{property.location}</p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 rounded-xl overflow-hidden h-[220px] xs:h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px]">
            <div className="col-span-2 row-span-2">
              {!imageErrors.has(0) ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setShowAllPhotos(true)}
                  onError={() => handleImageError(0)}
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-400 dark:text-gray-500 m-0">{t('image.unavailable')}</p>
                </div>
              )}
            </div>
            {property.images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                {!imageErrors.has(index + 1) ? (
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => setShowAllPhotos(true)}
                    onError={() => handleImageError(index + 1)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-400 dark:text-gray-500 text-sm m-0">Image unavailable</p>
                  </div>
                )}
              </div>
            ))}
            <button
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 shadow-lg transition-colors border border-gray-200 dark:border-gray-700 min-h-[44px]"
              onClick={() => setShowAllPhotos(true)}
              aria-label={t('show.all.photos')}
            >
              {t('show.all.photos')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Host Info */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-8 border-b border-gray-200 dark:border-gray-800">
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t('hosted.by')} {property.host.name}
                    {property.host.isSuperhost && (
                      <p className="ml-2 text-xs bg-[#FF385C] text-white px-2 py-1 rounded-full font-semibold m-0 inline">{t('superhost')}</p>
                    )}
                  </h2>
                  <div className="text-gray-600 dark:text-gray-400 text-[15px] mb-2">
                    {property.guests} {t('guests.plural')} · {property.bedrooms} {t('bedrooms')} · {property.beds} {t('beds')} · {property.bathrooms} {t('bathrooms')}
                  </div>
                  {property.host.responseTime && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      {t('responds')} {property.host.responseTime}
                      {property.host.responseRate && ` · ${property.host.responseRate}% ${t('response.rate')}`}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      if (!/^[0-9a-f-]{36}$/i.test(property.id)) {
                        showToast(t('contact.only.supabase') || 'Messaging is available for listed properties only.', 'info');
                        return;
                      }
                      if (user) setShowContactModal(true);
                      else navigate(`/login?redirect=${encodeURIComponent(`/property/${property.id}`)}`);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100 font-medium min-h-[44px]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {t('contact.host') || 'Contact host'}
                  </button>
                  {property.host.avatar && (
                    <img
                      src={property.host.avatar}
                      alt={property.host.name}
                      className="w-16 h-16 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>

              {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6" role="dialog" aria-labelledby="contact-modal-title">
                    <h3 id="contact-modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('contact.host') || 'Contact host'}</h3>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={language === 'sr' ? 'Napišite poruku hostu...' : 'Write a message to the host...'}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setShowContactModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                        {t('back')}
                      </button>
                      <button
                        onClick={handleContactHost}
                        disabled={contactSending || !contactMessage.trim()}
                        className="px-4 py-2 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-medium disabled:opacity-50"
                      >
                        {contactSending ? '...' : t('send')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="pb-8 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-gray-900 dark:text-gray-100 text-[15px] leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="pb-8 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{t('what.place.offers')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || Shield;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-900 dark:text-gray-100 flex-shrink-0" aria-hidden="true" />
                          <p className="text-gray-700 dark:text-gray-300 text-[15px] m-0">{amenity}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="pb-8 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('location.map') || 'Location'}</h3>
                <MapView properties={[property]} selectedProperty={property} />
              </div>

              {/* Cancellation policy */}
              <div className="pb-8 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('cancellation.policy') || 'Cancellation policy'}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-[15px]">
                  {property.cancellationPolicy === 'strict'
                    ? t('cancellation.strict')
                    : property.cancellationPolicy === 'moderate'
                      ? t('cancellation.moderate')
                      : t('cancellation.flexible')}
                </p>
              </div>

              {/* Check-in/out */}
              {(property.checkIn || property.checkOut) && (
                <div className="pb-8 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('check.in.out')}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {property.checkIn && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('check.in')}</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{property.checkIn}</div>
                      </div>
                    )}
                    {property.checkOut && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('check.out')}</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{property.checkOut}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="pb-8 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  <Star className="inline h-6 w-6 fill-black dark:fill-white text-black dark:text-white mr-2" aria-hidden="true" />
                  {(displayReviewCount > 0 ? `${displayRating} · ${displayReviewCount} ${t('reviews')}` : t('no.reviews.yet', 'No reviews yet'))}
                </h3>
                {reviewsLoading ? (
                  <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                ) : (
                  <div className="space-y-6">
                    {propertyReviews.map((review) => (
                      <article key={review.id} className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                          <p className="text-gray-600 dark:text-gray-400 font-semibold m-0">
                            {review.authorName.charAt(0).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 m-0">{review.authorName}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm m-0">{formatReviewDate(review.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-1 mb-2" role="img" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-[#FF385C] text-[#FF385C]'
                                    : 'fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700'
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Leave a review: only when logged in */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                  {!user ? (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{t('login.to.review', 'Log in to leave a review')}</p>
                      <button
                        type="button"
                        onClick={() => navigate(`/login?redirect=${encodeURIComponent(`/property/${property.id}`)}`)}
                        className="px-4 py-2.5 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-semibold transition-colors min-h-[44px]"
                      >
                        {t('log.in')}
                      </button>
                    </div>
                  ) : userHasReviewed ? (
                    <p className="text-gray-600 dark:text-gray-400">{t('already.reviewed', 'You already reviewed this property')}</p>
                  ) : (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('leave.review', 'Leave a review')}</h4>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('your.rating', 'Your rating')}</label>
                        <div className="flex gap-1" role="group" aria-label={t('your.rating')}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 rounded focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2"
                              aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                            >
                              <Star
                                className={`h-8 w-8 ${reviewRating >= star ? 'fill-[#FF385C] text-[#FF385C]' : 'fill-gray-200 dark:fill-gray-600 text-gray-200 dark:text-gray-600'}`}
                                aria-hidden="true"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('your.review', 'Your review')}</label>
                        <textarea
                          id="review-comment"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder={language === 'sr' ? 'Napiši svoju recenziju...' : 'Write your review...'}
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent resize-y min-h-[100px]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSubmitReview}
                        disabled={reviewSubmitting}
                        className="px-6 py-3 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                      >
                        {reviewSubmitting ? '...' : t('submit.review', 'Submit review')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:sticky lg:top-32">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-lg bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 m-0">${pricePerNight}</p>
                      <p className="text-gray-600 dark:text-gray-400 m-0"> {t('night')}</p>
                    </div>
                    {additionalGuests > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('base')}: ${property.price} + ${extraGuestFee} × {additionalGuests} {additionalGuests === 1 ? t('guest') : t('guests.plural')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {displayReviewCount > 0 ? (
                      <>
                        <Star className="h-4 w-4 fill-black dark:fill-white text-black dark:text-white" aria-hidden="true" />
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 m-0">{displayRating}</p>
                        <p className="text-gray-500 dark:text-gray-400 m-0" aria-hidden="true">·</p>
                        <p className="underline text-sm font-semibold text-gray-900 dark:text-gray-100 m-0">{displayReviewCount}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 m-0">{t('no.reviews.yet', 'No reviews yet')}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-left hover:border-gray-900 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-800 min-h-[44px]"
                    aria-label={t('select.dates') || 'Select dates'}
                    aria-expanded={showCalendar}
                  >
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('check.in.date')} / {t('check.out.date')}</div>
                    {selectedDates.start && selectedDates.end ? (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedDates.start.toLocaleDateString()} - {selectedDates.end.toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('add.dates')}</div>
                    )}
                  </button>

                  {showCalendar && (
                    <div className="mb-4 w-full">
                      <BookingCalendar
                        onDatesSelect={(start, end) => {
                          setSelectedDates({ start, end });
                          setShowCalendar(false);
                        }}
                        initialStartDate={selectedDates.start}
                        initialEndDate={selectedDates.end}
                        blockedDates={blockedDates}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('guests').toUpperCase()}</div>
                    <div className="relative">
                      <select
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold appearance-none cursor-pointer pr-10 hover:border-gray-900 dark:hover:border-gray-500 transition-colors min-h-[44px]"
                        value={selectedGuests}
                        onChange={(e) => setSelectedGuests(Number(e.target.value))}
                        aria-label={t('select.guests') || 'Select number of guests'}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '12px'
                        }}
                      >
                        {[...Array(Math.min(10, property.guests))].map((_, i) => (
                          <option 
                            key={i + 1} 
                            value={i + 1}
                            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          >
                            {i + 1} {i === 0 ? t('guest') : t('guests.plural')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-[#FF385C] hover:bg-[#E61E4D] text-white py-4 rounded-lg font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  onClick={handleReserve}
                  disabled={isReserving || totalNights === 0}
                  aria-label={isReserving ? t('reserving') : t('reserve')}
                >
                  {isReserving ? t('reserving') : t('reserve')}
                </button>

                {reservationStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-800" role="alert">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold mb-1 m-0">{t('reservation.successful')}</p>
                        <p className="text-sm mb-2 m-0">{t('check.email')}</p>
                        {selectedDates.start && selectedDates.end && (
                          <div className="text-sm mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                            <p className="m-0"><strong>{t('check.in')}:</strong> {selectedDates.start.toLocaleDateString()}</p>
                            <p className="m-0"><strong>{t('check.out')}:</strong> {selectedDates.end.toLocaleDateString()}</p>
                            <p className="m-0"><strong>{t('guests')}:</strong> {selectedGuests}</p>
                            <p className="mt-2 m-0"><strong>{t('total')}:</strong> ${total}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {reservationStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800" role="alert">
                    <p className="font-semibold m-0">{t('something.wrong')}</p>
                    <p className="text-sm m-0">{t('try.again')}</p>
                  </div>
                )}

                {totalNights > 0 && (
                  <div className="mt-6 space-y-3 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between">
                      <p className="underline m-0">${pricePerNight} × {totalNights} {totalNights === 1 ? t('night') : t('nights')}</p>
                      <p className="font-semibold m-0">${subtotal}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="underline m-0">{t('cleaning.fee')}</p>
                      <p className="font-semibold m-0">${cleaningFee}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="underline m-0">{t('service.fee')}</p>
                      <p className="font-semibold m-0">${serviceFee}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between font-semibold text-lg text-gray-900 dark:text-gray-100">
                      <p className="m-0">{t('total')}</p>
                      <p className="m-0">${total}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
