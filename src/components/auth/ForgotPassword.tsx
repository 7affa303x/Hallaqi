import React, { useState } from 'react';
import { useApp } from '../../contexts/useApp';
import { supabase } from '../../supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { navigate, themeConfig } = useApp();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message || 'فشل إرسال رابط إعادة التعيين. حاول مرة أخرى.');
        setLoading(false);
      } else {
        setSuccess(true);
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.');
        setEmail('');
        setLoading(false);
        setTimeout(() => {
          navigate('login');
        }, 3000);
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
      setLoading(false);
      console.error('Password reset error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: themeConfig.colors.background }}
    >
      {/* === HEADER === */}
      <div className="px-5 pt-6 pb-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate('login')}
          className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: themeConfig.colors.surface, border: `1px solid ${themeConfig.colors.border}` }}
        >
          <ArrowRight size={20} style={{ color: themeConfig.colors.text }} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h1 className="text-2xl font-black tracking-tight" style={{ color: themeConfig.colors.text }}>
            نسيت كلمة المرور؟
          </h1>
          <p className="text-xs font-medium mt-1" style={{ color: themeConfig.colors.textMuted }}>
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
          </p>
        </motion.div>
      </div>

      {/* === ERROR BANNER === */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="mx-5 overflow-hidden"
          >
            <div
              className="p-3.5 rounded-2xl flex items-start gap-2.5"
              style={{ backgroundColor: themeConfig.colors.error + '10', border: `1px solid ${themeConfig.colors.error}18` }}
            >
              <AlertCircle size={16} style={{ color: themeConfig.colors.error, flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs font-semibold leading-relaxed" style={{ color: themeConfig.colors.error }}>
                {error}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SUCCESS MESSAGE === */}
      <AnimatePresence>
        {success && message && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="mx-5 overflow-hidden"
          >
            <div
              className="p-3.5 rounded-2xl flex items-start gap-2.5"
              style={{ backgroundColor: themeConfig.colors.success + '10', border: `1px solid ${themeConfig.colors.success}18` }}
            >
              <CheckCircle size={16} style={{ color: themeConfig.colors.success, flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs font-semibold leading-relaxed" style={{ color: themeConfig.colors.success }}>
                {message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === FORM === */}
      {!success && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          onSubmit={handleResetPassword}
          className="flex-1 px-5 space-y-4 mt-6"
        >
          {/* Email */}
          <div>
            <label className="block text-xs font-bold mb-2 px-0.5" style={{ color: themeConfig.colors.text }}>
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: themeConfig.colors.textMuted }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
                autoComplete="email"
                disabled={loading}
                required
                className="w-full h-[52px] pr-10 pl-4 text-sm rounded-2xl outline-none transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: themeConfig.colors.surface,
                  color: themeConfig.colors.text,
                  border: `2px solid ${themeConfig.colors.border}`,
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || !email}
            whileTap={loading ? {} : { scale: 0.97 }}
            className="w-full h-[52px] rounded-2xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 mt-6"
            style={{
              backgroundColor: themeConfig.colors.primary,
              boxShadow: `0 4px 16px ${themeConfig.colors.primary}30`,
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full"
              />
            ) : (
              'إرسال رابط إعادة التعيين'
            )}
          </motion.button>
        </motion.form>
      )}

      {/* === BACK TO LOGIN === */}
      <div className="px-5 pb-6">
        <motion.button
          type="button"
          onClick={() => navigate('login')}
          className="w-full text-sm font-bold transition-opacity hover:opacity-70"
          style={{ color: themeConfig.colors.primary }}
        >
          العودة إلى تسجيل الدخول
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
