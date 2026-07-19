export type AnalyticsConsent = 'accepted' | 'declined' | null;

const STORAGE_KEY = 'hallaqi-analytics-consent';
const LOG_KEY = 'hallaqi-analytics-consent-log-v1';

export type ConsentLogEntry = {
  value: 'accepted' | 'declined';
  at: string;
};

export function readAnalyticsConsent(): AnalyticsConsent {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'accepted' || v === 'declined') return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeAnalyticsConsent(value: 'accepted' | 'declined') {
  try {
    localStorage.setItem(STORAGE_KEY, value);
    appendConsentLog(value);
  } catch {
    /* ignore */
  }
}

/** #178 — local audit trail of analytics consent choices */
export function appendConsentLog(value: 'accepted' | 'declined') {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const prev = raw ? JSON.parse(raw) as ConsentLogEntry[] : [];
    const list = Array.isArray(prev) ? prev : [];
    list.unshift({ value, at: new Date().toISOString() });
    localStorage.setItem(LOG_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {
    /* ignore */
  }
}

export function readConsentLog(): ConsentLogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const parsed = raw ? JSON.parse(raw) as ConsentLogEntry[] : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
