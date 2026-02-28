import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import { fetchHostBookings, cancelBookingAsHost, type BookingWithProperty } from '../lib/bookings';

export default function HostReservations() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<BookingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelTarget, setCancelTarget] = useState<BookingWithProperty | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/host-reservations', { replace: true });
      return;
    }
    let cancelled = false;
    fetchHostBookings(user.id)
      .then((data) => { if (!cancelled) setBookings(data); })
      .catch(() => { if (!cancelled) setBookings([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, navigate]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch =
      searchQuery === '' ||
      booking.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.property.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-5 w-5 text-blue-500" aria-hidden="true" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" aria-hidden="true" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <SEO title={t('host.reservations') || 'Reservations'} description="Reservations for your listings" />
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('host.reservations') || 'Rezervacije mojih smeštaja'}</h1>
          <EmptyState
            icon={Calendar}
            title={t('host.no.reservations') || 'Nema rezervacija'}
            description={t('host.no.reservations.desc') || 'Kada neko rezerviše tvoj smeštaj, ovde će se pojaviti.'}
            actionLabel={t('my.listings') || 'Moji smeštaji'}
            onAction={() => navigate('/my-listings')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title={t('host.reservations') || 'Rezervacije mojih smeštaja'}
        description={`${bookings.length} ${bookings.length === 1 ? 'rezervacija' : 'rezervacija'} za tvoje smeštaje`}
      />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('host.reservations') || 'Rezervacije mojih smeštaja'}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{t('host.reservations.desc') || 'Pregled rezervacija za tvoje objavljene smeštaje.'}</p>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <label htmlFor="host-reservations-search" className="sr-only">{t('search.bookings') || 'Search'}</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <input
              id="host-reservations-search"
              type="text"
              placeholder={t('search.bookings') || 'Pretraži po smeštaju ili lokaciji...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none min-h-[44px]"
              aria-label={t('search.bookings') || 'Search'}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0" role="tablist" aria-label={t('search.bookings') || 'Filter'}>
            {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap min-h-[44px] ${
                  filter === status ? 'bg-[#FF385C] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                role="tab"
                aria-selected={filter === status}
              >
                {t(`bookings.${status}`, status === 'all' ? (t('bookings.all') || 'Sve') : status.charAt(0).toUpperCase() + status.slice(1))}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4" role="list" aria-label="Reservations list">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12" role="status">
              <p className="text-gray-600 dark:text-gray-400">{t('no.bookings.found', 'Nema pronađenih rezervacija')}</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                role="listitem"
              >
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                  <div
                    onClick={() => navigate(`/property/${booking.propertyId}`)}
                    className="flex-shrink-0 w-full lg:w-64 h-48 sm:h-56 rounded-lg overflow-hidden cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/property/${booking.propertyId}`);
                      }
                    }}
                    aria-label={`${booking.property.title}`}
                  >
                    <img
                      src={booking.property.imageUrl}
                      alt={booking.property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3
                          onClick={() => navigate(`/property/${booking.propertyId}`)}
                          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 cursor-pointer hover:text-[#FF385C] transition-colors"
                        >
                          {booking.property.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                          <span className="text-sm">{booking.property.location}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('host.guest') || 'Gost'} • {formatDate(booking.bookingDate)} {t('host.booked') || 'rezervisao'}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="text-sm font-medium capitalize">
                          {t(`bookings.${booking.status}`, booking.status)}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Check-in</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(booking.checkIn)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Check-out</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(booking.checkOut)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{t('property.guests') || 'Gosti'}</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{booking.guests}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{t('total') || 'Ukupno'}</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{booking.totalPrice} BAM</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => navigate(`/property/${booking.propertyId}`)}
                        className="px-4 py-2.5 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-medium transition-colors min-h-[44px]"
                        aria-label={t('view.property') || 'Pogledaj smeštaj'}
                      >
                        {t('view.property') || 'Pogledaj smeštaj'}
                      </button>
                      {booking.status === 'upcoming' && (
                        <button
                          onClick={() => setCancelTarget(booking)}
                          className="px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors min-h-[44px]"
                          aria-label={t('cancel.booking')}
                        >
                          {t('cancel.booking')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={async () => {
          if (!cancelTarget || !user) return;
          setCancelling(true);
          const { error } = await cancelBookingAsHost(cancelTarget.id, user.id);
          setCancelling(false);
          setCancelTarget(null);
          if (error) {
            showToast(error, 'error');
            return;
          }
          showToast(t('booking.cancelled'), 'success');
          const updated = await fetchHostBookings(user.id);
          setBookings(updated);
        }}
        title={t('cancel.booking')}
        message={t('cancel.booking.confirm')}
        confirmLabel={t('cancel.booking')}
        cancelLabel={t('cancel')}
        variant="danger"
        loading={cancelling}
      />
    </div>
  );
}
