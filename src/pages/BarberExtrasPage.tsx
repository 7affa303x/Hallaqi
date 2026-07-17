import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { useAuth } from '@/hooks/useAuth';
import { createBarberExtra, deleteBarberExtra, listBarberExtras } from '@/lib/marketplace';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'extra', label: 'خدمة إضافية' },
  { id: 'premium_treatment', label: 'علاج مميز' },
  { id: 'vip', label: 'VIP' },
  { id: 'beard_care', label: 'عناية لحية' },
  { id: 'skin_care', label: 'عناية بشرة' },
  { id: 'hair_treatment', label: 'علاج شعر' },
] as const;

export default function BarberExtrasPage() {
  const { themeConfig, goBack } = useApp();
  const { appUser } = useAuth();
  const [rows, setRows] = useState<Array<{
    id: string; name: string; description: string | null; category: string; price_dzd: number; duration_minutes: number | null;
  }>>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]['id']>('extra');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!appUser?.id) return;
    setRows(await listBarberExtras(appUser.id) as typeof rows);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (appUser?.id) await reload();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'تعذر التحميل');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appUser?.id]);

  const create = async () => {
    if (!appUser?.id || !name.trim()) return;
    setError('');
    try {
      await createBarberExtra({
        professionalId: appUser.id,
        name,
        description,
        category,
        priceDzd: Number(price) || 0,
        durationMinutes: duration ? Number(duration) : undefined,
      });
      setName('');
      setDescription('');
      setPrice('');
      setDuration('');
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر الإضافة');
    }
  };

  if (appUser?.user_role !== 'barber' && appUser?.user_role !== 'specialist') {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: themeConfig.colors.background }}>
        <button type="button" onClick={goBack}><ChevronLeft /></button>
        <p className="mt-4" style={{ color: themeConfig.colors.textMuted }}>خدمات إضافية للحلاقين فقط — ليست منتجات متجر.</p>
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
        <div>
          <h1 className="text-base font-black" style={{ color: themeConfig.colors.text }}>خدمات إضافية</h1>
          <p className="text-[11px]" style={{ color: themeConfig.colors.textMuted }}>VIP · علاجات · عناية — ليست منتجات مادية</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-3">
        <div className="rounded-2xl border p-3 space-y-2" style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.surface }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="اسم الخدمة"
            className="w-full h-10 rounded-xl border px-3 text-sm outline-none"
            style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.background, color: themeConfig.colors.text }} />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف" rows={2}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.background, color: themeConfig.colors.text }} />
          <select value={category} onChange={e => setCategory(e.target.value as typeof category)}
            className="w-full h-10 rounded-xl border px-2 text-xs"
            style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.background, color: themeConfig.colors.text }}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="السعر دج"
              className="h-10 rounded-xl border px-3 text-sm outline-none"
              style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.background, color: themeConfig.colors.text }} />
            <input value={duration} onChange={e => setDuration(e.target.value)} type="number" placeholder="المدة بالدقائق"
              className="h-10 rounded-xl border px-3 text-sm outline-none"
              style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.background, color: themeConfig.colors.text }} />
          </div>
          <button type="button" onClick={() => void create()} className="w-full h-11 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: themeConfig.colors.primary }}>
            <Plus size={16} /> إضافة خدمة إضافية
          </button>
        </div>

        {loading && <p className="text-sm" style={{ color: themeConfig.colors.textMuted }}>جاري التحميل...</p>}
        {error && <p className="text-sm" style={{ color: themeConfig.colors.error }}>{error}</p>}

        {rows.map(row => (
          <div key={row.id} className="rounded-2xl border p-3 flex items-start justify-between gap-2"
            style={{ borderColor: themeConfig.colors.border, backgroundColor: themeConfig.colors.surface }}>
            <div>
              <p className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>{row.name}</p>
              <p className="text-[11px]" style={{ color: themeConfig.colors.textMuted }}>
                {CATEGORIES.find(c => c.id === row.category)?.label || row.category} · {row.price_dzd} دج
                {row.duration_minutes ? ` · ${row.duration_minutes} د` : ''}
              </p>
            </div>
            <button type="button" onClick={() => void deleteBarberExtra(row.id).then(reload)}
              className="p-2 rounded-xl" style={{ backgroundColor: `${themeConfig.colors.error}14` }}>
              <Trash2 size={14} style={{ color: themeConfig.colors.error }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
