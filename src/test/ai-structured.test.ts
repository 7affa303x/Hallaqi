import { describe, expect, it } from 'vitest';
import { extractJsonObject } from '../../api/_lib/ai-structured';

describe('extractJsonObject', () => {
  it('parses raw JSON', () => {
    expect(extractJsonObject('{"answer":"مرحبا","suggestedServices":[],"cautions":[]}')).toEqual({
      answer: 'مرحبا',
      suggestedServices: [],
      cautions: [],
    });
  });

  it('strips markdown fences and trailing junk', () => {
    const text = '```json\n{"answer":"نصيحة","suggestedServices":["قص"],"cautions":["حذر"]}\n```\nextra';
    expect(extractJsonObject(text)).toEqual({
      answer: 'نصيحة',
      suggestedServices: ['قص'],
      cautions: ['حذر'],
    });
  });

  it('returns null for non-json', () => {
    expect(extractJsonObject('just text')).toBeNull();
  });
});
