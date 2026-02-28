import { supabase } from './supabase';
import { rowToProperty } from '../types';
import type { PropertyRow } from '../types';

export interface BookedDateRange {
  check_in: string;
  check_out: string;
}

/** Fetch blocked date ranges for a property (from existing bookings) */
export async function fetchPropertyBookedDates(propertyId: string): Promise<BookedDateRange[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('get_property_booked_dates', {
    p_property_id: propertyId,
  });
  if (error) return [];
  return (data ?? []) as BookedDateRange[];
}

/** Check if a date range overlaps with any booked dates */
export function datesOverlapBooked(
  start: Date,
  end: Date,
  booked: BookedDateRange[]
): boolean {
  const startTime = start.getTime();
  const endTime = end.getTime();
  for (const range of booked) {
    const rangeStart = new Date(range.check_in).getTime();
    const rangeEnd = new Date(range.check_out).getTime();
    if (startTime < rangeEnd && endTime > rangeStart) return true;
  }
  return false;
}

export interface BookingRow {
  id: string;
  user_id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
  properties?: PropertyRow | null;
  property?: PropertyRow | null;
}

export interface BookingWithProperty {
  id: string;
  propertyId: string;
  property: ReturnType<typeof rowToProperty>;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingDate: Date;
}

export function bookingRowToBooking(row: BookingRow): BookingWithProperty {
  const propRow = row.properties ?? row.property;
  const prop = propRow ? rowToProperty(propRow) : null;
  if (!prop) {
    throw new Error('Booking missing property');
  }
  return {
    id: row.id,
    propertyId: row.property_id,
    property: prop,
    checkIn: new Date(row.check_in),
    checkOut: new Date(row.check_out),
    guests: row.guests,
    totalPrice: Number(row.total_price),
    status: row.status,
    bookingDate: new Date(row.created_at),
  };
}

export async function fetchUserBookings(userId: string): Promise<BookingWithProperty[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('bookings')
    .select('*, properties(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: BookingRow) => bookingRowToBooking(row));
}

/** Fetch all bookings for properties owned by the given user (host view). Requires RLS policy "Hosts can read bookings for their properties". */
export async function fetchHostBookings(hostUserId: string): Promise<BookingWithProperty[]> {
  if (!supabase) return [];
  const { data: propertiesData, error: propsError } = await supabase
    .from('properties')
    .select('id')
    .eq('user_id', hostUserId);
  if (propsError || !propertiesData?.length) return [];
  const propertyIds = propertiesData.map((p) => p.id);
  const { data, error } = await supabase
    .from('bookings')
    .select('*, properties(*)')
    .in('property_id', propertyIds)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .filter((row: BookingRow) => row.properties ?? row.property)
    .map((row: BookingRow) => bookingRowToBooking(row));
}

export async function createBooking(
  userId: string,
  propertyId: string,
  checkIn: Date,
  checkOut: Date,
  guests: number,
  totalPrice: number
): Promise<{ id: string } | { error: string }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      property_id: propertyId,
      check_in: checkIn.toISOString().slice(0, 10),
      check_out: checkOut.toISOString().slice(0, 10),
      guests,
      total_price: totalPrice,
      status: 'upcoming',
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  return { id: data.id };
}

export async function cancelBooking(bookingId: string, userId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('user_id', userId);
  return { error: error?.message ?? null };
}

/** Cancel a booking as host (property owner). Requires RLS policy "Hosts can update bookings for their properties". */
export async function cancelBookingAsHost(bookingId: string, hostUserId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { data: props } = await supabase
    .from('properties')
    .select('id')
    .eq('user_id', hostUserId);
  if (!props?.length) return { error: 'No properties found' };
  const propertyIds = props.map((p) => p.id);
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, property_id')
    .eq('id', bookingId)
    .single();
  if (!booking || !propertyIds.includes(booking.property_id)) {
    return { error: 'Booking not found or you are not the host' };
  }
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);
  return { error: error?.message ?? null };
}

export async function deleteAccount(): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) return { error: 'Not signed in' };
  const { data, error } = await supabase.functions.invoke('delete-user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { error: null };
}
