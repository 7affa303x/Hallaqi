import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { useAuth } from '@/hooks/useAuth';
import { supabase, isSupabaseConfigured } from '@/supabase/client';
import { ALGERIA_WILAYAS } from '@/lib/marketplace';
import { ChevronLeft, Save } from 'lucide-react';

/** Edit store/company discovery profile (website CTA, cover, about). */
export default function BusinessProfileEditPage() {
  const { themeConfig, goBack } = useApp();
  const { appUser } = useAuth();
  const isCompany = appUser?.user_role === 'company';
  const table = isCompany ? 'companies' : 'stores';
  const nameKey = isCompany ? 'company_name' : 'store_name';

  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [about, setAbout] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [city, setCity] = useState('');
  const [wilayaCode, setWilayaCode] = useState<number | ''>('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!appUser?.id || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    if (appUser.user_role !== 'store' && appUser.user_role !== 'company') {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error: err } = await supabase.from(table).select('*').eq('id', appUser.id).maybeSingle();
      if (cancelled) return;
      if (err) setError(err.message);
      if (data) {
        const row = data as Record<string, unknown>;
        setName(String(row[nameKey] || ''));
        setShortDescription(String(row.short_description || ''));
        setAbout(String(row.about || ''));
        setWebsiteUrl(String(row.website_url || ''));
        setLogoUrl(String(row.logo_url || ''));
        setCoverUrl(String(row.cover_url || ''));
        setCity(String(row.city || ''));
        setWilayaCode(typeof row.wilaya_code === 'number' ? row.wilaya_code : '');
        if (!isCompany) setContactPhone(String(row.contact_phone || ''));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [appUser?.id, appUser?.user_role, isCompany, nameKey, table]);

  const save = async () => {
    if (!appUser?.id) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      if (!websiteUrl.trim()) {
        setError('رابط الموقع مطلوب لتفعيل زر زيارة المتجر (Visit Store)');
        return;
      }
      const wilayaValue = wilayaCode === '' ? null : wilayaCode;
      if (isCompany) {
        const { error: err } = await supabase.from('companies').update({
          company_name: name.trim(),
          short_description: shortDescription.trim() || null,
          about: about.trim() || null,
          website_url: websiteUrl.trim(),
          logo_url: logoUrl.trim() || null,
          cover_url: coverUrl.trim() || null,
          city: city.trim() || null,
          wilaya_code: wilayaValue,
          updated_at: new Date().toISOString(),
        }).eq('id', appUser.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('stores').update({
          store_name: name.trim(),
          short_description: shortDescription.trim() || null,
          about: about.trim() || null,
          website_url: websiteUrl.trim(),
          logo_url: logoUrl.trim() || null,
          cover_url: coverUrl.trim() || null,
          city: city.trim() || null,
          wilaya_code: wilayaValue,
          contact_phone: contactPhone.trim() || null,
          updated_at: new Date().toISOString(),
        }).eq('id', appUser.id);
        if (err) throw err;
      }
      setMessage('تم الحفظ — CTA زيارة المتجر يعتمد على رابط الموقع');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (appUser?.user_role !== 'store' && appUser?.user_role !== 'company') {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: themeConfig.colors.background }}>
        <button type="button" onClick={goBack}><ChevronLeft /></button>
        <p className="mt-4" style={{ color: themeConfig.colors.textMuted }}>لمتاجر والشركات فقط</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: themeConfig.colors.background }}>
      <header className="sticky top-0 z-10 border-b px-4 py-3 flex items-center gap-3"
        style={{ borderColor: themeConfig.colors.border, backgroundColor: `${themeConfig.colors.surface}ee` }}>
        <button type="button" onClick={goBack} className="p-2 rounded-xl" style={{ backgroundColor: `${themeConfig.colors.primary}12` }}>
          <ChevronLeft size={18} style={{ color: themeConfig.colors.primary }} />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-black" style={{ color: themeConfig.colors.text }}>ملف {isCompany ? 'الشركة' : 'المتجر'}</h1>
          <p className="text-[11px]" style={{ color: themeConfig.colors.textMuted }}>اكتشاف فقط — الدفع خارج Hallaqi</p>
        </div>
        <button type="button" disabled={saving || loading} onClick={() => void save()}
          className="px-3 h-9 rounded-xl text-xs font-bold text-white flex items-center gap-1 disabled:opacity-50"
          style={{ backgroundColor: themeConfig.colors.primary }}>
          <Save size={14} /> حفظ
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-3">
        {loading && <p style={{ color: themeConfig.colors.textMuted }}>جاري التحميل...</p>}
        {error && <p style={{ color: themeConfig.colors.error }}>{error}</p>}
        {message && <p style={{ color: themeConfig.colors.success }}>{message}</p>}

        {[
          { label: 'الاسم', value: name, set: setName },
          { label: 'وصف قصير', value: shortDescription, set: setShortDescription },
          { label: 'الموقع (Visit Store) *', value: websiteUrl, set: setWebsiteUrl },
          { label: 'شعار (URL)', value: logoUrl, set: setLogoUrl },
          { label: 'غلاف (URL)', value: coverUrl, set: setCoverUrl },
          { label: 'المدينة', value: city, set: setCity },
        ].map(field => (
          <label key={field.label} className="block space-y-1">
            <span className="text-[11px] font-bold" style={{ color: themeConfig.colors.textMuted }}>{field.label}</span>
            <input value={field.value} onChange={e => field.set(e.target.value)}
              className="w-full h-11 rounded-xl border px-3 text-sm outline-none"
              style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.surface, color: themeConfig.colors.text }} />
          </label>
        ))}

        <p className="text-[11px] leading-5 -mt-1" style={{ color: themeConfig.colors.textMuted }}>
          زر Visit Store يظهر للزوار فقط عند وجود رابط موقع صالح.
        </p>

        <label className="block space-y-1">
          <span className="text-[11px] font-bold" style={{ color: themeConfig.colors.textMuted }}>الولاية</span>
          <select
            value={wilayaCode === '' ? '' : String(wilayaCode)}
            onChange={e => setWilayaCode(e.target.value ? Number(e.target.value) : '')}
            className="w-full h-11 rounded-xl border px-3 text-sm outline-none"
            style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.surface, color: themeConfig.colors.text }}
          >
            <option value="">اختر الولاية</option>
            {ALGERIA_WILAYAS.map(w => (
              <option key={w.code} value={w.code}>{w.nameAr}</option>
            ))}
          </select>
        </label>

        {!isCompany && (
          <label className="block space-y-1">
            <span className="text-[11px] font-bold" style={{ color: themeConfig.colors.textMuted }}>هاتف التواصل</span>
            <input value={contactPhone} onChange={e => setContactPhone(e.target.value)}
              className="w-full h-11 rounded-xl border px-3 text-sm outline-none"
              style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.surface, color: themeConfig.colors.text }} />
          </label>
        )}

        <label className="block space-y-1">
          <span className="text-[11px] font-bold" style={{ color: themeConfig.colors.textMuted }}>نبذة / About</span>
          <textarea value={about} onChange={e => setAbout(e.target.value)} rows={4}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.surface, color: themeConfig.colors.text }} />
        </label>
      </div>
    </div>
  );
}
