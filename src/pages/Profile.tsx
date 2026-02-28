import { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Heart, BookOpen, Globe, Moon, Sun, Edit3, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../contexts/ToastContext';
import { fetchUserBookings } from '../lib/bookings';
import { getProfile, updateProfile, type ProfileRow } from '../lib/profile';
import { deleteAccount } from '../lib/deleteAccount';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<Awaited<ReturnType<typeof fetchUserBookings>>>([]);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/profile', { replace: true });
      return;
    }
    let cancelled = false;
    Promise.all([
      fetchUserBookings(user.id),
      getProfile(user.id),
    ])
      .then(([bookingsData, profileData]) => {
        if (!cancelled) {
          setBookings(bookingsData);
          setProfile(profileData ?? null);
          setEditName(profileData?.full_name ?? user.user_metadata?.full_name ?? '');
        }
      })
      .catch(() => { if (!cancelled) setBookings([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, navigate]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || '';

  const bookingsCount = bookings.length;
  const activeBookings = bookings.filter((b) => b.status === 'upcoming').length;
  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const favoriteDestinations = Array.from(
    new Set(bookings.map((b) => b.property.location).filter(Boolean))
  );

  const memberSinceFormatted = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  const handleLanguageChange = (newLanguage: 'en' | 'sr') => {
    setLanguage(newLanguage);
    showToast(
      newLanguage === 'en' ? 'Language changed to English' : 'Jezik promenjen na Srpski',
      'success'
    );
  };

  const handleThemeToggle = () => {
    toggleTheme();
    showToast(
      theme === 'dark' ? 'Switched to light mode' : 'Switched to dark mode',
      'success'
    );
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await updateProfile(user.id, { full_name: editName.trim() || null });
    setSavingProfile(false);
    if (error) {
      showToast(error, 'error');
      return;
    }
    setProfile((prev) => (prev ? { ...prev, full_name: editName.trim() || null, updated_at: new Date().toISOString() } : { id: user.id, email: user.email ?? null, full_name: editName.trim() || null, avatar_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
    showToast(t('profile.updated') || 'Profile updated', 'success');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE' || deleting) return;
    setDeleting(true);
    try {
      await deleteAccount();
      await signOut();
      showToast(t('delete.account.done') || 'Account deleted. You have been signed out.', 'success');
      navigate('/', { replace: true });
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to delete account', 'error');
    } finally {
      setDeleting(false);
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title={t('profile') || 'Profile'}
        description="Manage your account settings, view bookings, and preferences"
      />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t('profile') || 'Profile'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Profile Card and Quick Actions */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* User Info Card - real data */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-4 sm:gap-6 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FF385C] to-[#E61E4D] flex items-center justify-center flex-shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-md" aria-hidden="true">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                    {displayName ? `${t('welcome') || 'Welcome'}, ${displayName}` : `${t('welcome') || 'Welcome'}!`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base truncate mt-0.5" title={user.email}>
                    {user.email}
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                    {t('member.since') || 'Member since'} {memberSinceFormatted}
                  </p>
                </div>
              </div>

              {/* Stats - real counts */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700" role="list" aria-label="User statistics">
                <div className="text-center" role="listitem">
                  <div className="text-2xl sm:text-3xl font-bold text-[#FF385C] dark:text-[#FF385C]">
                    {bookingsCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('bookings') || 'Bookings'}
                  </div>
                </div>
                <div className="text-center" role="listitem">
                  <div className="text-2xl sm:text-3xl font-bold text-[#FF385C] dark:text-[#FF385C]">
                    {favorites.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('favorites') || 'Favorites'}
                  </div>
                </div>
                <div className="text-center" role="listitem">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    ${totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('total.spent') || 'Total Spent'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('quick.actions') || 'Quick Actions'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => navigate('/bookings')}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-[#FF385C]/50 transition-all text-left min-h-[44px] group"
                  aria-label={t('my.bookings') || 'My Bookings'}
                >
                  <BookOpen className="h-6 w-6 text-[#FF385C] group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{t('my.bookings') || 'My Bookings'}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{activeBookings} {t('active') || 'active'}</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/favorites')}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-[#FF385C]/50 transition-all text-left min-h-[44px] group"
                  aria-label={t('favorites') || 'Favorites'}
                >
                  <Heart className="h-6 w-6 text-[#FF385C] group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{t('favorites') || 'Favorites'}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{favorites.length} {t('saved') || 'saved'}</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/my-listings')}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-[#FF385C]/50 transition-all text-left min-h-[44px] group"
                  aria-label={t('my.listings') || 'My Listings'}
                >
                  <MapPin className="h-6 w-6 text-[#FF385C] group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{t('my.listings') || 'My Listings'}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('list.your.place') || 'List your place'}</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/host-reservations')}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-[#FF385C]/50 transition-all text-left min-h-[44px] group"
                  aria-label={t('host.reservations') || 'Rezervacije'}
                >
                  <BookOpen className="h-6 w-6 text-[#FF385C] group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{t('host.reservations') || 'Rezervacije'}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('host.reservations.short') || 'Rezervacije tvojih smeštaja'}</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-[#FF385C]/50 transition-all text-left min-h-[44px] group"
                  aria-label={t('explore') || 'Explore'}
                >
                  <Calendar className="h-6 w-6 text-[#FF385C] group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{t('explore') || 'Explore'}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('find.stays') || 'Find stays'}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Favorite Destinations - from real bookings */}
            {favoriteDestinations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {t('favorite.destinations') || 'Favorite Destinations'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {favoriteDestinations.map((dest) => (
                    <span
                      key={dest}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Settings and Account */}
          <div className="space-y-6">
            {/* Account Info - real email and member since */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('account') || 'Account'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Mail className="h-5 w-5 flex-shrink-0 text-[#FF385C]" aria-hidden="true" />
                  <span className="text-sm truncate" title={user.email}>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5 flex-shrink-0 text-[#FF385C]" aria-hidden="true" />
                  <span className="text-sm">{t('member.since') || 'Member since'} {memberSinceFormatted}</span>
                </div>
              </div>
            </div>

            {/* Edit profile - Supabase profiles */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-[#FF385C]" aria-hidden="true" />
                {t('edit.profile') || 'Edit profile'}
              </h3>
              <div className="space-y-3">
                <label htmlFor="profile-display-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('display.name') || 'Display name'}
                </label>
                <input
                  id="profile-display-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={t('your.name') || 'Your name'}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF385C] outline-none min-h-[44px]"
                  aria-label={t('display.name') || 'Display name'}
                />
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF385C] hover:bg-[#E61E4D] text-white font-medium min-h-[44px] disabled:opacity-50 transition-colors"
                  aria-label={t('save') || 'Save'}
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  {savingProfile ? (t('saving') || 'Saving...') : (t('save') || 'Save')}
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('settings') || 'Settings'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" aria-hidden="true" />
                    <label htmlFor="language-select" className="text-gray-900 dark:text-gray-100 font-medium">
                      {t('language') || 'Language'}
                    </label>
                  </div>
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'sr')}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none min-h-[44px] text-sm cursor-pointer"
                    aria-label={t('select.language') || 'Select language'}
                  >
                    <option value="en">English</option>
                    <option value="sr">Srpski</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <Sun className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{t('theme') || 'Theme'}</span>
                  </div>
                  <button
                    onClick={handleThemeToggle}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-[#FF385C] transition-all min-h-[44px] text-sm font-medium"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {theme === 'dark' ? (t('light') || 'Light') : (t('dark') || 'Dark')}
                  </button>
                </div>
              </div>
            </div>

            {/* Delete account */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900/50 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                <Trash2 className="h-5 w-5" aria-hidden="true" />
                {t('delete.account') || 'Delete account'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('delete.account.desc') || 'Permanently delete your account and all associated data. This cannot be undone.'}
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-lg border border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium min-h-[44px]"
                aria-label={t('delete.account') || 'Delete account'}
              >
                {t('delete.account') || 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete account confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md shadow-xl">
            <h2 id="delete-account-title" className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              {t('delete.account') || 'Delete account'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('delete.account.confirm') || 'Are you sure? Type "DELETE" to confirm.'}
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 outline-none mb-4"
              aria-label={t('delete.account.confirm') || 'Type DELETE to confirm'}
              disabled={deleting}
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[44px] disabled:opacity-50"
              >
                {t('cancel') || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE' || deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (language === 'sr' ? 'Brisanje...' : 'Deleting...') : (t('delete.account') || 'Delete account')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
