import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

export type AiTextProviderName = 'groq' | 'gemini';

const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_GEMINI_TEXT_MODEL = 'gemini-2.0-flash';
const DEFAULT_GEMINI_IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';

/** Resolve Groq API key (server-only, free tier friendly). Rejects mislabeled xAI keys. */
export function getGroqApiKey(): string | undefined {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return undefined;
  if (key.startsWith('xai-')) return undefined;
  if (!key.startsWith('gsk_')) return undefined;
  return key;
}

/** Resolve Gemini API key from common env names (server-only). */
export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY
    || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    || process.env.GOOGLE_API_KEY
    || undefined;
}

export function getActiveTextProviderName(): AiTextProviderName | null {
  if (getGroqApiKey()) return 'groq';
  if (getGeminiApiKey()) return 'gemini';
  return null;
}

/** Human-readable reason when generative AI is unavailable. */
export function getAiExternalBlocker(): string | null {
  if (!isAiGenerationEnabled()) {
    return 'AI_GENERATION_ENABLED is off on the server.';
  }
  const rawGroq = process.env.GROQ_API_KEY?.trim();
  if (rawGroq?.startsWith('xai-')) {
    return 'GROQ_API_KEY holds an xAI Grok key — use a Groq key (gsk_…) from console.groq.com, or set GEMINI_API_KEY.';
  }
  if (rawGroq && !rawGroq.startsWith('gsk_')) {
    return 'GROQ_API_KEY is not a valid Groq key (expected gsk_… from console.groq.com).';
  }
  if (!getGroqApiKey() && !getGeminiApiKey()) {
    return 'Set GROQ_API_KEY (free, gsk_…) or GEMINI_API_KEY on the server to enable generative AI.';
  }
  return null;
}

export function isAiGenerationEnabled(): boolean {
  if (process.env.AI_GENERATION_ENABLED === 'false') return false;
  if (process.env.AI_GENERATION_ENABLED === 'true') return true;
  return Boolean(getGroqApiKey() || getGeminiApiKey());
}

export function getGoogleProvider() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  return createGoogleGenerativeAI({ apiKey });
}

/** Prefer Groq (free) for text; fall back to Gemini when configured. */
export function getTextModel(): LanguageModel | null {
  const groqKey = getGroqApiKey();
  if (groqKey) {
    return createGroq({ apiKey: groqKey })(getTextModelId());
  }
  const google = getGoogleProvider();
  if (!google) return null;
  return google(getTextModelId());
}

export function getTextModelId(): string {
  const configured = process.env.AI_TEXT_MODEL?.trim();
  if (configured && !configured.includes('/')) {
    if (getGroqApiKey() && configured.startsWith('gemini')) {
      return DEFAULT_GROQ_MODEL;
    }
    return configured;
  }
  if (getGroqApiKey()) return DEFAULT_GROQ_MODEL;
  return DEFAULT_GEMINI_TEXT_MODEL;
}

export function getImageModelId(): string {
  const configured = process.env.AI_IMAGE_MODEL?.trim();
  if (!configured || configured.includes('/')) {
    return DEFAULT_GEMINI_IMAGE_MODEL;
  }
  return configured;
}

/**
 * Hairstyle image gen is opt-in (cost/quota). Requires explicit
 * AI_IMAGE_GENERATION_ENABLED=true plus a Gemini key — matches client FEATURE_FLAGS.
 */
export function hasImageGeneration(): boolean {
  if (process.env.AI_IMAGE_GENERATION_ENABLED !== 'true') return false;
  return isAiGenerationEnabled() && Boolean(getGeminiApiKey());
}

export function aiUnavailableMessage(): string {
  if (!getGroqApiKey() && !getGeminiApiKey()) {
    return 'أضف GROQ_API_KEY (مجاني) أو GEMINI_API_KEY في متغيرات الخادم لتفعيل المساعد.';
  }
  return 'المساعد غير متاح حالياً. حاول لاحقاً.';
}
