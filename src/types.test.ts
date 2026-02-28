import { describe, it, expect } from 'vitest';
import { rowToProperty, propertyToRow, type PropertyRow, type Property } from './types';

describe('rowToProperty', () => {
  it('maps snake_case row to camelCase property', () => {
    const row: PropertyRow = {
      id: 'p1',
      image_url: 'https://example.com/1.jpg',
      images: ['a', 'b'],
      location: 'Belgrade',
      lat: 44.8,
      lng: 20.5,
      title: 'Cozy Apartment',
      description: 'Nice place',
      price: 80,
      rating: 4.5,
      dates: null,
      guests: 2,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      amenities: ['WiFi'],
      category: ['City'],
      host: { name: 'Host', isSuperhost: false, hostingSince: '2020' },
      reviews: 10,
      check_in: null,
      check_out: null,
      user_id: null,
    };

    const p = rowToProperty(row);
    expect(p.id).toBe('p1');
    expect(p.imageUrl).toBe(row.image_url);
    expect(p.images).toEqual(['a', 'b']);
    expect(p.location).toBe('Belgrade');
    expect(p.lat).toBe(44.8);
    expect(p.lng).toBe(20.5);
    expect(p.title).toBe('Cozy Apartment');
    expect(p.price).toBe(80);
    expect(p.rating).toBe(4.5);
    expect(p.dates).toBe('');
    expect(p.host.name).toBe('Host');
    expect(p.host.isSuperhost).toBe(false);
  });

  it('handles missing host fields with defaults', () => {
    const row: PropertyRow = {
      id: 'p2',
      image_url: '',
      images: [],
      location: '',
      title: 'X',
      description: '',
      price: 0,
      rating: 0,
      dates: null,
      guests: 0,
      bedrooms: 0,
      beds: 0,
      bathrooms: 0,
      amenities: [],
      category: [],
      host: {},
      reviews: 0,
      check_in: null,
      check_out: null,
    };

    const p = rowToProperty(row);
    expect(p.host.name).toBe('Host');
    expect(p.host.isSuperhost).toBe(false);
    expect(p.host.hostingSince).toBe('');
  });
});

describe('propertyToRow', () => {
  it('maps property to row shape (without id)', () => {
    const prop: Property = {
      id: 'p1',
      imageUrl: 'https://x/1.jpg',
      images: ['a'],
      location: 'Zagreb',
      title: 'Studio',
      description: 'Desc',
      price: 60,
      rating: 5,
      dates: '',
      guests: 1,
      bedrooms: 0,
      beds: 1,
      bathrooms: 1,
      amenities: [],
      category: ['City'],
      host: { name: 'H', isSuperhost: false, hostingSince: '' },
      reviews: 0,
    };

    const row = propertyToRow(prop);
    expect(row.image_url).toBe(prop.imageUrl);
    expect(row.location).toBe('Zagreb');
    expect(row.price).toBe(60);
    expect('id' in row).toBe(false);
  });
});
