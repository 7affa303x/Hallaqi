import { useEffect, useState } from 'react';
import { ArrowLeft, Megaphone, Crown, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useApp } from '@/contexts/useApp';
import { useAuth } from '@/hooks/useAuth';
import {
  getSellerProducts,
  listPlacementRequests,
  requestMarketplacePlacement,
} from '@/supabase/marketplace';
import { FEATURE_FLAGS, PAUSED_LABEL } from '@/lib/featureFlags';
import type { SellerPlacementRequest } from '@/lib/marketplace/sellerInventory';
import type { MarketplacePlacementType, MarketplaceProduct } from '@/types/marketplace';

const OPTIONS: { type: MarketplacePlacementType; label: string; hint: string; icon: typeof Crown }[] = [
  { type: 'featured_product', label: 'منتج مميز', hint: 'ظهور أعلى في نتائج السوق', icon: Crown },
  { type: 'featured_store', label: 'متجر مميز', hint: 'بطاقة متجر مميزة في الاكتشاف', icon: Megaphone },
  { type: 'product_of_the_day', label: 'منتج اليوم', hint: 'موضع إعلاني مدفوع — ليس خصماً عشوائياً', icon: Sparkles },
  { type: 'banner', label: 'بانر', hint: 'شريط إعلاني في أعلى السوق', icon: ImageIcon },
  { type: 'sponsored', label: 'ظهور مدعوم', hint: 'Sponsored visibility', icon: Megaphone },
  { type: 'premium_badge', label: 'شارة بريميوم', hint: 'تمييز بصري + أولوية ترتيب', icon: Crown },
];

export default function SellerPlacementsPage() {
  const { themeConfig, goBack, screenParams } = useApp();
  const { appUser } = useAuth();
  const sellerId = appUser?.id || screenParams?.sellerId || `demo-${screenParams?.role || 'store'}`;
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [requests, setRequests] = useState<SellerPlacementRequest[]>([]);
  const [type, setType] = useState<MarketplacePlacementType>('featured_product');
  const [productId, setProductId] = useState('');
  const [bid, setBid] = useState(5000);
  const [toast, setToast] = useState('');

  useEffect(() => {
    void getSellerProducts(sellerId).then(setProducts);
    void listPlacementRequests(sellerId).then(setRequests);
  }, [sellerId]);

  const submit = async () => {
    if (!FEATURE_FLAGS.paidPlacementsEnabled) {
      setToast(`طلب المواضع المدفوعة ${PAUSED_LABEL} عند الإطلاق`);
      return;
    }
    const needsProduct = type === 'featured_product' || type === 'product_of_the_day' || type === 'premium_badge' || type === 'sponsored';
    if (needsProduct && !productId) {
      setToast('اختر منتجاً لهذا الموضع');
      return;
    }
    await requestMarketplacePlacement({
      sellerId,
      placementType: type,
      productId: productId || undefined,
      bidAmountDzd: bid,
      title: OPTIONS.find(o => o.type === type)?.label || type,
    });
    setToast('تم إرسال طلب الموضع للأدمن — بدون عمولة على المبيعات');
    setRequests(await listPlacementRequests(sellerId));
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-4" style={{ backgroundColor: themeConfig.colors.background }}>
      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={goBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: themeConfig.colors.surface }} aria-label="رجوع">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-black" style={{ color: themeConfig.colors.text }}>مواضع الإعلان</h1>
        {!FEATURE_FLAGS.paidPlacementsEnabled && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">{PAUSED_LABEL}</span>
        )}
      </div>

      <p className="text-xs mb-3" style={{ color: themeConfig.colors.textMuted }}>
        محرك التسييل: اشتراكات + مواضع مدفوعة. لا عمولات ولا دفع منتجات داخل التطبيق.
      </p>
      {!FEATURE_FLAGS.paidPlacementsEnabled && (
        <p className="text-[11px] mb-3 leading-5 p-3 rounded-xl" style={{ backgroundColor: `${themeConfig.colors.warning}12`, color: themeConfig.colors.warning }}>
          طلب المواضع المدفوعة <strong>متوقف</strong> عند الإطلاق الناعم. يمكنك تجهيز منتجاتك الآن.
        </p>
      )}

      <div className="space-y-2 mb-4">
        {OPTIONS.map(opt => {
          const Icon = opt.icon;
          const active = type === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => setType(opt.type)}
              className="w-full rounded-2xl border p-3 text-right"
              style={{
                backgroundColor: active ? `${themeConfig.colors.primary}12` : themeConfig.colors.surface,
                borderColor: active ? themeConfig.colors.primary : themeConfig.colors.border,
              }}
            >
              <p className="text-sm font-black flex items-center gap-1" style={{ color: themeConfig.colors.text }}>
                <Icon size={14} /> {opt.label}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: themeConfig.colors.textMuted }}>{opt.hint}</p>
            </button>
          );
        })}
      </div>

      {products.length > 0 && (
        <label className="block mb-3 text-xs">
          <span style={{ color: themeConfig.colors.textMuted }}>المنتج (إن لزم)</span>
          <select
            className="w-full mt-1 rounded-xl p-2.5"
            value={productId}
            onChange={e => setProductId(e.target.value)}
            style={{ backgroundColor: themeConfig.colors.surface, color: themeConfig.colors.text, border: `1px solid ${themeConfig.colors.border}` }}
          >
            <option value="">—</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </label>
      )}

      <label className="block mb-3 text-xs">
        <span style={{ color: themeConfig.colors.textMuted }}>عرض الموضع (دج)</span>
        <input
          type="number"
          className="w-full mt-1 rounded-xl p-2.5"
          value={bid}
          onChange={e => setBid(Number(e.target.value))}
          style={{ backgroundColor: themeConfig.colors.surface, color: themeConfig.colors.text, border: `1px solid ${themeConfig.colors.border}` }}
        />
      </label>

      <button
        type="button"
        disabled={!FEATURE_FLAGS.paidPlacementsEnabled}
        onClick={() => void submit()}
        className="w-full py-3 rounded-2xl text-sm font-black text-white disabled:opacity-50"
        style={{ backgroundColor: themeConfig.colors.primary }}
      >
        {FEATURE_FLAGS.paidPlacementsEnabled ? 'طلب الموضع' : `طلب الموضع (${PAUSED_LABEL})`}
      </button>
      {toast && <p className="text-xs text-center mt-2 font-bold" style={{ color: themeConfig.colors.success }}>{toast}</p>}

      <h2 className="text-sm font-black mt-6 mb-2" style={{ color: themeConfig.colors.text }}>طلباتي</h2>
      <div className="space-y-2">
        {requests.length === 0 && <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>لا طلبات بعد</p>}
        {requests.map(r => (
          <div key={r.id} className="rounded-xl border p-3 text-xs"
            style={{ backgroundColor: themeConfig.colors.surface, borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}>
            <p className="font-bold">{r.title}</p>
            <p style={{ color: themeConfig.colors.textMuted }}>
              {r.placementType} · {r.bidAmountDzd.toLocaleString('ar-DZ')} دج · {r.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
