import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Plus, MapPin, DollarSign, Star, Pencil, Trash2, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useProperties } from '../contexts/PropertiesContext';
import { useToast } from '../contexts/ToastContext';
import SEO from '../components/SEO';
import ConfirmModal from '../components/ConfirmModal';
import { Property } from '../types';

export default function MyListings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { properties, deleteProperty, refetch } = useProperties();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/my-listings', { replace: true });
      return;
    }
  }, [user, properties, navigate]);

  if (!user) return null;

  const listings = properties.filter((p) => (p as Property & { user_id?: string }).user_id === user.id);
  const hasListings = listings.length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO title={t('my.listings')} description="Manage your listed properties" />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('my.listings')}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/host-reservations"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-semibold transition-colors min-h-[44px]"
            >
              <Calendar className="h-5 w-5" aria-hidden="true" />
              {t('host.reservations') || 'Rezervacije'}
            </Link>
            <Link
              to="/become-host"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-semibold transition-colors min-h-[44px]"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              {t('add.property')}
            </Link>
          </div>
        </div>

        {!hasListings ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Home className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('no.properties')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{t('add.property.desc')}</p>
            <Link
              to="/become-host"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg font-semibold transition-colors"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              {t('add.property')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {listings.map((property) => (
              <article
                key={property.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                role="listitem"
              >
                <Link to={`/property/${property.id}`} className="block flex-1 min-h-0">
                  <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={property.images?.[0] ?? property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{property.title}</h2>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate">{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        {property.reviews > 0 ? (
                          <>
                            <Star className="h-4 w-4 fill-current text-gray-700 dark:text-gray-300" aria-hidden="true" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{property.rating}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">({property.reviews})</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">{t('no.reviews.yet', 'No reviews yet')}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100">
                        <DollarSign className="h-4 w-4" aria-hidden="true" />
                        {property.price}
                        <span className="text-gray-500 dark:text-gray-400 font-normal text-sm">/ {t('night')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                  <Link
                    to={`/become-host/${property.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium text-sm transition-colors"
                    aria-label={t('property.edit') || 'Edit'}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    {t('property.edit') || 'Edit'}
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === property.id}
                    onClick={() => setDeleteTarget(property)}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={t('property.delete') || 'Delete'}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    {t('property.delete') || 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          setDeletingId(deleteTarget.id);
          const ok = await deleteProperty(deleteTarget.id);
          setDeletingId(null);
          setDeleteTarget(null);
          if (ok) {
            showToast(t('property.deleted') || 'Listing deleted.', 'success');
            refetch();
          } else {
            showToast(t('listing.failed') || 'Failed to delete. Please try again.', 'error');
          }
        }}
        title={t('property.delete') || 'Delete listing'}
        message={t('property.delete.confirm') || 'Are you sure you want to delete this listing? This cannot be undone.'}
        confirmLabel={t('property.delete') || 'Delete'}
        cancelLabel={t('cancel') || 'Cancel'}
        variant="danger"
        loading={deletingId === deleteTarget?.id}
      />
    </div>
  );
}
