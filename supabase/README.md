# Supabase – Nexora Balkans

Koristi se **anon public** (ili Publishable) u frontendu; **Secret** i **Legacy JWT** nikad u browseru – samo server-side / Edge Function secrets.

## Gdje šta staviti

| Šta imaš u Dashboardu | Gdje ide | Napomena |
|------------------------|----------|----------|
| **Project URL** | `.env` → `VITE_SUPABASE_URL` | npr. `https://your-project-ref.supabase.co` |
| **Anon public** (JWT, tri segmenta) | `.env` → `VITE_SUPABASE_PUBLISHABLE_KEY` | Preporučeno za frontend; Edge Function gateway prihvata zahtjeve. |
| **Publishable key** (`sb_publishable_...`) | Opciono u `.env` umjesto anon | Ako dobiješ "Invalid JWT" na Edge Function pozivima, vrati **anon public** JWT. |
| **Secret key** (`sb_secret_...`) | Samo u **Dashboard** → Edge Functions → delete-user → **Secrets** | Ime secreta: `SERVICE_ROLE_KEY`, vrijednost: tvoj Secret key. Ne stavljati u .env ni u kod. |
| **Legacy JWT secret** | Nigdje u aplikaciji | Supabase ga koristi interno za potpis; ne treba ga u projektu. |

## Podešavanje

1. **Env varijable** – u rootu projekta:
   - Kopiraj `.env.example` u `.env`.
   - Postavi `VITE_SUPABASE_URL` (Project URL) i `VITE_SUPABASE_PUBLISHABLE_KEY` (anon public JWT).

2. **Auth** – u Supabase Dashboard → **Authentication** → **Providers**: uključi **Email**.

3. **Baza** – u [Supabase Dashboard](https://supabase.com/dashboard) → tvoj projekat → **SQL Editor** pokreni redom:
   - `supabase/migrations/001_create_properties.sql` – tabela `properties`
   - `supabase/seed.sql` – seed smještaja (opciono)
   - `supabase/migrations/002_auth_profiles_bookings.sql` – `profiles`, `bookings`, `properties.user_id`, RLS, trigger za novog korisnika
   - `supabase/migrations/003_contact_submissions.sql` – tabela za kontakt formu (insert za sve)
   - `supabase/migrations/004_clear_all_reviews.sql` – opciono: postavlja `reviews` i `rating` na 0 za sve nekretnine (uklanja sve recenzije)
   - `supabase/migrations/005_reviews.sql` – tabela `reviews` (property_id, user_id, rating, comment), RLS (svi čitaju; samo prijavljeni mogu dodati), trigger za ažuriranje `properties.rating` i `properties.reviews`
   - `supabase/seed_fake_reviews.sql` – opciono: po jedna lažna recenzija po nekretnini (koristi prvog korisnika iz auth; pokrenuti nakon što postoji bar jedan nalog)

4. **Brisanje naloga (Delete account)** – Edge Function:
   - Deploy: u rootu projekta: `npx supabase functions deploy delete-user --project-ref <YOUR_PROJECT_REF> --no-verify-jwt`
   - **`--no-verify-jwt`** je obavezan: gateway inače vraća 401 prije nego zahtjev stigne do funkcije; funkcija sama parsira JWT i briše samo tog korisnika.
   - U Dashboardu → **Edge Functions** → delete-user → **Secrets**: dodaj secret **`SERVICE_ROLE_KEY`** s vrijednošću = tvoj **Secret key** (sb_secret_...). Ime ne smije počinjati s `SUPABASE_`.

## Tabele

- **properties**: `id`, `user_id` (vlasnik), `image_url`, `images`, `location`, `title`, `description`, `price`, `rating`, `dates`, `guests`, `bedrooms`, `beds`, `bathrooms`, `amenities`, `category`, `host`, `reviews`, `check_in`, `check_out`, `created_at`. RLS: SELECT svi, INSERT prijavljeni, UPDATE/DELETE vlasnik.
- **profiles**: `id` (auth.users), `email`, `full_name`, `avatar_url`. Kreira se automatski triggerom pri signup.
- **bookings**: `id`, `user_id`, `property_id`, `check_in`, `check_out`, `guests`, `total_price`, `status` (upcoming/completed/cancelled). RLS: korisnik vidi/otkazuje samo svoje.
- **contact_submissions**: `id`, `name`, `email`, `subject`, `message`, `created_at`. RLS: samo INSERT (anon može slati); čitanje preko service role ako treba.

Funkcija `delete-user` prima JWT korisnika iz zahteva, izvlači user id i pomoću service role briše korisnika iz `auth.users` (cascade utječe na povezane podatke).
