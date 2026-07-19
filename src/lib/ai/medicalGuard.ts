/** Soft client-side guard for medical / clinical questions (#122). */

const MEDICAL_RE =
  /(تشخيص|مرض\s*جلدي|صدفية|إكزيما|أكزيما|فطريات|عدوى|التهاب\s*الجلد|تساقط\s*(شعر|شديد)|صلع\s*مرضي|dermatit|psoriasis|eczema|fungal|infection|diagnos(e|is)|skin\s*disease|unexplained\s*hair\s*loss|chute\s*(de\s*)?cheveux\s*(inexpliqu|patholog)|maladie\s*de\s*peau)/i;

export function looksLikeMedicalQuestion(text: string): boolean {
  return MEDICAL_RE.test(text.trim());
}

export function medicalRefusalMessage(lang: 'ar' | 'fr' | 'en' = 'ar'): string {
  if (lang === 'fr') {
    return 'Je ne peux pas diagnostiquer un problème médical. Consultez un dermatologue ou un médecin. Hallaqi donne seulement des conseils de soin généraux.';
  }
  if (lang === 'en') {
    return 'I cannot diagnose medical conditions. Please see a dermatologist or doctor. Hallaqi only offers general grooming guidance.';
  }
  return 'لا أستطيع تشخيص حالات طبية. راجع طبيب جلدية أو مختصاً. مساعد حلاقي يقدّم نصائح عناية عامة فقط.';
}
