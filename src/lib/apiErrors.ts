/** Map common API / auth / AI error messages to user-facing copy. */

type Lang = 'ar' | 'fr' | 'en';

const MAP: Array<{ match: RegExp; ar: string; fr: string; en: string }> = [
  { match: /invalid login|invalid credentials|wrong password/i, ar: 'بيانات الدخول غير صحيحة', fr: 'Identifiants incorrects', en: 'Invalid login credentials' },
  { match: /email not confirmed|confirm your email/i, ar: 'أكد بريدك الإلكتروني أولاً', fr: 'Confirmez d’abord votre e-mail', en: 'Confirm your email first' },
  { match: /user already registered|already registered/i, ar: 'هذا البريد مسجّل مسبقاً', fr: 'Cet e-mail est déjà inscrit', en: 'Email already registered' },
  { match: /rate limit|too many requests|429/i, ar: 'محاولات كثيرة — انتظر قليلاً', fr: 'Trop de tentatives — patientez', en: 'Too many requests — please wait' },
  { match: /quota|ai.*(limit|exhausted)/i, ar: 'انتهى حد المساعد اليومي', fr: 'Quota d’assistant épuisé', en: 'Daily AI quota reached' },
  { match: /network|failed to fetch|offline/i, ar: 'تحقق من اتصال الإنترنت', fr: 'Vérifiez votre connexion', en: 'Check your internet connection' },
  { match: /slot.*(taken|available)|overlap|conflict/i, ar: 'هذا الموعد لم يعد متاحاً', fr: 'Ce créneau n’est plus disponible', en: 'This time slot is no longer available' },
  { match: /not authenticated|jwt|session/i, ar: 'سجّل الدخول للمتابعة', fr: 'Connectez-vous pour continuer', en: 'Sign in to continue' },
  { match: /payload too large|413/i, ar: 'الملف كبير جداً', fr: 'Fichier trop volumineux', en: 'File too large' },
];

export function translateApiError(error: unknown, lang: Lang = 'ar'): string {
  const raw = error instanceof Error ? error.message : String(error || '');
  const trimmed = raw.trim();
  if (!trimmed) {
    return lang === 'fr' ? 'Une erreur est survenue' : lang === 'en' ? 'Something went wrong' : 'حدث خطأ غير متوقع';
  }
  for (const row of MAP) {
    if (row.match.test(trimmed)) {
      return lang === 'fr' ? row.fr : lang === 'en' ? row.en : row.ar;
    }
  }
  // Keep short unknown messages; hide stack-like noise
  if (trimmed.length > 160 || /at\s+\S+\s+\(/.test(trimmed)) {
    return lang === 'fr' ? 'Une erreur est survenue' : lang === 'en' ? 'Something went wrong' : 'حدث خطأ غير متوقع';
  }
  return trimmed;
}
