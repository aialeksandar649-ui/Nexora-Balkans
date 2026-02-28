import { useState, useEffect } from 'react';
import { Search, Globe, Menu, User, LogOut, Heart, BookOpen, Moon, Sun, X, Home, MessageCircle, Calendar } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getUnreadMessageCount } from '../lib/messages';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sr' : 'en');
  };

  // Update search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showUserMenu) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showUserMenu]);

  // Fetch unread message count when user is logged in
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const refresh = () => getUnreadMessageCount().then(setUnreadCount);
    refresh();
    const interval = setInterval(refresh, 30000);
    const onInboxUpdate = () => refresh();
    window.addEventListener('inbox-updated', onInboxUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('inbox-updated', onInboxUpdate);
    };
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    navigate('/');
  };

  return (
    <header role="banner" className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center min-h-[44px] min-w-[44px]" onClick={clearSearch} aria-label="Nexora Home">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0Z" fill="#FF385C"/>
                <path d="M16 8C11.582 8 8 11.582 8 16C8 20.418 11.582 24 16 24C20.418 24 24 20.418 24 16C24 11.582 20.418 8 16 8Z" fill="white"/>
              </svg>
              <span className="text-lg sm:text-xl font-semibold text-[#FF385C] hidden xs:block">Nexora</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex items-center w-full" role="search">
              <div className="relative flex-1">
                <label htmlFor="desktop-search" className="sr-only">{t('search.destinations')}</label>
                <input
                  id="desktop-search"
                  type="text"
                  placeholder={t('search.destinations')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-10 rounded-full border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                  aria-label={t('search.destinations')}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={t('clear.search') || 'Clear search'}
                  >
                    <X className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="ml-2 bg-[#FF385C] hover:bg-[#E61E4D] p-3 rounded-full text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={t('search')}
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Mobile Search Button */}
          <div className="md:hidden flex-1 mx-2 sm:mx-4">
            <form onSubmit={handleSearch} className="flex items-center gap-1.5 sm:gap-2" role="search">
              <div className="relative flex-1">
                <label htmlFor="mobile-search" className="sr-only">{t('search')}</label>
                <input
                  id="mobile-search"
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none min-h-[44px]"
                  aria-label={t('search')}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={t('clear.search') || 'Clear search'}
                  >
                    <X className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-[#FF385C] hover:bg-[#E61E4D] p-2.5 sm:p-2 rounded-full text-white min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                aria-label={t('search')}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {user ? (
              <>
                <Link 
                  to="/become-host" 
                  className="hidden md:block px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors min-h-[44px]"
                  aria-label={t('become.host')}
                >
                  {t('become.host')}
                </Link>
                <Link 
                  to="/my-listings" 
                  className="hidden md:block px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors min-h-[44px]"
                  aria-label={t('my.listings')}
                >
                  {t('my.listings')}
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hidden md:block px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors min-h-[44px]"
                  aria-label={t('log.in')}
                >
                  {t('log.in')}
                </Link>
                <Link 
                  to="/register" 
                  className="hidden md:block px-4 py-2 rounded-full bg-[#FF385C] hover:bg-[#E61E4D] text-white text-sm font-semibold transition-colors min-h-[44px] px-4 py-2 rounded-full"
                  aria-label={t('sign.up')}
                >
                  {t('sign.up')}
                </Link>
              </>
            )}
            
            {/* Theme Toggle Button - Always Visible */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg sm:rounded-full transition-all min-h-[44px] min-w-[44px] sm:min-w-auto shadow-md hover:shadow-lg font-semibold text-sm"
              style={{ borderRadius: '9999px' }}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              )}
            </button>
            
            {/* Language Toggle Button - Always Visible */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-lg sm:rounded-full transition-all min-h-[44px] min-w-[44px] sm:min-w-auto shadow-md hover:shadow-lg font-semibold text-sm"
              style={{ borderRadius: '9999px' }}
              aria-label={language === 'en' ? 'Switch to Serbian' : 'Switch to English'}
              title={language === 'en' ? 'Switch to Serbian' : 'Switch to English'}
            >
              <Globe className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'SR'}</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:shadow-md transition-all bg-white dark:bg-gray-800 min-h-[44px]"
                aria-label={t('user.menu') || 'User menu'}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF385C] px-1.5 text-xs font-bold text-white"
                    aria-label={`${unreadCount} ${unreadCount === 1 ? t('unread.message') || 'unread message' : t('unread.messages') || 'unread messages'}`}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300 hidden xs:block" aria-hidden="true" />
              </button>
              
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                    aria-hidden="true"
                  ></div>
                  <nav 
                    className="absolute right-0 mt-2 w-56 sm:w-64 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                    role="menu"
                    aria-label={t('user.menu') || 'User menu'}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{t('account')}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/bookings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                          role="menuitem"
                        >
                          <BookOpen className="h-5 w-5" aria-hidden="true" />
                          <span>{t('my.bookings')}</span>
                        </Link>
                        <Link
                          to="/inbox"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                          role="menuitem"
                        >
                          <span className="relative inline-flex">
                            <MessageCircle className="h-5 w-5" aria-hidden="true" />
                            {unreadCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF385C] px-1 text-[10px] font-bold text-white">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </span>
                            )}
                          </span>
                          <span>{t('inbox') || 'Inbox'}{unreadCount > 0 ? ` (${unreadCount})` : ''}</span>
                        </Link>
                        <Link
                          to="/favorites"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                          role="menuitem"
                        >
                          <Heart className="h-5 w-5" aria-hidden="true" />
                          <span>{t('saved.properties')}</span>
                        </Link>
                        <Link
                          to="/my-listings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                          role="menuitem"
                        >
                          <Home className="h-5 w-5" aria-hidden="true" />
                          <span>{t('my.listings')}</span>
                        </Link>
                        <Link
                          to="/host-reservations"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                          role="menuitem"
                        >
                          <Calendar className="h-5 w-5" aria-hidden="true" />
                          <span>{t('host.reservations') || 'Rezervacije'}</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                          role="menuitem"
                        >
                          <User className="h-5 w-5" aria-hidden="true" />
                          <span>{t('profile') || 'Profile'}</span>
                        </Link>
                        <Link
                          to="/become-host"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                          role="menuitem"
                        >
                          <User className="h-5 w-5" aria-hidden="true" />
                          <span>{t('become.host')}</span>
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <button
                          onClick={() => { signOut(); setShowUserMenu(false); navigate('/'); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 w-full text-left min-h-[44px]"
                          role="menuitem"
                        >
                          <LogOut className="h-5 w-5" aria-hidden="true" />
                          <span>{t('log.out')}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                          role="menuitem"
                        >
                          <User className="h-5 w-5" aria-hidden="true" />
                          <span>{t('log.in')}</span>
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 min-h-[44px]"
                          role="menuitem"
                        >
                          <User className="h-5 w-5" aria-hidden="true" />
                          <span>{t('sign.up')}</span>
                        </Link>
                      </>
                    )}
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
