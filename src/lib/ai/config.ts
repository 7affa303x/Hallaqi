/**
 * AI configuration resolved from Vite environment variables.
 *
 * No secret keys live here. The browser only knows the URL of a server-side
 * proxy (Supabase Edge Function / Vercel Function) that performs the actual
 * authenticated call to the model vendor.
 */
import type { AIProviderConfig, AIProviderName } from './types';

function readEnv(key: string): string {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return typeof value === 'string' ? value.trim() : '';
}

/** True when an AI proxy endpoint has been configured for this deployment. */
export function isAIConfigured(): boolean {
  return readEnv('VITE_AI_ENDPOINT').length > 0;
}

/**
 * Resolve the AI provider configuration from the environment, or `null` when
 * AI has not been configured yet (the expected state before AI implementation).
 */
export function getAIConfig(): AIProviderConfig | null {
  const endpoint = readEnv('VITE_AI_ENDPOINT');
  if (!endpoint) return null;

  const provider = (readEnv('VITE_AI_PROVIDER') || 'edge-function') as AIProviderName;
  const defaultModel = readEnv('VITE_AI_MODEL') || 'gpt-4o-mini';

  return { provider, endpoint, defaultModel };
}
