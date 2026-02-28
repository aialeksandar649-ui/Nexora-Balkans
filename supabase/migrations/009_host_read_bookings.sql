-- Nexora: Hosts can read bookings for their own properties

DROP POLICY IF EXISTS "Hosts can read bookings for their properties" ON public.bookings;
CREATE POLICY "Hosts can read bookings for their properties" ON public.bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = bookings.property_id
        AND p.user_id = auth.uid()
    )
  );

COMMENT ON POLICY "Hosts can read bookings for their properties" ON public.bookings IS 'Property owners can see reservations (bookings) for their listings';
