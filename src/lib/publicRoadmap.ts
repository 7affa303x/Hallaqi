/** Public product roadmap items (#200) — transparent to users. */

export type RoadmapItem = {
  id: string;
  status: 'shipped' | 'soon' | 'later';
  ar: string;
  fr: string;
  en: string;
};

export const PUBLIC_ROADMAP: RoadmapItem[] = [
  { id: 'cash', status: 'shipped', ar: 'حجز نقدي عند الزيارة', fr: 'Réservation cash à la visite', en: 'Cash pay-at-visit booking' },
  { id: 'i18n', status: 'shipped', ar: 'عربية / فرنسية / إنجليزية', fr: 'AR / FR / EN', en: 'Arabic / French / English' },
  { id: 'discovery', status: 'shipped', ar: 'اكتشاف أذكى ومقارنة حلاقين', fr: 'Découverte + comparaison', en: 'Smarter discovery + compare' },
  { id: 'ai', status: 'shipped', ar: 'مساعد عناية (بدون تشخيص طبي)', fr: 'Assistant soins (pas de diagnostic)', en: 'Grooming AI (no medical diagnosis)' },
  { id: 'ccp', status: 'soon', ar: 'CCP / بريدي موب عند الجاهزية القانونية', fr: 'CCP / Baridi Mob (légal)', en: 'CCP / Baridi Mob when legal-ready' },
  { id: 'sms', status: 'soon', ar: 'تأكيد SMS عند القبول', fr: 'SMS à l’acceptation', en: 'SMS on accept' },
  { id: 'ssr', status: 'later', ar: 'صفحات حلاق/منتج أسرع (SSR)', fr: 'Pages plus rapides (SSR)', en: 'Faster barber/product pages (SSR)' },
  { id: 'guest', status: 'later', ar: 'حجز ضيف بدون حساب', fr: 'Réservation invité', en: 'Guest booking' },
];
