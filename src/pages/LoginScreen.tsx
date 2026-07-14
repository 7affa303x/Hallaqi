import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/useApp';
import type { ScreenParams } from '@/types';
import { useStore } from '@/store/useStore';
import { getErrMsg } from '@/lib/error';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn, Mail, Lock, Eye, EyeOff, ArrowRight,
  Chrome, AlertCircle, WifiOff, ShieldCheck
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */
function validateEmail(email: string): string | null {
  if (!email.trim()) return 'أدخل البريد الإلكتروني';
  if (!/^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(email)) return 'البريد الإلكتروني غير صالح';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'أدخل كلمة المرور';
  if (password.length < 6) return 'كلمة المرور قصيرة جداً';
  return null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
interface LoginScreenProps {
  redirectScreen?: string;
  redirectParams?: Record<string, unknown>;
}

export default function LoginScreen({ redirectScreen, redirectParams }: LoginScreenProps) {
  const { themeConfig, navigate } = useApp();
  const { googleSignIn, login, isLoading, error: authError } = useAuth();
  const setAuthenticated = useStore(s => s.setAuthenticated);
  const isOnline = useStore(s => s.isOnline);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [localError, setLocalError] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const error = localError || authError || '';

  /* ---- Validation ---- */
  const emailError = touched.email ? validateEmail(email) : fieldErrors.email;
  const passwordError = touched.password ? validatePassword(password) : fieldErrors.password;
  const hasErrors = !!(emailError || passwordError);

  const clearError = useCallback(() => {
    setLocalError('');
  }, []);

  /* ---- Submit ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validate all fields
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setTouched({ email: true, password: true });
    setFieldErrors({ email: eErr || undefined, password: pErr || undefined });

    if (eErr || pErr) return;

    try {
      await login(email, password);
      setAuthenticated(true);
      if (redirectScreen && redirectScreen !== 'login') {
        navigate(redirectScreen as 'home', redirectParams as ScreenParams);
      } else {
        navigate('home');
      }
    } catch (err) {
      const msg = getErrMsg(err);
      if (msg.includes('user-not-found') || msg.includes('لم يتم العثور')) {
        setFieldErrors({ email: 'لا يوجد حساب بهذا البريد' });
      } else if (msg.includes('wrong-password') || msg.includes('غير صحيحة')) {
        setFieldErrors({ password: 'كلمة المرور غير صحيحة' });
      } else {
        setLocalError(msg);
      }
    }
  };

  /* ---- Google ---- */
  const handleGoogle = async () => {
    clearError();
    try {
      await googleSignIn();
      setAuthenticated(true);
      if (redirectScreen && redirectScreen !== 'login') {
        navigate(redirectScreen as 'home', redirectParams as ScreenParams);
      } else {
        navigate('home');
      }
    } catch {
      setLocalError('فشل تسجيل الدخول بـ Google. حاول مرة أخرى.');
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
          onClick={() => navigate('home')}
          className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: themeConfig.colors.surface, border: `1px solid ${themeConfig.colors.border}` }}
        >
          <ArrowRight size={20} style={{ color: themeConfig.colors.text }} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center gap-3 mb-3"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: themeConfig.colors.primary + '12' }}
          >
            <img src="/logo-icon.png" alt="Hallaqi" className="w-10 h-10 rounded-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: themeConfig.colors.text }}>
              Hallaqi
            </h1>
            <p className="text-[11px] font-medium tracking-wide" style={{ color: themeConfig.colors.textMuted }}>
              منصة حجز الحلاقين في الجزائر
            </p>
          </div>
        </motion.div>
      </div>

      {/* === OFFLINE BANNER === */}
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mx-5 mb-3 p-3 rounded-2xl flex items-center gap-2.5"
          style={{ backgroundColor: themeConfig.colors.warning + '12', border: `1px solid ${themeConfig.colors.warning}20` }}
        >
          <WifiOff size={16} style={{ color: themeConfig.colors.warning }} />
          <p className="text-[11px] font-medium" style={{ color: themeConfig.colors.warning }}>
            لا يوجد اتصال بالإنترنت. بعض الميزات قد لا تعمل.
          </p>
        </motion.div>
      )}

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

      {/* === FORM === */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        onSubmit={handleSubmit}
        className="flex-1 px-5 space-y-4"
      >
        {/* Email */}
        <div>
          <label className="block text-xs font-bold mb-2 px-0.5" style={{ color: themeConfig.colors.text }}>
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
              style={{ color: emailError ? themeConfig.colors.error : themeConfig.colors.textMuted }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) clearError(); }}
              onBlur={() => setTouched(p => ({ ...p, email: true }))}
              placeholder="example@email.com"
              dir="ltr"
              autoComplete="email"
              disabled={isLoading}
              className="w-full h-[52px] pr-10 pl-4 text-sm rounded-2xl outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: themeConfig.colors.surface,
                color: themeConfig.colors.text,
                border: `2px solid ${emailError ? themeConfig.colors.error : touched.email ? themeConfig.colors.primary + '40' : themeConfig.colors.border}`,
              }}
            />
          </div>
          <AnimatePresence>
            {emailError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-semibold mt-1.5 px-1"
                style={{ color: themeConfig.colors.error }}
              >
                {emailError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold mb-2 px-0.5" style={{ color: themeConfig.colors.text }}>
            كلمة المرور
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
              style={{ color: passwordError ? themeConfig.colors.error : themeConfig.colors.textMuted }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (passwordError) clearError(); }}
              onBlur={() => setTouched(p => ({ ...p, password: true }))}
              placeholder="••••••••"
              dir="ltr"
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full h-[52px] pr-10 pl-12 text-sm rounded-2xl outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: themeConfig.colors.surface,
                color: themeConfig.colors.text,
                border: `2px solid ${passwordError ? themeConfig.colors.error : touched.password ? themeConfig.colors.primary + '40' : themeConfig.colors.border}`,
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
          <AnimatePresence>
            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-semibold mt-1.5 px-1"
                style={{ color: themeConfig.colors.error }}
              >
                {passwordError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('forgot-password')}
            className="text-[11px] font-bold transition-opacity hover:opacity-70"
            style={{ color: themeConfig.colors.primary }}
          >
            نسيت كلمة المرور؟
          </motion.button>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading || hasErrors && touched.email && touched.password}
          whileTap={isLoading ? {} : { scale: 0.97 }}
          className="w-full h-[52px] rounded-2xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 mt-2"
          style={{
            backgroundColor: themeConfig.colors.primary,
            boxShadow: `0 4px 16px ${themeConfig.colors.primary}30`,
          }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              <LogIn size={18} strokeWidth={2.5} />
              <span>تسجيل الدخول</span>
            </>
          )}
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px" style={{ backgroundColor: themeConfig.colors.border }} />
          <span className="text-[10px] font-bold" style={{ color: themeConfig.colors.textMuted }}>أو</span>
          <div className="flex-1 h-px" style={{ backgroundColor: themeConfig.colors.border }} />
        </div>

        {/* Google */}
        <motion.button
          type="button"
          onClick={handleGoogle}
          disabled={isLoading || !isOnline}
          whileTap={isLoading ? {} : { scale: 0.97 }}
          className="w-full h-[52px] rounded-2xl text-sm font-bold border-2 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50"
          style={{
            backgroundColor: themeConfig.colors.surface,
            borderColor: themeConfig.colors.border,
            color: themeConfig.colors.text,
          }}
        >
          <Chrome size={18} style={{ color: '#EF4444' }} />
          <span>Google تسجيل الدخول بـ</span>
        </motion.button>

        {/* Security note */}
        <div className="flex items-center justify-center gap-1.5 pt-1 pb-4">
          <ShieldCheck size={12} style={{ color: themeConfig.colors.textMuted + '80' }} />
          <p className="text-[10px] font-medium" style={{ color: themeConfig.colors.textMuted + '80' }}>
            بياناتك مشفرة وآمنة
          </p>
        </div>
      </motion.form>

      {/* === FOOTER === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-5 py-5 text-center"
      >
        <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>
          ليس لديك حساب؟{' '}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('register', redirectParams as Record<string, string>)}
            className="font-bold"
            style={{ color: themeConfig.colors.primary }}
          >
            أنشئ حساباً
          </motion.button>
        </p>
      </motion.div>
    </motion.div>
  );
}
