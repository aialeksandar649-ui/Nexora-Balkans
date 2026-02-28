-- Nexora: Hosts can update (cancel) bookings for their properties

DROP POLICY IF EXISTS "Hosts can update bookings for their properties" ON public.bookings;
CREATE POLICY "Hosts can update bookings for their properties" ON public.bookings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = bookings.property_id
        AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = bookings.property_id
        AND p.user_id = auth.uid()
    )
  );

COMMENT ON POLICY "Hosts can update bookings for their properties" ON public.bookings IS 'Property owners can cancel reservations for their listings';
