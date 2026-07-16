/**
 * High-level AI client that orchestrates provider + prompt + memory + context.
 *
 * This is the single entry point the application will use once AI is
 * implemented. Until a provider is registered (see `provider.ts`) and an
 * endpoint is configured (see `config.ts`), every call fails fast with
 * `AINotConfiguredError` instead of returning fabricated output.
 */
import { getAIConfig } from './config';
import { AINotConfiguredError } from './errors';
import { aiProviderRegistry } from './provider';
import { buildMessages } from './prompt';
import { InMemoryConversationMemory, type ConversationMemory } from './memory';
import { NoopContextRetriever, type ContextRetriever } from './context';
import type {
  AICompletionOptions,
  AICompletionResult,
  AIMessage,
  AIStreamChunk,
} from './types';

export interface AIClientDeps {
  memory?: ConversationMemory;
  retriever?: ContextRetriever;
}

export interface ChatParams extends AICompletionOptions {
  conversationId: string;
  message: string;
  systemPrompt?: string;
}

export class AIClient {
  private memory: ConversationMemory;
  private retriever: ContextRetriever;

  constructor(deps: AIClientDeps = {}) {
    this.memory = deps.memory ?? new InMemoryConversationMemory();
    this.retriever = deps.retriever ?? new NoopContextRetriever();
  }

  /** Send a user message and receive a buffered assistant response. */
  async chat(params: ChatParams): Promise<AICompletionResult> {
    const provider = this.requireProvider();
    const messages = await this.assemble(params);
    const result = await provider.complete({ ...this.options(params), messages });
    await this.memory.append(params.conversationId, { role: 'assistant', content: result.content });
    return result;
  }

  /** Send a user message and stream the assistant response. */
  async *streamChat(params: ChatParams): AsyncIterable<AIStreamChunk> {
    const provider = this.requireProvider();
    const messages = await this.assemble(params);
    let full = '';
    for await (const chunk of provider.stream({ ...this.options(params), messages })) {
      full += chunk.delta;
      yield chunk;
    }
    await this.memory.append(params.conversationId, { role: 'assistant', content: full });
  }

  private async assemble(params: ChatParams): Promise<AIMessage[]> {
    const history = await this.memory.history(params.conversationId);
    const userMessage: AIMessage = { role: 'user', content: params.message };
    await this.memory.append(params.conversationId, userMessage);

    const retrieved = await this.retriever.retrieve(params.message);
    const systemPrompt = retrieved.length
      ? [params.systemPrompt, ...retrieved.map(r => r.content)].filter(Boolean).join('\n\n')
      : params.systemPrompt;

    return buildMessages([...history, userMessage], systemPrompt);
  }

  private options(params: ChatParams): AICompletionOptions {
    return {
      model: params.model,
      temperature: params.temperature,
      maxTokens: params.maxTokens,
      tools: params.tools,
      signal: params.signal,
    };
  }

  private requireProvider() {
    const provider = aiProviderRegistry.getActive();
    if (!provider || !getAIConfig()) throw new AINotConfiguredError();
    return provider;
  }
}

/** Convenience factory. Returns a client bound to the default dependencies. */
export function createAIClient(deps?: AIClientDeps): AIClient {
  return new AIClient(deps);
}
