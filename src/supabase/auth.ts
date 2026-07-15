import { supabase, isSupabaseConfigured } from './client';
import type { AppUser } from '@/types/supabase';

function getAuthErrorMessage(err: { message?: string; code?: string; status?: number }): string {
  const msg = err.message || '';
  const code = err.code || '';

  if (code === 'invalid_credentials' || msg.includes('Invalid login')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  if (code === 'user_not_found' || msg.includes('user not found')) return 'لا يوجد حساب بهذا البريد';
  if (code === 'email_exists' || msg.includes('already registered')) return 'هذا البريد مسجل بالفعل';
  if (code === 'weak_password' || msg.includes('password')) return 'كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل';
  if (code === 'invalid_email' || msg.includes('email')) return 'البريد الإلكتروني غير صالح';
  if (code === 'session_expired' || msg.includes('expired')) return 'انتهت الجلسة. سجل الدخول مرة أخرى';
  if (err.status === 0 || msg.includes('network')) return 'فشل الاتصال بالشبكة. تحقق من اتصالك';
  if (code === 'over_email_send_rate_limit') return 'طلبات كثيرة. حاول لاحقاً';

  return 'حدث خطأ. حاول مرة أخرى';
}

/* ========== SIGN UP ========== */
export async function signUp(email: string, password: string, displayName: string) {
  if (!isSupabaseConfigured()) throw new Error('Supabase غير مُعد');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw new Error(getAuthErrorMessage(error));

  if (data.user) {
    await supabase.from('users').upsert({
      id: data.user.id,
      email: email,
      display_name: displayName,
      role: 'user',
      created_at: new Date().toISOString(),
    });
  }
  return data;
}

/* ========== SIGN IN ========== */
export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured()) throw new Error('Supabase غير مُعد');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(getAuthErrorMessage(error));

  if (data.user) {
    await supabase.from(\'users\').update({ updated_at: new Date().toISOString() } as Record<string, unknown>).eq(\'id\', data.user.id);
  }
  return data;
}

/* ========== SIGN OUT ========== */
export async function signOut() {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(getAuthErrorMessage(error));
}

/* ========== PASSWORD RESET ========== */
export async function resetPassword(email: string) {
  if (!isSupabaseConfigured()) throw new Error('Supabase غير مُعد');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(getAuthErrorMessage(error));
}

/* ========== USER PROFILE ========== */
export async function fetchUserProfile(userId: string): Promise<AppUser | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.from(\'users\').select(\'*\').eq(\'id\', userId).single();
  if (error || !data) return null;
  return data as unknown as AppUser;
}

export { supabase };
