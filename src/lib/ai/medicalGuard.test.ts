import { describe, expect, it } from 'vitest';
import { looksLikeMedicalQuestion, medicalRefusalMessage } from '@/lib/ai/medicalGuard';

describe('medicalGuard', () => {
  it('detects Arabic/English/French medical phrasing', () => {
    expect(looksLikeMedicalQuestion('هل هذا مرض جلدي؟')).toBe(true);
    expect(looksLikeMedicalQuestion('I need a diagnosis for psoriasis')).toBe(true);
    expect(looksLikeMedicalQuestion('chute de cheveux inexpliquée')).toBe(true);
    expect(looksLikeMedicalQuestion('ما قصة مناسبة لشعر مجعد؟')).toBe(false);
  });

  it('returns localized refusal', () => {
    expect(medicalRefusalMessage('ar')).toMatch(/طبي/);
    expect(medicalRefusalMessage('en')).toMatch(/dermatologist/i);
    expect(medicalRefusalMessage('fr')).toMatch(/dermatologue/i);
  });
});
