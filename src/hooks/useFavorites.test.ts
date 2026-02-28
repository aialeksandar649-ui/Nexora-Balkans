import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from './useFavorites';

const STORAGE_KEY = 'nexora-favorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it('restores favorites from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['id1', 'id2']));
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual(['id1', 'id2']);
  });

  it('toggleFavorite adds id when not in list', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggleFavorite('prop-1');
    });
    expect(result.current.favorites).toEqual(['prop-1']);
    expect(result.current.isFavorite('prop-1')).toBe(true);
  });

  it('toggleFavorite removes id when already in list', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['prop-1']));
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggleFavorite('prop-1');
    });
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite('prop-1')).toBe(false);
  });

  it('persists to localStorage on toggle', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggleFavorite('prop-1');
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(['prop-1']);
  });
});
