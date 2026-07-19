/** Weekly product decisions board (#199) — transparent ops notes for the team/admins. */

export type WeeklyDecision = {
  week: string;
  ar: string;
  status: 'done' | 'doing' | 'next';
};

export const WEEKLY_DECISIONS: WeeklyDecision[] = [
  { week: '2026-W29', ar: 'إكمال اكتشاف الحلاقين (GPS + مفتوح الآن + مقارنة)', status: 'done' },
  { week: '2026-W29', ar: 'مسار نقدي أوضح + إيصال حضور للعميل', status: 'done' },
  { week: '2026-W30', ar: 'وضع بيانات منخفضة وتأجيل الخرائط', status: 'done' },
  { week: '2026-W30', ar: 'شهادات عملاء + خارطة طريق عامة + Mentions légales', status: 'doing' },
  { week: '2026-W30', ar: 'تنبيهات احتيال بسيطة للأدمن', status: 'doing' },
  { week: '2026-W31', ar: 'CCP/Baridi عند الجاهزية القانونية', status: 'next' },
  { week: '2026-W31', ar: 'اكتساب 10–20 حلاقاً حقيقياً في ولاية واحدة', status: 'next' },
];

export function currentWeekDecisions(now = new Date()): WeeklyDecision[] {
  const tmp = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  const key = `${tmp.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
  const current = WEEKLY_DECISIONS.filter(d => d.week === key);
  return current.length > 0 ? current : WEEKLY_DECISIONS.slice(-4);
}
