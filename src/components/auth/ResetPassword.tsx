import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/useApp';
import { supabase } from '../../supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const { navigate, themeConfig } = useApp();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        // Check if there's a recovery token in the URL
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session but we're on /reset-password, the user likely has a recovery token
        // Supabase will handle this automatically with detectSessionInUrl: true
        if (session?.user || window.location.hash.includes('type=recovery')) {
          setLoading(false);
        } else {
          setError('لم يتم العثور على رابط إعادة تعيين صحيح. يرجى طلب رابط جديد.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking recovery token:', err);
        setError('حدث خطأ في التحقق من الرابط.');
        setLoading(false);
      }
    };

    checkRecoveryToken();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة.');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message || 'فشل تحديث كلمة المرور. حاول مرة أخرى.');
      } else {
        setSuccess(true);
        setMessage('تم تحديث كلمة المرور بنجاح! سيتم إعادة توجيهك للدخول...');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          navigate('login');
        }, 2000);
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
      console.error('Password update error:', err);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: themeConfig.colors.background }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          className="w-12 h-12 border-[2.5px] border-transparent rounded-full"
          style={{ borderTopColor: themeConfig.colors.primary }}
        />
        <p className="text-sm font-medium mt-4" style={{ color: themeConfig.colors.textMuted }}>
          جاري التحميل...
        </p>
      </motion.div>
    );
  }

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

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl font-black tracking-tight"
          style={{ color: themeConfig.colors.text }}
        >
          إعادة تعيين كلمة المرور
        </motion.h1>
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
          onSubmit={handleUpdatePassword}
          className="flex-1 px-5 space-y-4 mt-6"
        >
          {/* New Password */}
          <div>
            <label className="block text-xs font-bold mb-2 px-0.5" style={{ color: themeConfig.colors.text }}>
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: themeConfig.colors.textMuted }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                autoComplete="new-password"
                className="w-full h-[52px] pr-10 pl-12 text-sm rounded-2xl outline-none transition-all duration-200"
                style={{
                  backgroundColor: themeConfig.colors.surface,
                  color: themeConfig.colors.text,
                  border: `2px solid ${themeConfig.colors.border}`,
                }}
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                tabIndex={-1}
              >
                {showPassword
                  ? <EyeOff size={16} style={{ color: themeConfig.colors.textMuted }} />
                  : <Eye size={16} style={{ color: themeConfig.colors.textMuted }} />
                }
              </motion.button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold mb-2 px-0.5" style={{ color: themeConfig.colors.text }}>
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: themeConfig.colors.textMuted }}
              />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                autoComplete="new-password"
                className="w-full h-[52px] pr-10 pl-12 text-sm rounded-2xl outline-none transition-all duration-200"
                style={{
                  backgroundColor: themeConfig.colors.surface,
                  color: themeConfig.colors.text,
                  border: `2px solid ${themeConfig.colors.border}`,
                }}
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword
                  ? <EyeOff size={16} style={{ color: themeConfig.colors.textMuted }} />
                  : <Eye size={16} style={{ color: themeConfig.colors.textMuted }} />
                }
              </motion.button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full h-[52px] rounded-2xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2.5 mt-6"
            style={{
              backgroundColor: themeConfig.colors.primary,
              boxShadow: `0 4px 16px ${themeConfig.colors.primary}30`,
            }}
          >
            تحديث كلمة المرور
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

export default ResetPassword;
