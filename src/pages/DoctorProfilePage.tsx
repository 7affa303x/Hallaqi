import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { getDoctorProfile } from '@/lib/marketplace';
import { BadgeCheck, ChevronLeft, Stethoscope } from 'lucide-react';

export default function DoctorProfilePage() {
  const { themeConfig, goBack, screenParams } = useApp();
  const doctorId = screenParams?.doctorId || '';
  const [doc, setDoc] = useState<{
    display_name: string;
    specialty: string;
    bio: string | null;
    consultation_content: string | null;
    trusted_badge: boolean;
    free_verification: boolean;
    verification_status: string;
    city: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!doctorId) return;
        const row = await getDoctorProfile(doctorId);
        if (!cancelled) setDoc(row as typeof doc);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [doctorId]);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: themeConfig.colors.background }}>
      <header className="sticky top-0 z-10 border-b px-4 py-3 flex items-center gap-3"
        style={{ borderColor: themeConfig.colors.border, backgroundColor: `${themeConfig.colors.surface}ee` }}>
        <button type="button" onClick={goBack} className="p-2 rounded-xl" style={{ backgroundColor: `${themeConfig.colors.primary}12` }}>
          <ChevronLeft size={18} style={{ color: themeConfig.colors.primary }} />
        </button>
        <h1 className="text-base font-black" style={{ color: themeConfig.colors.text }}>ملف الطبيب</h1>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {loading && <p style={{ color: themeConfig.colors.textMuted }}>جاري التحميل...</p>}
        {!loading && !doc && <p style={{ color: themeConfig.colors.error }}>الطبيب غير موجود أو بانتظار التحقق المجاني</p>}
        {doc && (
          <div className="rounded-3xl border p-4 space-y-3" style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.surface }}>
            <div className="flex items-center gap-2">
              <Stethoscope size={18} style={{ color: themeConfig.colors.primary }} />
              {doc.trusted_badge && <BadgeCheck size={16} style={{ color: themeConfig.colors.primary }} />}
              {doc.free_verification && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${themeConfig.colors.success}18`, color: themeConfig.colors.success }}>
                  تحقق مجاني
                </span>
              )}
            </div>
            <h2 className="text-lg font-black" style={{ color: themeConfig.colors.text }}>{doc.display_name}</h2>
            <p className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>
              التخصص: {doc.specialty === 'dermatologist' ? 'طب الجلد' : doc.specialty}
            </p>
            <p className="text-sm leading-7" style={{ color: themeConfig.colors.textMuted }}>{doc.bio || 'طبيب موثوق في منظومة Hallaqi.'}</p>
            <div className="rounded-2xl border p-3" style={{ borderColor: themeConfig.colors.border }}>
              <p className="text-xs font-bold mb-1" style={{ color: themeConfig.colors.text }}>محتوى استشاري</p>
              <p className="text-xs leading-6" style={{ color: themeConfig.colors.textMuted }}>
                {doc.consultation_content || 'محتوى الاستشارات وتوصيات الخدمات/المنتجات · قريبًا'}
              </p>
            </div>
            <p className="text-[11px]" style={{ color: themeConfig.colors.textMuted }}>
              نموذج الطبيب مستقل عن specialist، وقابل لتخصصات طبية إضافية لاحقًا دون تغيير البنية.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
