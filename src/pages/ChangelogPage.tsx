import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/useApp';
import { translate } from '@/lib/i18n';

const ENTRIES = [
  {
    version: '12.1.0',
    date: 'يوليو 2026',
    bullets: [
      'لغة · بلد · عملة مع مزامنة الحساب',
      'اكتشاف: مفتوح الآن، أقرب موعد، مقارنة، زرتهم مؤخراً',
      'إعادة جدولة ومسودة حجز',
      'صفحة /status وإصلاح راية التحليلات',
    ],
  },
];

export default function ChangelogPage({ onBack }: { onBack?: () => void }) {
  const { themeConfig, settings, goBack } = useApp();
  const back = onBack || goBack;
  return (
    <div className="pb-20 min-h-screen" style={{ backgroundColor: themeConfig.colors.background }}>
      <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b" style={{ backgroundColor: themeConfig.colors.surface, borderColor: themeConfig.colors.border }}>
        <button type="button" onClick={back} aria-label={translate(settings.language, 'back')} className="w-9 h-9 rounded-xl flex items-center justify-center">
          <ArrowLeft size={20} style={{ color: themeConfig.colors.text }} />
        </button>
        <h1 className="text-base font-bold" style={{ color: themeConfig.colors.text }}>
          {settings.language === 'en' ? 'Changelog' : settings.language === 'fr' ? 'Journal des changements' : 'سجل التغييرات'}
        </h1>
      </div>
      <div className="p-4 space-y-4">
        {ENTRIES.map(entry => (
          <section key={entry.version} className="rounded-2xl border p-4" style={{ backgroundColor: themeConfig.colors.surface, borderColor: themeConfig.colors.border }}>
            <p className="text-sm font-black" style={{ color: themeConfig.colors.text }}>v{entry.version}</p>
            <p className="text-[10px] mt-0.5" style={{ color: themeConfig.colors.textMuted }}>{entry.date}</p>
            <ul className="mt-3 space-y-1.5">
              {entry.bullets.map(b => (
                <li key={b} className="text-xs leading-relaxed" style={{ color: themeConfig.colors.textMuted }}>• {b}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
