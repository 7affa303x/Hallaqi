/** Algerian seasonal context for AI + a simple user-facing calendar (#129, #195). */

export type SeasonId = 'ramadan' | 'eid' | 'back-to-school' | 'summer' | 'winter' | 'wedding';

export type SeasonHint = {
  id: SeasonId;
  ar: string;
  fr: string;
  en: string;
  tipAr: string;
  tipFr: string;
  tipEn: string;
  /** Rough months (1–12) when this season is most relevant in Algeria */
  months: number[];
};

export const ALGERIA_SEASONS: SeasonHint[] = [
  {
    id: 'ramadan',
    ar: 'رمضان',
    fr: 'Ramadan',
    en: 'Ramadan',
    tipAr: 'مواعيد مسائية أقصر؛ تجنّب قصّات معقّدة قبل الإفطار.',
    tipFr: 'Créneaux du soir plus courts ; évitez les coupes complexes avant l’iftar.',
    tipEn: 'Shorter evening slots; avoid complex cuts before iftar.',
    months: [2, 3, 4],
  },
  {
    id: 'eid',
    ar: 'العيد',
    fr: 'Aïd',
    en: 'Eid',
    tipAr: 'طلب مرتفع على الحلاقة قبل العيد — احجز مبكراً.',
    tipFr: 'Forte demande avant l’Aïd — réservez tôt.',
    tipEn: 'High demand before Eid — book early.',
    months: [3, 4, 5, 6],
  },
  {
    id: 'back-to-school',
    ar: 'الدخول المدرسي',
    fr: 'Rentrée scolaire',
    en: 'Back to school',
    tipAr: 'قصّات عملية للأطفال والطلاب في سبتمبر.',
    tipFr: 'Coupes pratiques pour enfants/étudiants en septembre.',
    tipEn: 'Practical cuts for kids/students in September.',
    months: [8, 9],
  },
  {
    id: 'summer',
    ar: 'الصيف',
    fr: 'Été',
    en: 'Summer',
    tipAr: 'حماية من الشمس وترطيب للشعر بعد البحر.',
    tipFr: 'Protection solaire et hydratation après la mer.',
    tipEn: 'Sun protection and hydration after the beach.',
    months: [6, 7, 8],
  },
  {
    id: 'winter',
    ar: 'الشتاء',
    fr: 'Hiver',
    en: 'Winter',
    tipAr: 'ترطيب أقوى للشعر والبشرة الجافة.',
    tipFr: 'Hydratation renforcée pour cheveux/peau secs.',
    tipEn: 'Stronger moisture for dry hair and skin.',
    months: [12, 1, 2],
  },
  {
    id: 'wedding',
    ar: 'موسم الأعراس',
    fr: 'Saison des mariages',
    en: 'Wedding season',
    tipAr: 'بكجات عريس وتسريحات مسبقة الحجز شائعة صيفاً.',
    tipFr: 'Packs marié et coiffures sur RDV fréquents en été.',
    tipEn: 'Groom packages and styled looks book early in summer.',
    months: [5, 6, 7, 8],
  },
];

export function currentSeasonHints(date = new Date()): SeasonHint[] {
  const m = date.getMonth() + 1;
  return ALGERIA_SEASONS.filter(s => s.months.includes(m));
}

export function seasonTip(hint: SeasonHint, lang: 'ar' | 'fr' | 'en'): string {
  return lang === 'fr' ? hint.tipFr : lang === 'en' ? hint.tipEn : hint.tipAr;
}

export function seasonLabel(hint: SeasonHint, lang: 'ar' | 'fr' | 'en'): string {
  return lang === 'fr' ? hint.fr : lang === 'en' ? hint.en : hint.ar;
}

/** Compact line for AI system/user context */
export function algeriaSeasonContextLine(lang: 'ar' | 'fr' | 'en' = 'ar'): string {
  const hints = currentSeasonHints();
  if (hints.length === 0) return '';
  const parts = hints.map(h => `${seasonLabel(h, lang)}: ${seasonTip(h, lang)}`);
  return lang === 'fr'
    ? `Contexte saisonnier Algérie: ${parts.join(' · ')}`
    : lang === 'en'
      ? `Algeria seasonal context: ${parts.join(' · ')}`
      : `سياق موسمي جزائري: ${parts.join(' · ')}`;
}
