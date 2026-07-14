import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/useApp';
import { useStore } from '@/store/useStore';
import { getErrMsg } from '@/lib/error';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Mail, Lock, Eye, EyeOff, ArrowRight, User,
  Chrome, AlertCircle, WifiOff, ShieldCheck, Check
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */
function validateName(name: string): string | null {
  if (!name.trim()) return 'أدخل اسمك الكامل';
  if (name.trim().length < 2) return 'الاسم قصير جداً';
  return null;
}

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'أدخل البريد الإلكتروني';
  if (!/^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(email)) return 'البريد الإلكتروني غير صالح';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'أدخل كلمة المرور';
  if (password.length < 6) return 'يجب أن تكون 6 أحرف على الأقل';
  return null;
}

function validateConfirm(password: string, confirm: string): string | null {
  if (!confirm) return 'أكد كلمة المرور';
  if (password !== confirm) return 'كلمتا المرور غير متطابقتين';
  return null;
}

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;

  if (s <= 1) return { score: s, label: 'ضعيفة', color: '#EF4444' };
  if (s <= 3) return { score: s, label: 'متوسطة', color: '#F59E0B' };
  if (s <= 4) return { score: s, label: 'قوية', color: '#3B82F6' };
  return { score: s, label: 'قوية جداً', color: '#22C55E' };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function RegisterScreen() {
  const { themeConfig, navigate } = useApp();
  const { googleSignIn, register, isLoading, error: authError } = useAuth();
  const setAuthenticated = useStore(s => s.setAuthenticated);
  const isOnline = useStore(s => s.isOnline);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const error = localError || authError || '';
  const strength = getPasswordStrength(password);

  /* ---- Touch handlers ---- */
  const touch = (key: string) => setTouched(p => ({ ...p, [key]: true }));

  const clearErrors = useCallback(() => {
    setLocalError('');
    setFieldErrors({});
  }, []);

  /* ---- Validate all ---- */
  const validateAll = () => {
    const errs: Record<string, string> = {};
    const n = validateName(name);
    const e = validateEmail(email);
    const p = validatePassword(password);
    const c = validateConfirm(password, confirm);
    if (n) errs.name = n;
    if (e) errs.email = e;
    if (p) errs.password = p;
    if (c) errs.confirm = c;
    if (!acceptedTerms) errs.terms = 'يجب قبول الشروط';
    return errs;
  };

  /* ---- Submit ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const errs = validateAll();
    setFieldErrors(errs);
    setTouched({ name: true, email: true, password: true, confirm: true, terms: true });

    if (Object.keys(errs).length > 0) return;

    try {
      await register(email, password, name.trim());
      setAuthenticated(true);
      navigate('home');
    } catch (err) {
      const msg = getErrMsg(err);
      if (msg.includes('email-already') || msg.includes('مستخدم')) {
        setFieldErrors({ email: 'هذا البريد مسجل بالفعل' });
      } else if (msg.includes('weak-password')) {
        setFieldErrors({ password: 'كلمة المرور ضعيفة' });
      } else if (msg.includes('invalid-email')) {
        setFieldErrors({ email: 'البريد غير صالح' });
      } else {
        setLocalError(msg || 'فشل إنشاء الحساب. حاول مرة أخرى.');
      }
    }
  };

  /* ---- Google ---- */
  const handleGoogle = async () => {
    clearErrors();
    try {
      await googleSignIn();
      setAuthenticated(true);
      navigate('home');
    } catch {
      setLocalError('فشل التسجيل بـ Google. حاول مرة أخرى.');
    }
  };

  const renderFieldError = (key: string) => {
    const msg = (touched[key] ? fieldErrors[key] : undefined) || fieldErrors[key];
    if (!msg) return null;
    return (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-[11px] font-semibold mt-1.5 px-1"
        style={{ color: themeConfig.colors.error }}
      >
        {msg}
      </motion.p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-3"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: themeConfig.colors.primary + '12' }}
          >
            <img src="/logo-icon.png" alt="Hallaqi" className="w-10 h-10 rounded-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: themeConfig.colors.text }}>Hallaqi</h1>
            <p className="text-[11px] font-medium" style={{ color: themeConfig.colors.textMuted }}>أنشئ حساباً جديداً</p>
          </div>
        </motion.div>
      </div>

      {/* Offline */}
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mx-5 mb-3 p-3 rounded-2xl flex items-center gap-2.5"
          style={{ backgroundColor: themeConfig.colors.warning + '12', border: `1px solid ${themeConfig.colors.warning}20` }}
        >
          <WifiOff size={16} style={{ color: themeConfig.colors.warning }} />
          <p className="text-[11px] font-medium" style={{ color: themeConfig.colors.warning }}>
            لا يوجد اتصال. تحقق من الشبكة.
          </p>
        </motion.div>
      )}

      {/* Error */}
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
              <p className="text-xs font-semibold" style={{ color: themeConfig.colors.error }}>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === FORM === */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="flex-1 px-5 space-y-3.5 overflow-y-auto"
      >
        {/* Name */}
        <div>
          <label className="block text-xs font-bold mb-2 px-0.5" style={{ color: themeConfig.colors.text }}>
            الاسم الكامل
          </label>
          <div className="relative">
            <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: fieldErrors.name ? themeConfig.colors.error : themeConfig.colors.textMuted }} />
            <input
              type="text" value={name}
              onChange={(e) => { setName(e.target.value); clearErrors(); }}
              onBlur={() => touch('name')}
              placeholder="محمد أحمد"
              disabled={isLoading}
              className="w-full h-[52px] pr-10 pl-4 text-sm rounded-2xl outline-none transition-all disabled:opacity-50"
              style={{
                backgroundColor: themeConfig.colors.surface,
                color: themeConfig.colors.text,
                border: `2px solid ${fieldErrors.name && touched.name ? themeConfig.colors.error : touched.name ? themeConfig.colors.primary + '40' : themeConfig.colors.border}`,
              }}
            />
          </div>
          <AnimatePresence>{renderFieldError('name')}</AnimatePresence>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold mb-2 px-0.5" style={{ color: themeConfig.colors.text }}>
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: fieldErrors.email ? themeConfig.colors.error : themeConfig.colors.textMuted }} />
            <input
              type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
              onBlur={() => touch('email')}
              placeholder="example@email.com"
              dir="ltr" autoComplete="email"
              disabled={isLoading}
              className="w-full h-[52px] pr-10 pl-4 text-sm rounded-2xl outline-none transition-all disabled:opacity-50"
              style={{
                backgroundColor: themeConfig.colors.surface,
                color: themeConfig.colors.text,
                border: `2px solid ${fieldErrors.email && touched.email ? themeConfig.colors.error : touched.email ? themeConfig.colors.primary + '40' : themeConfig.colors.border}`,
              }}
            />
          </div>
          <AnimatePresence>{renderFieldError('email')}</AnimatePresence>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold mb-2 px-0.5" style={{ color: themeConfig.colors.text }}>
            كلمة المرور
          </label>
          <div className="relative">
            <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: fieldErrors.password ? themeConfig.colors.error : themeConfig.colors.textMuted }} />
            <input
              type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
              onBlur={() => touch('password')}
              placeholder="••••••••"
              dir="ltr" autoComplete="new-password"
              disabled={isLoading}
              className="w-full h-[52px] pr-10 pl-12 text-sm rounded-2xl outline-none transition-all disabled:opacity-50"
              style={{
                backgroundColor: themeConfig.colors.surface,
                color: themeConfig.colors.text,
                border: `2px solid ${fieldErrors.password && touched.password ? themeConfig.colors.error : touched.password ? themeConfig.colors.primary + '40' : themeConfig.colors.border}`,
              }}
            />
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg"
              tabIndex={-1}
            >
              {showPassword
                ? <EyeOff size={16} style={{ color: themeConfig.colors.textMuted }} />
                : <Eye size={16} style={{ color: themeConfig.colors.textMuted }} />
              }
            </motion.button>
          </div>

          {/* Password Strength */}
          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 space-y-1.5"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i <= strength.score ? strength.color : themeConfig.colors.border,
                    }}
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold" style={{ color: strength.color }}>
                قوة كلمة المرور: {strength.label}
              </p>
            </motion.div>
          )}
          <AnimatePresence>{renderFieldError('password')}</AnimatePresence>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold mb-2 px-0.5" style={{ color: themeConfig.colors.text }}>
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: fieldErrors.confirm ? themeConfig.colors.error : themeConfig.colors.textMuted }} />
            <input
              type={showPassword ? 'text' : 'password'} value={confirm}
              onChange={(e) => { setConfirm(e.target.value); clearErrors(); }}
              onBlur={() => touch('confirm')}
              placeholder="••••••••"
              dir="ltr" autoComplete="new-password"
              disabled={isLoading}
              className="w-full h-[52px] pr-10 pl-4 text-sm rounded-2xl outline-none transition-all disabled:opacity-50"
              style={{
                backgroundColor: themeConfig.colors.surface,
                color: themeConfig.colors.text,
                border: `2px solid ${fieldErrors.confirm && touched.confirm ? themeConfig.colors.error : confirm && password === confirm ? '#22C55E40' : touched.confirm ? themeConfig.colors.primary + '40' : themeConfig.colors.border}`,
              }}
            />
            {confirm && password === confirm && (
              <Check size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#22C55E' }} />
            )}
          </div>
          <AnimatePresence>{renderFieldError('confirm')}</AnimatePresence>
        </div>

        {/* Terms */}
        <button
          type="button"
          onClick={() => { setAcceptedTerms(!acceptedTerms); clearErrors(); }}
          className="flex items-start gap-2.5 w-full pt-1"
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            style={{
              borderColor: fieldErrors.terms && touched.terms ? themeConfig.colors.error : acceptedTerms ? themeConfig.colors.primary : themeConfig.colors.border,
              backgroundColor: acceptedTerms ? themeConfig.colors.primary : 'transparent',
            }}
          >
            {acceptedTerms && <Check size={12} className="text-white" strokeWidth={3} />}
          </motion.div>
          <p className="text-[11px] leading-relaxed text-right" style={{ color: themeConfig.colors.textMuted }}>
            أوافق على{' '}
            <span className="font-bold" style={{ color: themeConfig.colors.primary }}>شروط الاستخدام</span>
            {' '}و{' '}
            <span className="font-bold" style={{ color: themeConfig.colors.primary }}>سياسة الخصوصية</span>
          </p>
        </button>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={isLoading ? {} : { scale: 0.97 }}
          className="w-full h-[52px] rounded-2xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 mt-1"
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
              <UserPlus size={18} strokeWidth={2.5} />
              <span>إنشاء حساب</span>
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
          <span>Google التسجيل بـ</span>
        </motion.button>

        {/* Security */}
        <div className="flex items-center justify-center gap-1.5 pt-1 pb-4">
          <ShieldCheck size={12} style={{ color: themeConfig.colors.textMuted + '80' }} />
          <p className="text-[10px] font-medium" style={{ color: themeConfig.colors.textMuted + '80' }}>
            بياناتك مشفرة ومحمية
          </p>
        </div>
      </motion.form>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-5 py-5 text-center"
      >
        <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>
          لديك حساب؟{' '}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('login')}
            className="font-bold"
            style={{ color: themeConfig.colors.primary }}
          >
            سجل الدخول
          </motion.button>
        </p>
      </motion.div>
    </motion.div>
  );
}
