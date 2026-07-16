/**
 * PaymentApproval Component
 * 
 * Allows barbers/admins to view receipt and approve or reject CCP/BaridiMob payments.
 */
import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Loader2, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/useApp';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentRejectSchema } from '@/lib/validation';
import type { PaymentRejectFormData } from '@/lib/validation';

interface PaymentApprovalProps {
  paymentId: string;
  receiptUrl?: string;
  amount: number;
  currency: string;
  transactionReference?: string;
  status: string;
  onApprove: (paymentId: string) => Promise<boolean>;
  onReject: (paymentId: string, reason?: string) => Promise<boolean>;
  isProcessing: boolean;
}

export function PaymentApproval({
  paymentId,
  receiptUrl,
  amount,
  currency,
  transactionReference,
  status,
  onApprove,
  onReject,
  isProcessing,
}: PaymentApprovalProps) {
  const { themeConfig } = useApp();
  const [showReceipt, setShowReceipt] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit: handleRejectSubmit,
    reset: resetRejectForm,
    formState: { isSubmitting: isRejecting },
  } = useForm<PaymentRejectFormData>({
    resolver: zodResolver(paymentRejectSchema),
    defaultValues: {
      reason: '',
    },
  });

  const handleApprove = async () => {
    setActionError(null);
    const success = await onApprove(paymentId);
    if (!success) {
      setActionError('فشل في الموافقة على الدفع');
    }
  };

  const onRejectFormSubmit = async (data: PaymentRejectFormData) => {
    setActionError(null);
    const success = await onReject(paymentId, data.reason || undefined);
    if (!success) {
      setActionError('فشل في رفض الدفع');
    }
    setShowRejectInput(false);
    resetRejectForm();
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'في الانتظار', color: themeConfig.colors.warning },
    processing: { label: 'قيد المراجعة', color: themeConfig.colors.info },
    completed: { label: 'مقبول', color: themeConfig.colors.success },
    failed: { label: 'مرفوض', color: themeConfig.colors.error },
  };

  const statusInfo = statusLabels[status] || statusLabels.pending;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border" style={{ backgroundColor: themeConfig.colors.surface, borderColor: themeConfig.colors.border }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>إيصال الدفع</p>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}>
          {statusInfo.label}
        </span>
      </div>

      {/* Payment Info */}
      <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: themeConfig.colors.background }}>
        <span className="text-xs" style={{ color: themeConfig.colors.textMuted }}>المبلغ</span>
        <span className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>{amount} {currency === 'dzd' ? 'دج' : currency}</span>
      </div>

      {transactionReference && (
        <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: themeConfig.colors.background }}>
          <span className="text-xs" style={{ color: themeConfig.colors.textMuted }}>رقم العملية</span>
          <span className="text-xs font-mono font-bold" style={{ color: themeConfig.colors.text }}>{transactionReference}</span>
        </div>
      )}

      {/* View Receipt */}
      {receiptUrl && (
        <>
          <button
            type="button"
            onClick={() => setShowReceipt(!showReceipt)}
            className="flex items-center justify-center gap-2 p-3 rounded-xl border transition-all"
            style={{ borderColor: themeConfig.colors.border }}
          >
            <Eye size={16} style={{ color: themeConfig.colors.primary }} />
            <span className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>
              {showReceipt ? 'إخفاء الإيصال' : 'عرض الإيصال'}
            </span>
          </button>
          {showReceipt && (
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: themeConfig.colors.border }}>
              {receiptUrl.endsWith('.pdf') ? (
                <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-6 gap-2" style={{ backgroundColor: themeConfig.colors.background }}>
                  <span className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>فتح ملف PDF</span>
                </a>
              ) : (
                <img src={receiptUrl} alt="Payment receipt" className="w-full max-h-80 object-contain" style={{ backgroundColor: themeConfig.colors.background }} />
              )}
            </div>
          )}
        </>
      )}

      {/* Error */}
      {actionError && (
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: themeConfig.colors.error + '10' }}>
          <AlertTriangle size={14} style={{ color: themeConfig.colors.error }} />
          <p className="text-xs" style={{ color: themeConfig.colors.error }}>{actionError}</p>
        </div>
      )}

      {/* Action Buttons (only show for processing/pending status) */}
      {(status === 'pending' || status === 'processing') && (
        <>
          {showRejectInput && (
            <form onSubmit={handleRejectSubmit(onRejectFormSubmit)} className="flex flex-col gap-2">
              <input
                type="text"
                {...register('reason')}
                placeholder="سبب الرفض (اختياري)"
                className="w-full p-3 rounded-xl border text-xs"
                style={{
                  backgroundColor: themeConfig.colors.background,
                  borderColor: themeConfig.colors.border,
                  color: themeConfig.colors.text,
                }}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isRejecting}
                  className="flex-1 h-10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 disabled:opacity-50"
                  style={{ backgroundColor: themeConfig.colors.error }}
                >
                  {isRejecting ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  تأكيد الرفض
                </button>
                <button
                  type="button"
                  onClick={() => { setShowRejectInput(false); resetRejectForm(); }}
                  className="flex-1 h-10 rounded-xl text-xs font-bold border flex items-center justify-center"
                  style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.textMuted }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          {!showRejectInput && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: themeConfig.colors.success }}
              >
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                موافقة
              </button>
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                disabled={isProcessing}
                className="flex-1 h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: themeConfig.colors.error }}
              >
                <XCircle size={14} />
                رفض
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
