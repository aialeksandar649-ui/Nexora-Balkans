import { useState, useEffect } from 'react';
import { Property } from '../types';

export function useRecentViews() {
  const [recentViews, setRecentViews] = useState<Property[]>(() => {
    const stored = localStorage.getItem('nexora-recent-views');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('nexora-recent-views', JSON.stringify(recentViews));
  }, [recentViews]);

  const addRecentView = (property: Property) => {
    setRecentViews(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p.title !== property.title && p.location !== property.location);
      // Add to beginning and limit to 10
      return [property, ...filtered].slice(0, 10);
    });
  };

  const clearRecentViews = () => {
    setRecentViews([]);
  };

  return { recentViews, addRecentView, clearRecentViews };
}
