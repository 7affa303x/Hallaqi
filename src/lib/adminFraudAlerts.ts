/** Simple admin fraud / anomaly heuristics (#146). Client-side signals only. */

export type FraudAlert = {
  id: string;
  severity: 'warn' | 'info';
  titleAr: string;
  detailAr: string;
};

export type FraudPaymentInput = {
  id: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
};

export type FraudBookingInput = {
  id: string;
  total_price: number;
  status: string;
  client_name?: string;
};

/** Flag test prices, extreme amounts, and Stripe during cash-first soft launch. */
export function buildFraudAlerts(
  payments: FraudPaymentInput[],
  bookings: FraudBookingInput[],
): FraudAlert[] {
  const alerts: FraudAlert[] = [];

  for (const p of payments) {
    if (p.amount > 0 && p.amount < 100) {
      alerts.push({
        id: `pay-test-${p.id}`,
        severity: 'warn',
        titleAr: 'مبلغ دفع يشبه سعر اختبار',
        detailAr: `${p.amount} د.ج عبر ${p.method} · ${p.status}`,
      });
    }
    if (p.amount >= 200_000) {
      alerts.push({
        id: `pay-high-${p.id}`,
        severity: 'warn',
        titleAr: 'مبلغ دفع مرتفع جداً',
        detailAr: `${p.amount.toLocaleString('ar-DZ')} د.ج · ${p.method}`,
      });
    }
    if (p.method === 'stripe' && p.status !== 'failed') {
      alerts.push({
        id: `pay-stripe-${p.id}`,
        severity: 'info',
        titleAr: 'دفعة Stripe أثناء الإطلاق الناعم',
        detailAr: `راجع إن كانت مقصودة · ${p.amount} د.ج`,
      });
    }
    if (p.status === 'failed') {
      alerts.push({
        id: `pay-fail-${p.id}`,
        severity: 'info',
        titleAr: 'فشل دفع حديث',
        detailAr: `${p.amount} د.ج · ${p.method}`,
      });
    }
  }

  for (const b of bookings) {
    if (b.total_price > 0 && b.total_price < 100) {
      alerts.push({
        id: `book-test-${b.id}`,
        severity: 'warn',
        titleAr: 'حجز بسعر اختبار محتمل',
        detailAr: `${b.client_name || 'عميل'} · ${b.total_price} د.ج · ${b.status}`,
      });
    }
  }

  return alerts.slice(0, 12);
}
