-- Contact form submissions (for CV/portfolio; anon can insert)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert for anyone" ON public.contact_submissions;
CREATE POLICY "Allow insert for anyone" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

-- Only service role / backend can read (no SELECT for anon)
COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions - insert only from client';
