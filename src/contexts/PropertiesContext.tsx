/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Property, PropertyRow, rowToProperty, propertyToRow } from '../types';
import { properties as initialProperties } from '../data/properties';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface PropertiesContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  addProperty: (property: Omit<Property, 'id'>) => Promise<Property | null>;
  updateProperty: (property: Property) => Promise<Property | null>;
  deleteProperty: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

function withFallbackId(p: Property, index: number): Property {
  return { ...p, id: p.id || `local-${index}` };
}

function dedupeById(list: Property[]): Property[] {
  const seen = new Set<string>();
  return list.filter((p) => {
    const id = p.id || '';
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function dedupeByPlace(list: Property[]): Property[] {
  const byPlace = new Map<string, Property>();
  list.forEach((p) => {
    const key = `${(p.location ?? '').toLowerCase().trim()}|${(p.title ?? '').toLowerCase().trim()}`;
    if (!key.replace(/\|/g, '')) return;
    if (!byPlace.has(key)) byPlace.set(key, p);
  });
  return Array.from(byPlace.values());
}

const fallbackProperties: Property[] = dedupeByPlace(
  dedupeById(
    initialProperties.map((p, i) => withFallbackId({ ...p, id: `local-${i}` } as Property, i))
  )
);

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>(fallbackProperties);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    if (!supabase) {
      setProperties(fallbackProperties);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
      setProperties(fallbackProperties);
    } else {
      setProperties(
        dedupeByPlace(dedupeById((data ?? []).map((row: PropertyRow) => rowToProperty(row))))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const addProperty = useCallback(
    async (property: Omit<Property, 'id'>): Promise<Property | null> => {
      const row = { ...propertyToRow({ ...property, id: '' }), user_id: user?.id ?? null };
      if (!supabase) {
        const synthetic: Property = {
          ...property,
          id: `local-${Date.now()}`,
          user_id: user?.id ?? null,
        };
        setProperties((prev) => [...prev, synthetic]);
        return synthetic;
      }
      const { data, error: err } = await supabase
        .from('properties')
        .insert(row)
        .select('*')
        .single();
      if (err) {
        setError(err.message);
        return null;
      }
      const created = rowToProperty(data as PropertyRow);
      setProperties((prev) => dedupeByPlace(dedupeById([created, ...prev])));
      return created;
    },
    [user?.id]
  );

  const updateProperty = useCallback(
    async (property: Property): Promise<Property | null> => {
      if (!property.id) return null;
      const row = propertyToRow(property);
      if (!supabase) {
        setProperties((prev) =>
          dedupeByPlace(
            dedupeById(prev.map((p) => (p.id === property.id ? { ...property, user_id: user?.id ?? null } : p)))
          )
        );
        return { ...property, user_id: user?.id ?? null };
      }
      const { data, error: err } = await supabase
        .from('properties')
        .update({
          image_url: row.image_url,
          images: row.images,
          location: row.location,
          lat: row.lat,
          lng: row.lng,
          title: row.title,
          description: row.description,
          price: row.price,
          rating: row.rating,
          dates: row.dates,
          guests: row.guests,
          bedrooms: row.bedrooms,
          beds: row.beds,
          bathrooms: row.bathrooms,
          amenities: row.amenities,
          category: row.category,
          host: row.host,
          reviews: row.reviews,
          check_in: row.check_in,
          check_out: row.check_out,
          cancellation_policy: row.cancellation_policy,
        })
        .eq('id', property.id)
        .eq('user_id', user?.id)
        .select('*')
        .single();
      if (err) {
        setError(err.message);
        return null;
      }
      const updated = rowToProperty(data as PropertyRow);
      setProperties((prev) =>
        dedupeByPlace(dedupeById(prev.map((p) => (p.id === property.id ? updated : p))))
      );
      return updated;
    },
    [user?.id]
  );

  const deleteProperty = useCallback(
    async (id: string): Promise<boolean> => {
      if (!supabase) {
        setProperties((prev) => dedupeByPlace(dedupeById(prev.filter((p) => p.id !== id))));
        return true;
      }
      const { error: err } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      if (err) {
        setError(err.message);
        return false;
      }
      setProperties((prev) => dedupeByPlace(dedupeById(prev.filter((p) => p.id !== id))));
      return true;
    },
    [user?.id]
  );

  return (
    <PropertiesContext.Provider
      value={{
        properties,
        loading,
        error,
        addProperty,
        updateProperty,
        deleteProperty,
        refetch: fetchProperties,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
}
