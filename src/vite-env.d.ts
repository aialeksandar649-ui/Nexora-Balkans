/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  /** Base URL za Netlify (npr. https://tvoj-sajt.netlify.app) – u devu da asistent radi bez netlify dev */
  readonly VITE_NETLIFY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
