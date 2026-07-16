/**
 * Provider abstraction and registry.
 *
 * A provider is the thin transport that turns an `AICompletionRequest` into a
 * response, either buffered or streamed. Concrete providers are added during
 * the AI implementation phase; this file only defines the contract and a
 * registry so the rest of the app can stay vendor-agnostic.
 */
import type {
  AICompletionRequest,
  AICompletionResult,
  AIProviderName,
  AIStreamChunk,
} from './types';

export interface AIProvider {
  readonly name: AIProviderName;
  /** Perform a buffered (non-streaming) completion. */
  complete(request: AICompletionRequest): Promise<AICompletionResult>;
  /** Perform a streaming completion, yielding incremental chunks. */
  stream(request: AICompletionRequest): AsyncIterable<AIStreamChunk>;
}

/**
 * Simple registry so the active provider can be swapped without touching call
 * sites. The AI phase registers a real provider (e.g. an edge-function proxy)
 * at startup.
 */
export class AIProviderRegistry {
  private providers = new Map<AIProviderName, AIProvider>();
  private active: AIProviderName | null = null;

  register(provider: AIProvider, activate = true): void {
    this.providers.set(provider.name, provider);
    if (activate || this.active === null) this.active = provider.name;
  }

  setActive(name: AIProviderName): void {
    if (!this.providers.has(name)) {
      throw new Error(`AI provider "${name}" is not registered.`);
    }
    this.active = name;
  }

  getActive(): AIProvider | null {
    return this.active ? this.providers.get(this.active) ?? null : null;
  }

  get(name: AIProviderName): AIProvider | null {
    return this.providers.get(name) ?? null;
  }
}

export const aiProviderRegistry = new AIProviderRegistry();
