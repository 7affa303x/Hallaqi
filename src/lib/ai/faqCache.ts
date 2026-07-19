/** Client FAQ answer cache for repeated AI questions (#134). */

import type { GroomingAdvice } from '@/lib/ai/http';

const CACHE_KEY = 'hallaqi-ai-faq-cache-v1';
const CAP = 24;

type Entry = { q: string; advice: GroomingAdvice; at: number };

function normalizeQuestion(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 160);
}

function read(): Entry[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) as Entry[] : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(entries: Entry[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entries.slice(0, CAP)));
  } catch { /* ignore */ }
}

export function getCachedAdvice(question: string): GroomingAdvice | null {
  const key = normalizeQuestion(question);
  if (key.length < 8) return null;
  const hit = read().find(e => e.q === key);
  return hit?.advice ?? null;
}

export function setCachedAdvice(question: string, advice: GroomingAdvice) {
  const key = normalizeQuestion(question);
  if (key.length < 8) return;
  const next = [{ q: key, advice, at: Date.now() }, ...read().filter(e => e.q !== key)];
  write(next);
}

/** Static FAQ matches — no network (#134). */
const STATIC_FAQ: Array<{ match: RegExp; advice: GroomingAdvice }> = [
  {
    match: /كيف\s*أحجز|how\s*(do\s*i\s*)?book|comment\s*(je\s*)?r[eé]serve/i,
    advice: {
      answer: 'من تبويب الحجز اختر الحلاق والخدمة والموعد، ثم تابع من تبويب المواعيد. الدفع نقداً عند الزيارة.',
      suggestedServices: [],
      cautions: ['هذه إجابة من كاش الأسئلة الشائعة.'],
    },
  },
  {
    match: /كيف\s*ألغي|how\s*(do\s*i\s*)?cancel|comment\s*annul/i,
    advice: {
      answer: 'من تبويب المواعيد — الإلغاء مجاني قبل ساعتين على الأقل من وقت الموعد.',
      suggestedServices: [],
      cautions: ['هذه إجابة من كاش الأسئلة الشائعة.'],
    },
  },
];

export function matchStaticFaq(question: string): GroomingAdvice | null {
  const q = question.trim();
  for (const row of STATIC_FAQ) {
    if (row.match.test(q)) return row.advice;
  }
  return null;
}
