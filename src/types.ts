export interface Property {
  id: string;
  imageUrl: string;
  images: string[];
  location: string;
  lat?: number | null;
  lng?: number | null;
  title: string;
  description: string;
  price: number;
  rating: number;
  dates: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  category: string[];
  host: {
    name: string;
    isSuperhost: boolean;
    hostingSince: string;
    avatar?: string;
    responseTime?: string;
    responseRate?: number;
  };
  reviews: number;
  checkIn?: string;
  checkOut?: string;
  /** Owner user id (auth.users) when listed by host */
  user_id?: string | null;
  /** Cancellation policy: flexible | moderate | strict */
  cancellationPolicy?: string | null;
}

/** DB row from Supabase public.properties (snake_case) */
export interface PropertyRow {
  id: string;
  image_url: string;
  images: string[] | unknown;
  location: string;
  lat?: number | null;
  lng?: number | null;
  title: string;
  description: string;
  price: number;
  rating: number;
  dates: string | null;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[] | unknown;
  category: string[] | unknown;
  host: Record<string, unknown>;
  reviews: number;
  check_in: string | null;
  check_out: string | null;
  user_id?: string | null;
  cancellation_policy?: string | null;
}

export function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    imageUrl: row.image_url,
    images: Array.isArray(row.images) ? row.images : [],
    location: row.location,
    lat: row.lat != null ? Number(row.lat) : undefined,
    lng: row.lng != null ? Number(row.lng) : undefined,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    rating: Number(row.rating),
    dates: row.dates ?? '',
    guests: row.guests,
    bedrooms: row.bedrooms,
    beds: row.beds,
    bathrooms: Number(row.bathrooms),
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    category: Array.isArray(row.category) ? row.category : [],
    host: {
      name: (row.host?.name as string) ?? 'Host',
      isSuperhost: (row.host?.isSuperhost as boolean) ?? false,
      hostingSince: (row.host?.hostingSince as string) ?? '',
      avatar: row.host?.avatar as string | undefined,
      responseTime: row.host?.responseTime as string | undefined,
      responseRate: row.host?.responseRate as number | undefined,
    },
    reviews: row.reviews,
    checkIn: row.check_in ?? undefined,
    checkOut: row.check_out ?? undefined,
    user_id: row.user_id ?? undefined,
  };
}

export function propertyToRow(p: Property): Omit<PropertyRow, 'id'> {
  return {
    image_url: p.imageUrl,
    images: p.images,
    location: p.location,
    lat: p.lat ?? null,
    lng: p.lng ?? null,
    title: p.title,
    description: p.description,
    price: p.price,
    rating: p.rating,
    dates: p.dates || null,
    guests: p.guests,
    bedrooms: p.bedrooms,
    beds: p.beds,
    bathrooms: p.bathrooms,
    amenities: p.amenities,
    category: p.category,
    host: p.host,
    reviews: p.reviews,
    check_in: p.checkIn ?? null,
    check_out: p.checkOut ?? null,
    user_id: p.user_id ?? null,
    cancellation_policy: p.cancellationPolicy ?? null,
  };
}