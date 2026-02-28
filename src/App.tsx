import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import AssistantChat from './components/AssistantChat';
import LoadingSpinner from './components/LoadingSpinner';
import AccessibilitySkipLink from './components/AccessibilitySkipLink';
import { useProperties } from './contexts/PropertiesContext';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const BecomeHost = lazy(() => import('./pages/BecomeHost'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MyListings = lazy(() => import('./pages/MyListings'));
const HostReservations = lazy(() => import('./pages/HostReservations'));
const About = lazy(() => import('./pages/About'));
const Inbox = lazy(() => import('./pages/Inbox'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { properties, loading: propertiesLoading, error: propertiesError, refetch: refetchProperties } = useProperties();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <AccessibilitySkipLink />
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home properties={properties} loading={propertiesLoading} error={propertiesError} />} />
            <Route path="/property/:id" element={<PropertyDetail properties={properties} loading={propertiesLoading} refetchProperty={refetchProperties} />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/become-host" element={<BecomeHost />} />
            <Route path="/become-host/:id" element={<BecomeHost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/host-reservations" element={<HostReservations />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CookieConsent />
      <AssistantChat properties={properties} />
    </div>
  );
}

export default App;
