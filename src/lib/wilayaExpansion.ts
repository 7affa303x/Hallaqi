/** Staged Algerian wilaya expansion guide (#196). */

export type ExpansionTier = {
  phase: string;
  phaseFr: string;
  phaseEn: string;
  wilayas: string[];
  noteAr: string;
  noteFr: string;
  noteEn: string;
};

export const WILAYA_EXPANSION: ExpansionTier[] = [
  {
    phase: 'المرحلة 1 — إطلاق ناعم',
    phaseFr: 'Phase 1 — soft launch',
    phaseEn: 'Phase 1 — soft launch',
    wilayas: ['وهران', 'الجزائر', 'قسنطينة'],
    noteAr: 'تركيز على 10–20 حلاقاً حقيقياً في ولاية واحدة أولاً ثم المدن الكبرى.',
    noteFr: '10–20 coiffeurs réels d’abord, puis grandes villes.',
    noteEn: 'Start with 10–20 real barbers in one wilaya, then major cities.',
  },
  {
    phase: 'المرحلة 2 — الساحل والوسط',
    phaseFr: 'Phase 2 — littoral & centre',
    phaseEn: 'Phase 2 — coast & center',
    wilayas: ['البليدة', 'تيبازة', 'بجاية', 'عنابة', 'سطيف'],
    noteAr: 'توسيع بعد ثبات الحجوزات الأسبوعية في المرحلة 1.',
    noteFr: 'Expansion après rétention hebdo stable en phase 1.',
    noteEn: 'Expand once weekly retention is stable in phase 1.',
  },
  {
    phase: 'المرحلة 3 — الجنوب والهضاب',
    phaseFr: 'Phase 3 — sud & hauts plateaux',
    phaseEn: 'Phase 3 — south & high plateaus',
    wilayas: ['ورقلة', 'غرداية', 'بشار', 'الأغواط', 'تمنراست'],
    noteAr: 'يتطلب شبكة حلاقين محليين ودعم لوجستي أوضح.',
    noteFr: 'Nécessite un réseau local et un support plus clair.',
    noteEn: 'Needs local barber networks and clearer support.',
  },
];

export const BIG_CITY_FR_NUDGE = [
  'الجزائر', 'وهران', 'قسنطينة', 'عنابة', 'سطيف', 'بجاية',
] as const;

export function shouldNudgeFrench(wilaya?: string | null): boolean {
  if (!wilaya) return false;
  return (BIG_CITY_FR_NUDGE as readonly string[]).some(c => wilaya.includes(c) || c.includes(wilaya));
}
