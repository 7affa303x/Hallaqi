import { supabase } from '@/supabase/client';

export async function requiresMfaChallenge(): Promise<boolean> {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) return false;
  return data.currentLevel === 'aal1' && data.nextLevel === 'aal2';
}

export async function verifyMfaCode(code: string): Promise<void> {
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
  if (factorsError) throw factorsError;
  const factor = factors.totp.find(item => item.status === 'verified');
  if (!factor) throw new Error('لا يوجد تطبيق مصادقة مفعّل');
  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId: factor.id,
  });
  if (challengeError) throw challengeError;
  const { error } = await supabase.auth.mfa.verify({
    factorId: factor.id,
    challengeId: challenge.id,
    code,
  });
  if (error) throw error;
}
