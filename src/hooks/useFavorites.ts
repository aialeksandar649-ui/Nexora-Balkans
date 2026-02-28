import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('nexora-favorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('nexora-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      }
      return [...prev, propertyId];
    });
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  return { favorites, toggleFavorite, isFavorite };
}
