/** 58 Algerian wilayas with approximate admin centers for GPS → wilaya (#26–31). */

export type AlgeriaWilaya = {
  code: number;
  nameAr: string;
  nameFr: string;
  /** Approximate wilaya capital coordinates */
  lat: number;
  lng: number;
  /** Alternate Arabic spellings for matching barber.city / wilaya strings */
  aliases?: string[];
};

export const ALGERIA_WILAYAS: AlgeriaWilaya[] = [
  { code: 1, nameAr: 'أدرار', nameFr: 'Adrar', lat: 27.87, lng: -0.29 },
  { code: 2, nameAr: 'الشلف', nameFr: 'Chlef', lat: 36.17, lng: 1.33 },
  { code: 3, nameAr: 'الأغواط', nameFr: 'Laghouat', lat: 33.8, lng: 2.88 },
  { code: 4, nameAr: 'أم البواقي', nameFr: 'Oum El Bouaghi', lat: 35.88, lng: 7.11 },
  { code: 5, nameAr: 'باتنة', nameFr: 'Batna', lat: 35.56, lng: 6.17 },
  { code: 6, nameAr: 'بجاية', nameFr: 'Béjaïa', lat: 36.75, lng: 5.08 },
  { code: 7, nameAr: 'بسكرة', nameFr: 'Biskra', lat: 34.85, lng: 5.73 },
  { code: 8, nameAr: 'بشار', nameFr: 'Béchar', lat: 31.62, lng: -2.22 },
  { code: 9, nameAr: 'البليدة', nameFr: 'Blida', lat: 36.47, lng: 2.83 },
  { code: 10, nameAr: 'البويرة', nameFr: 'Bouira', lat: 36.38, lng: 3.9 },
  { code: 11, nameAr: 'تمنراست', nameFr: 'Tamanrasset', lat: 22.79, lng: 5.52 },
  { code: 12, nameAr: 'تبسة', nameFr: 'Tébessa', lat: 35.4, lng: 8.12 },
  { code: 13, nameAr: 'تلمسان', nameFr: 'Tlemcen', lat: 34.88, lng: -1.32 },
  { code: 14, nameAr: 'تيارت', nameFr: 'Tiaret', lat: 35.37, lng: 1.32 },
  { code: 15, nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou', lat: 36.72, lng: 4.05 },
  {
    code: 16,
    nameAr: 'الجزائر',
    nameFr: 'Alger',
    lat: 36.75,
    lng: 3.06,
    aliases: ['الجزائر العاصمة', 'العاصمة', 'Algiers', 'Alger'],
  },
  { code: 17, nameAr: 'الجلفة', nameFr: 'Djelfa', lat: 34.67, lng: 3.25 },
  { code: 18, nameAr: 'جيجل', nameFr: 'Jijel', lat: 36.82, lng: 5.77 },
  { code: 19, nameAr: 'سطيف', nameFr: 'Sétif', lat: 36.19, lng: 5.41 },
  { code: 20, nameAr: 'سعيدة', nameFr: 'Saïda', lat: 34.83, lng: 0.15 },
  { code: 21, nameAr: 'سكيكدة', nameFr: 'Skikda', lat: 36.88, lng: 6.91 },
  { code: 22, nameAr: 'سيدي بلعباس', nameFr: 'Sidi Bel Abbès', lat: 35.19, lng: -0.63 },
  { code: 23, nameAr: 'عنابة', nameFr: 'Annaba', lat: 36.9, lng: 7.77 },
  { code: 24, nameAr: 'قالمة', nameFr: 'Guelma', lat: 36.46, lng: 7.43 },
  { code: 25, nameAr: 'قسنطينة', nameFr: 'Constantine', lat: 36.37, lng: 6.61 },
  { code: 26, nameAr: 'المدية', nameFr: 'Médéa', lat: 36.27, lng: 2.75 },
  { code: 27, nameAr: 'مستغانم', nameFr: 'Mostaganem', lat: 35.93, lng: 0.09 },
  { code: 28, nameAr: 'المسيلة', nameFr: 'MSila', lat: 35.71, lng: 4.54 },
  { code: 29, nameAr: 'معسكر', nameFr: 'Mascara', lat: 35.4, lng: 0.14 },
  { code: 30, nameAr: 'ورقلة', nameFr: 'Ouargla', lat: 31.95, lng: 5.33 },
  { code: 31, nameAr: 'وهران', nameFr: 'Oran', lat: 35.7, lng: -0.64 },
  { code: 32, nameAr: 'البيض', nameFr: 'El Bayadh', lat: 33.68, lng: 1.02 },
  { code: 33, nameAr: 'إليزي', nameFr: 'Illizi', lat: 26.48, lng: 8.47 },
  { code: 34, nameAr: 'برج بوعريريج', nameFr: 'Bordj Bou Arréridj', lat: 36.07, lng: 4.76 },
  { code: 35, nameAr: 'بومرداس', nameFr: 'Boumerdès', lat: 36.77, lng: 3.47 },
  { code: 36, nameAr: 'الطارف', nameFr: 'El Tarf', lat: 36.77, lng: 8.31 },
  { code: 37, nameAr: 'تندوف', nameFr: 'Tindouf', lat: 27.67, lng: -8.15 },
  { code: 38, nameAr: 'تيسمسيلت', nameFr: 'Tissemsilt', lat: 35.61, lng: 1.81 },
  { code: 39, nameAr: 'الوادي', nameFr: 'El Oued', lat: 33.37, lng: 6.87 },
  { code: 40, nameAr: 'خنشلة', nameFr: 'Khenchela', lat: 35.43, lng: 7.14 },
  { code: 41, nameAr: 'سوق أهراس', nameFr: 'Souk Ahras', lat: 36.29, lng: 7.95 },
  { code: 42, nameAr: 'تيبازة', nameFr: 'Tipaza', lat: 36.59, lng: 2.45 },
  { code: 43, nameAr: 'ميلة', nameFr: 'Mila', lat: 36.45, lng: 6.26 },
  { code: 44, nameAr: 'عين الدفلى', nameFr: 'Aïn Defla', lat: 36.26, lng: 1.97 },
  { code: 45, nameAr: 'النعامة', nameFr: 'Naâma', lat: 33.27, lng: -0.31 },
  { code: 46, nameAr: 'عين تموشنت', nameFr: 'Aïn Témouchent', lat: 35.3, lng: -1.14 },
  { code: 47, nameAr: 'غرداية', nameFr: 'Ghardaïa', lat: 32.49, lng: 3.67 },
  { code: 48, nameAr: 'غليزان', nameFr: 'Relizane', lat: 35.74, lng: 0.56 },
  { code: 49, nameAr: 'تيميمون', nameFr: 'Timimoun', lat: 29.26, lng: 0.23 },
  { code: 50, nameAr: 'برج باجي مختار', nameFr: 'Bordj Badji Mokhtar', lat: 21.33, lng: 0.95 },
  { code: 51, nameAr: 'أولاد جلال', nameFr: 'Ouled Djellal', lat: 34.42, lng: 5.07 },
  { code: 52, nameAr: 'بني عباس', nameFr: 'Béni Abbès', lat: 30.13, lng: -2.17 },
  { code: 53, nameAr: 'عين صالح', nameFr: 'In Salah', lat: 27.19, lng: 2.48 },
  { code: 54, nameAr: 'عين قزام', nameFr: 'In Guezzam', lat: 19.57, lng: 5.77 },
  { code: 55, nameAr: 'تقرت', nameFr: 'Touggourt', lat: 33.1, lng: 6.06 },
  { code: 56, nameAr: 'جانت', nameFr: 'Djanet', lat: 24.55, lng: 9.48 },
  { code: 57, nameAr: 'المغير', nameFr: 'El M\'Ghair', lat: 33.95, lng: 5.92 },
  { code: 58, nameAr: 'المنيعة', nameFr: 'El Meniaa', lat: 30.58, lng: 2.88 },
];

/** Countries shown in discovery geo picker (Algeria-first soft launch). */
export const DISCOVERY_COUNTRIES = [
  { code: 'DZ', nameAr: 'الجزائر', nameFr: 'Algérie', nameEn: 'Algeria', hasWilayas: true },
  { code: 'TN', nameAr: 'تونس', nameFr: 'Tunisie', nameEn: 'Tunisia', hasWilayas: false },
  { code: 'MA', nameAr: 'المغرب', nameFr: 'Maroc', nameEn: 'Morocco', hasWilayas: false },
  { code: 'LY', nameAr: 'ليبيا', nameFr: 'Libye', nameEn: 'Libya', hasWilayas: false },
] as const;

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const radians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2
    + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function distanceInKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  return haversineKm(from, to);
}

/** Normalize Arabic wilaya strings for fuzzy equality. */
export function normalizeWilayaLabel(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/الجزائر\s*العاصمة/g, 'الجزائر')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/\s+/g, ' ');
}

export function wilayaLabelsMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  const na = normalizeWilayaLabel(a);
  const nb = normalizeWilayaLabel(b);
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  const wa = ALGERIA_WILAYAS.find(w =>
    normalizeWilayaLabel(w.nameAr) === na
    || normalizeWilayaLabel(w.nameFr) === na
    || w.aliases?.some(alias => normalizeWilayaLabel(alias) === na),
  );
  const wb = ALGERIA_WILAYAS.find(w =>
    normalizeWilayaLabel(w.nameAr) === nb
    || normalizeWilayaLabel(w.nameFr) === nb
    || w.aliases?.some(alias => normalizeWilayaLabel(alias) === nb),
  );
  return Boolean(wa && wb && wa.code === wb.code);
}

export function findNearestWilaya(coords: { lat: number; lng: number }): AlgeriaWilaya {
  let best = ALGERIA_WILAYAS[15]; // Algiers fallback
  let bestDist = Number.POSITIVE_INFINITY;
  for (const w of ALGERIA_WILAYAS) {
    const d = haversineKm(coords, { lat: w.lat, lng: w.lng });
    if (d < bestDist) {
      bestDist = d;
      best = w;
    }
  }
  return best;
}

export function wilayaLabel(w: AlgeriaWilaya, lang: 'ar' | 'fr' | 'en'): string {
  if (lang === 'fr' || lang === 'en') return w.nameFr;
  return w.nameAr;
}

export function filterWilayasByQuery(query: string, lang: 'ar' | 'fr' | 'en'): AlgeriaWilaya[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALGERIA_WILAYAS;
  return ALGERIA_WILAYAS.filter(w => {
    const label = wilayaLabel(w, lang).toLowerCase();
    return (
      label.includes(q)
      || w.nameAr.includes(query.trim())
      || w.nameFr.toLowerCase().includes(q)
      || String(w.code) === q
      || w.aliases?.some(a => a.toLowerCase().includes(q) || a.includes(query.trim()))
    );
  });
}
