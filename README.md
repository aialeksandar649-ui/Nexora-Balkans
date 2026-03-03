np# Nexora - Balkans Accommodation Platform

A modern, full-featured booking platform for discovering and booking unique accommodations in the Balkans. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Live Demo

**https://nexorabalkan.netlify.app**

---

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

## ✨ Features

### Core Functionality
- 🏠 **Property Listings** - Browse detailed property information with high-quality images (from Supabase)
- 🔍 **Advanced Search & Filtering** - Filter by price, location, amenities, bedrooms, and more
- 📅 **Booking System** - Complete booking flow with date selection and guest management; bookings stored in Supabase
- 👤 **Auth & Profiles** - Sign up, login, profile with display name (Supabase Auth + `profiles` table)
- 🏘️ **Become Host** - Add listings with image upload (Supabase Storage or ImgBB fallback), location picker (Leaflet), edit existing listings
- 📋 **My Bookings / My Listings** - Real data from Supabase; cancel bookings, view your listings, delete with confirmation modal
- 📬 **Guest–Host Messaging** - Inbox for conversations; contact host from property page
- 📆 **Host Reservations** - Hosts see bookings for their properties; can cancel upcoming reservations
- 💾 **Favorites** - Saved properties (client-side); recent views
- 🗺️ **Map View** - OpenStreetMap embed showing property locations; fullscreen support
- 📍 **Location Map Picker** - Click-to-pin location when adding/editing listings (Leaflet + Nominatim)
- 📊 **Property Comparison** - Compare multiple properties side-by-side
- ⭐ **Reviews & Ratings** - Property reviews count and ratings display
- 🤖 **AI Assistant** - Chat assistant (Hugging Face) for platform questions; uses live property list when deployed on Netlify

### User Experience
- 🌍 **Multi-language Support** - English and Serbian (Srpski)
- 🌙 **Dark Mode** - Full dark mode support with system preference detection
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Performance Optimized** - Code splitting, lazy loading, and optimized images
- 🎨 **Modern UI/UX** - Clean, intuitive interface inspired by modern booking platforms
- 🔔 **Toast Notifications** - User-friendly notifications for actions
- 💾 **Recent Views** - Track recently viewed properties
- ❤️ **Favorites System** - Save and manage favorite properties

### Pages & Features
- 🏡 **Home** - Property listings with categories and filters; skeleton loaders; map preview (Supabase)
- 🏠 **Property Detail** - Detailed property view with booking calendar, blocked dates, reviews; reserve, contact host; MapView (Supabase)
- 📋 **Bookings** - Manage reservations (upcoming, completed, cancelled) from Supabase
- 📆 **Host Reservations** - Hosts view and cancel bookings for their listings
- 👤 **Profile** - User profile, stats, edit display name (Supabase `profiles`)
- ⭐ **Favorites** - Saved properties collection
- 🏘️ **Become Host** - Property form with image upload, location picker; add/edit listings (Supabase)
- 📬 **Inbox** - Guest–host conversations (Supabase `conversations`, `messages`)
- 📖 **Help Center** - FAQ and support information
- 📞 **Contact** - Contact form; submissions stored in Supabase (`contact_submissions`)
- ℹ️ **About** - Project and tech stack overview (portfolio)
- ℹ️ **How It Works** - Platform explanation
- 📄 **Legal Pages** - Privacy Policy and Terms of Service
- 404 **NotFound** - Catch-all route with friendly message and links

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.2** - Fast build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **React Router 6.22.3** - Client-side routing
- **Lucide React** - Icon library

### Backend (Supabase)
- **Supabase** - Auth (email/password), PostgreSQL, Row Level Security (RLS)
- **Tables** - `properties`, `profiles`, `bookings`, `contact_submissions`, `conversations`, `messages`, `reviews`, `admin_users`
- **Storage** - `property-images` bucket for uploads; ImgBB fallback if Supabase fails or is unconfigured
- **Edge Functions** - Optional (delete-user); see `supabase/README.md`
- **Netlify Functions** - Optional (chat assistant using Hugging Face Inference API)

### Features & Patterns
- **Context API** - State management (Theme, Language, Properties, Toast)
- **Custom Hooks** - Reusable logic (useFavorites, useRecentViews, useDebounce, useIntersectionObserver)
- **Error Boundaries** - Graceful error handling
- **Lazy Loading** - Code splitting for better performance
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components
- **PWA Ready** - Service worker and manifest support
- **SEO Optimized** - Dynamic meta tags and Open Graph support

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Nexora-Balkans-Accommodation-Platform-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Backend (Supabase)

To use auth, bookings, profiles, and contact form:

1. Create a project at [Supabase](https://supabase.com).
2. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (anon/public key).
3. In Supabase Dashboard: run the SQL migrations in `supabase/migrations/` (in order: `001`, `002`, `003`) and optionally `supabase/seed.sql`. Enable Email auth under Authentication → Providers.
4. See **supabase/README.md** for full setup (RLS, profiles, Edge Function secrets).
5. **Admin panel** (`/admin`): lists contact form submissions. Access is restricted by RLS or admin role on the backend (`admin_get_contact_submissions` RPC); non-admin users see an "Access denied" message.

### 🔒 Environment variables & secrets

- **Never commit `.env`** — it is gitignored. Use `.env.example` as a template.
- **Frontend** (in `.env`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key only). Optional: `VITE_NETLIFY_URL` for local assistant (base URL of your deployed site).
- **Netlify (live site)** — **Chat assistant**: In Netlify Dashboard → your site → **Site configuration** → **Environment variables**, add **`HUGGINGFACE_API_KEY`** with your Hugging Face API token (get it at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)). Without this, the assistant returns "Assistant not configured".
- **Local assistant**: Add `HUGGINGFACE_API_KEY` to `.env` and run `npx netlify dev` (or set `VITE_NETLIFY_URL` to your deployed URL and call the live function from local frontend).
- **Supabase Dashboard** → Edge Functions → delete-user → **Secrets**: add `SERVICE_ROLE_KEY` with your project Secret key. Do not put the secret in `.env` or in code.

## 🧭 Tech decisions

- **Supabase** — Auth, PostgreSQL, RLS, Storage and Edge Functions keep the backend in one place; RLS enforces who can read/write what without extra API middleware.
- **Direct fetch for delete-user** — The Edge Function is deployed with `--no-verify-jwt` so the gateway forwards the request; the function itself parses the user JWT and deletes only that user, keeping security in our code.
- **Netlify Functions for the assistant** — Hugging Face API token stays server-side; the frontend calls `/.netlify/functions/chat` so the key is never exposed in the client.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AccessibilitySkipLink.tsx
│   ├── BookingCalendar.tsx
│   ├── Categories.tsx
│   ├── ErrorBoundary.tsx
│   ├── Filters.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ImageLightbox.tsx
│   ├── LoadingSpinner.tsx
│   ├── MapView.tsx
│   ├── PropertyCard.tsx
│   ├── PropertyComparison.tsx
│   ├── SEO.tsx
│   ├── SkeletonCard.tsx
│   ├── Toast.tsx
│   └── ui/              # UI component library
├── config/              # App config (e.g. portfolio author)
│   └── portfolio.ts
├── contexts/            # React Context providers
│   ├── LanguageContext.tsx
│   ├── PropertiesContext.tsx
│   ├── ThemeContext.tsx
│   └── ToastContext.tsx
├── data/                # Static fallback data
│   └── properties.ts
├── lib/                 # API / Supabase helpers
│   ├── supabase.ts      # Supabase client
│   ├── bookings.ts      # Bookings & delete-account
│   ├── profile.ts       # Profiles (get/update)
│   └── contact.ts       # Contact form submit
├── hooks/               # Custom React hooks
│   ├── useDebounce.ts
│   ├── useFavorites.ts
│   ├── useIntersectionObserver.ts
│   └── useRecentViews.ts
├── pages/               # Page components
│   ├── About.tsx
│   ├── BecomeHost.tsx
│   ├── Bookings.tsx
│   ├── Contact.tsx
│   ├── Favorites.tsx
│   ├── HelpCenter.tsx
│   ├── Home.tsx
│   ├── HowItWorks.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── MyListings.tsx
│   ├── PrivacyPolicy.tsx
│   ├── Profile.tsx
│   ├── PropertyDetail.tsx
│   └── TermsOfService.tsx
├── App.tsx              # Main app component
├── main.tsx             # App entry point
├── types.ts             # TypeScript type definitions
└── index.css            # Global styles
```

## 🚀 Performance Optimizations

- **Code Splitting** - Lazy loading of route components
- **Image Optimization** - Lazy loading and responsive images
- **Bundle Optimization** - Manual chunk splitting for vendors
- **Debouncing** - Search and filter debouncing (300ms)
- **Memoization** - useMemo for expensive computations
- **Intersection Observer** - Ready for image lazy loading

## 🎯 Key Highlights for Portfolio

### Technical Skills Demonstrated
✅ **Modern React Patterns** - Hooks, Context API, Custom Hooks  
✅ **TypeScript** - Full type safety throughout  
✅ **Responsive Design** - Mobile-first, touch-optimized  
✅ **Performance** - Code splitting, lazy loading, optimization  
✅ **State Management** - Context API with proper patterns  
✅ **Error Handling** - Error boundaries and graceful degradation  
✅ **Accessibility** - WCAG 2.1 AA compliant, keyboard navigation  
✅ **Internationalization** - Multi-language support  
✅ **Dark Mode** - System preference detection  
✅ **PWA Ready** - Manifest and service worker support  
✅ **SEO Optimized** - Dynamic meta tags and Open Graph  

### Features Showcased
✅ Complete booking flow  
✅ Advanced search and filtering  
✅ Map integration  
✅ Property comparison  
✅ User favorites and bookings  
✅ Toast notifications  
✅ Image galleries with lightbox  
✅ Calendar date picker  
✅ Responsive design  
✅ Dark mode  
✅ Multi-language support  

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests (Vitest)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Type check without emitting files

## 🧪 Testing

- **Unit tests** — Vitest + React Testing Library for hooks and utilities (`npm run test`).
- Future: integration and E2E tests (e.g. Playwright).

## 🔒 Security

- **Secrets** — API keys and Secret key only in `.env` (not committed) or Supabase/Netlify secrets; see "Environment variables & secrets" above.
- Input validation on all forms; XSS protection via React escaping; secure headers in `netlify.toml`.

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- ARIA labels where needed
- Skip to main content link
- Focus management
- Semantic HTML
- Minimum 44px touch targets

## 📊 Performance

- Lighthouse: run `npm run build` then `npm run preview` and audit the preview URL (not dev server) for accurate scores
- LCP: hero image preloaded, `fetchpriority="high"`, smaller hero (w=1200), card thumbnails (w=400)
- Code splitting: react-vendor, supabase, route-level chunks; lucide icons tree-shaken per route
- Lazy loading for routes and images (`loading="lazy"`, `decoding="async"`)
- Service worker registration deferred via `requestIdleCallback` to reduce main-thread work
- Build target `es2020`, minified CSS/JS
- Debounced search (300ms), memoized computations

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 PWA Features

- Service Worker for offline support (caches `/`, `index.html`, `manifest.json` only; API requests always go to the network).
- Web App Manifest
- Installable on mobile devices
- App shortcuts
- Theme color customization
- Favicon: `public/favicon.svg` (Nexora branding). For full PWA icons, add `icon-192.png` and `icon-512.png` to `public/` (e.g. export from [RealFaviconGenerator](https://realfavicongenerator.net/) or from `favicon.svg`; otherwise some devices may 404 on the icon).

## 🔍 SEO Features

- Dynamic meta tags per page
- Open Graph tags for social sharing
- Twitter Card support
- Semantic HTML structure
- Proper heading hierarchy

## 🚀 Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18
3. Deploy!

The `netlify.toml` file is already configured with:
- Build command and publish directory
- SPA redirects (all routes → index.html)
- Security headers
- Cache headers for static assets

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Configure GitHub Pages to serve from the `dist` directory

Note: You may need to set the `base` path in `vite.config.ts` if deploying to a subdirectory.

## 📝 TODO / Future Enhancements

- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Real-time chat (Supabase Realtime subscriptions)
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Service worker improvements for offline support
- [ ] Push notifications
- [ ] Social media integration
- [ ] Video tours

## ✅ Implemented (Recent)

- Unit tests (Vitest) for `useDebounce`, `useFavorites`, and lib helpers (`types.test.ts`)
- Portfolio-ready About page (What I built, Why the Balkans?, What I'd do next)
- Nexora favicon; README tech decisions and security notes
- Author/portfolio: config in `src/config/portfolio.ts`, "Built by" in Footer and About
- 404 page with catch-all route
- Inbox: refetch conversations after sending
- Assistant chat: dynamic properties from frontend; set `HUGGINGFACE_API_KEY` on Netlify for live site
- Become Host: form validation (price > 0, max lengths)
- PropertyDetail: loading state before "not found"
- MyListings: delete confirmation modal
- Host: cancel reservation for upcoming bookings
- Home: skeleton loader on initial load
- ImgBB fallback for image upload
- Contact: demo note, support hours text; PWA SVG icons (icon-192.svg, icon-512.svg)

## 📄 License

Private project - Portfolio showcase

## 👨‍💻 Author

**Aleksandar** — [GitHub](https://github.com/aialeksandar649-ui)

Built as a portfolio project demonstrating modern React and TypeScript development skills.

## 🙏 Acknowledgments

- Design inspired by Airbnb
- Icons by Lucide React
- Images from Unsplash
