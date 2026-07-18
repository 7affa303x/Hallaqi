import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, Lightbulb } from 'lucide-react';
import { useApp } from '@/contexts/useApp';
import { translate } from '@/lib/i18n';
import {
  SUGGESTIONS_200_NOTE,
  SUGGESTIONS_200_SECTIONS,
  type SuggestionPriority,
} from '@/data/suggestions200';

const PRIORITY_META: Record<SuggestionPriority, { emoji: string; labelAr: string; labelEn: string; labelFr: string; colorKey: 'error' | 'warning' | 'success' }> = {
  critical: { emoji: '🔴', labelAr: 'حرج', labelEn: 'Critical', labelFr: 'Critique', colorKey: 'error' },
  important: { emoji: '🟡', labelAr: 'مهم', labelEn: 'Important', labelFr: 'Important', colorKey: 'warning' },
  nice: { emoji: '🟢', labelAr: 'تحسين', labelEn: 'Nice to have', labelFr: 'Amélioration', colorKey: 'success' },
};

function priorityLabel(priority: SuggestionPriority, language: 'ar' | 'fr' | 'en') {
  const meta = PRIORITY_META[priority];
  if (language === 'fr') return meta.labelFr;
  if (language === 'en') return meta.labelEn;
  return meta.labelAr;
}

export default function SuggestionsReportPage({ onBack }: { onBack: () => void }) {
  const { themeConfig, settings } = useApp();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SUGGESTIONS_200_SECTIONS.map((section, index) => [section.title, index === 0]))
  );

  const counts = useMemo(() => {
    const all = SUGGESTIONS_200_SECTIONS.flatMap(section => section.items);
    return {
      total: all.length,
      critical: all.filter(item => item.priority === 'critical').length,
      important: all.filter(item => item.priority === 'important').length,
      nice: all.filter(item => item.priority === 'nice').length,
    };
  }, []);

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const title =
    settings.language === 'en'
      ? '200 Development Suggestions'
      : settings.language === 'fr'
        ? '200 suggestions de développement'
        : 'تقرير 200 اقتراح تطوير';

  const intro =
    settings.language === 'en'
      ? 'Roadmap reference after i18n / country / currency (July 2026). Priority per section:'
      : settings.language === 'fr'
        ? 'Référence après i18n / pays / devise (juillet 2026). Priorité par section :'
        : 'مرجع بعد دفعة i18n / البلد / العملة (يوليو 2026). الأولوية داخل كل قسم:';

  return (
    <div className="pb-20">
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b"
        style={{ backgroundColor: themeConfig.colors.surface, borderColor: themeConfig.colors.border }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label={translate(settings.language, 'back')}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
        >
          <ArrowLeft size={20} style={{ color: themeConfig.colors.text }} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold truncate" style={{ color: themeConfig.colors.text }}>{title}</h2>
          <p className="text-[10px] truncate" style={{ color: themeConfig.colors.textMuted }}>Hallaqi · {counts.total} {settings.language === 'en' ? 'items' : settings.language === 'fr' ? 'éléments' : 'بنداً'}</p>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: themeConfig.colors.primary + '12' }}
        >
          <Lightbulb size={18} style={{ color: themeConfig.colors.primary }} />
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div
          className="rounded-2xl border p-4"
          style={{ backgroundColor: themeConfig.colors.surface, borderColor: themeConfig.colors.border }}
        >
          <p className="text-xs leading-relaxed" style={{ color: themeConfig.colors.textMuted }}>{intro}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {(['critical', 'important', 'nice'] as SuggestionPriority[]).map(priority => (
              <span
                key={priority}
                className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: themeConfig.colors[PRIORITY_META[priority].colorKey] + '15',
                  color: themeConfig.colors[PRIORITY_META[priority].colorKey],
                }}
              >
                {PRIORITY_META[priority].emoji} {priorityLabel(priority, settings.language)} · {counts[priority]}
              </span>
            ))}
          </div>
        </div>

        {SUGGESTIONS_200_SECTIONS.map(section => {
          const isOpen = openSections[section.title];
          return (
            <section
              key={section.title}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: themeConfig.colors.surface, borderColor: themeConfig.colors.border }}
            >
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-right"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>{section.title}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: themeConfig.colors.textMuted }}>
                    {section.items.length} {settings.language === 'en' ? 'suggestions' : settings.language === 'fr' ? 'suggestions' : 'اقتراحاً'}
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: themeConfig.colors.textMuted }}
                />
              </button>

              {isOpen && (
                <div className="border-t" style={{ borderColor: themeConfig.colors.border + '80' }}>
                  <ol className="divide-y" style={{ borderColor: themeConfig.colors.border + '60' }}>
                    {section.items.map(item => {
                      const meta = PRIORITY_META[item.priority];
                      return (
                        <li
                          key={item.number}
                          className="px-4 py-3 flex items-start gap-3"
                        >
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                            style={{
                              backgroundColor: themeConfig.colors[meta.colorKey] + '12',
                              color: themeConfig.colors[meta.colorKey],
                            }}
                          >
                            {item.number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-relaxed" style={{ color: themeConfig.colors.text }}>
                              <span aria-hidden="true" className="ml-1">{meta.emoji}</span> {item.text}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </section>
          );
        })}

        <p className="text-[10px] leading-relaxed text-center px-2" style={{ color: themeConfig.colors.textMuted }}>
          {SUGGESTIONS_200_NOTE}
        </p>
      </div>
    </div>
  );
}
