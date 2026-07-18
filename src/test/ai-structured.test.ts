import { describe, expect, it } from 'vitest';
import {
  coerceStructuredCandidate,
  extractAnswerFromMessyText,
  extractJsonObject,
  repairJsonText,
} from '../../api/_lib/ai-structured';
import { normalizeGroomingAdvice } from '@/lib/ai/http';

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

  it('repairs trailing commas', () => {
    expect(extractJsonObject('{"answer":"ok","suggestedServices":["قص",],}')).toEqual({
      answer: 'ok',
      suggestedServices: ['قص'],
    });
  });

  it('returns null for non-json', () => {
    expect(extractJsonObject('just text')).toBeNull();
  });
});

describe('coerceStructuredCandidate', () => {
  it('truncates oversized service lists', () => {
    const coerced = coerceStructuredCandidate({
      answer: 'نصيحة',
      suggestedServices: ['ا', 'ب', 'ج', 'د', 'ه'],
      cautions: ['حذر طويل جداً'.repeat(20)],
    }) as {
      suggestedServices: string[];
      cautions: string[];
    };
    expect(coerced.suggestedServices).toHaveLength(4);
    expect(coerced.cautions[0].length).toBeLessThanOrEqual(160);
  });
});

describe('extractAnswerFromMessyText', () => {
  it('pulls answer from valid JSON blob', () => {
    expect(extractAnswerFromMessyText('{"answer":"قصة قصيرة","suggestedServices":[],"cautions":[]}')).toBe('قصة قصيرة');
  });

  it('pulls answer via regex when JSON is invalid', () => {
    expect(extractAnswerFromMessyText('{"answer":"مرحبا","suggestedServices":[}')).toBe('مرحبا');
  });
});

describe('normalizeGroomingAdvice', () => {
  it('unwraps JSON accidentally stored in answer', () => {
    const normalized = normalizeGroomingAdvice({
      answer: '{"answer":"نصيحة نظيفة","suggestedServices":["قص"],"cautions":["حذر"]}',
      suggestedServices: [],
      cautions: ['هذه نصيحة عامة — راجع حلاقاً أو مختصاً عند الحاجة.'],
    });
    expect(normalized.answer).toBe('نصيحة نظيفة');
    expect(normalized.suggestedServices).toEqual(['قص']);
    expect(normalized.cautions).toEqual(['حذر']);
  });

  it('leaves normal answers alone', () => {
    expect(normalizeGroomingAdvice({
      answer: 'نصيحة عادية',
      suggestedServices: ['قص'],
      cautions: [],
    }).answer).toBe('نصيحة عادية');
  });
});

describe('repairJsonText', () => {
  it('strips trailing commas', () => {
    expect(repairJsonText('{"a":1,}')).toBe('{"a":1}');
  });
});
