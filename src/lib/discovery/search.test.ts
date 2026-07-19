import { describe, expect, it } from 'vitest';
import {
  findNearestWilaya,
  wilayaLabelsMatch,
  normalizeWilayaLabel,
  filterWilayasByQuery,
} from '@/lib/locale/algeriaWilayas';
import { barberMatchesQuery, normalizeSearchText, scoreBarberSearch } from '@/lib/discovery/search';
import type { Barber } from '@/types';

const sample = {
  id: '1',
  name: 'صالون سمير للحلاقة',
  wilaya: 'الجزائر العاصمة',
  location: 'باب الزوار',
  tags: ['verified', 'top-rated'],
  services: [{ id: 's1', name: 'قص شعر', price: 500, duration: 30, category: 'haircut' }],
} as Barber;

describe('algeriaWilayas', () => {
  it('matches Algiers aliases', () => {
    expect(wilayaLabelsMatch('الجزائر العاصمة', 'الجزائر')).toBe(true);
    expect(normalizeWilayaLabel('الجزائر العاصمة')).toContain('الجزائر');
  });

  it('finds nearest wilaya near Oran', () => {
    const w = findNearestWilaya({ lat: 35.7, lng: -0.65 });
    expect(w.nameAr).toBe('وهران');
  });

  it('filters wilayas by query', () => {
    expect(filterWilayasByQuery('وهر', 'ar').some(w => w.nameAr === 'وهران')).toBe(true);
    expect(filterWilayasByQuery('16', 'ar')[0]?.code).toBe(16);
  });
});

describe('discovery search', () => {
  it('normalizes Arabic hamza variants', () => {
    expect(normalizeSearchText('أحمد')).toBe(normalizeSearchText('احمد'));
  });

  it('scores and matches barber queries', () => {
    expect(barberMatchesQuery(sample, 'سمير')).toBe(true);
    expect(barberMatchesQuery(sample, 'قص')).toBe(true);
    expect(scoreBarberSearch(sample, 'سمير') > scoreBarberSearch(sample, 'xyz')).toBe(true);
  });
});
