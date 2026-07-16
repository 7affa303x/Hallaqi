/**
 * Conversation memory / history abstraction.
 *
 * The AI phase can back this with Supabase (the existing `conversations` /
 * `messages` tables) or any other store. A lightweight in-memory
 * implementation is provided for local/session use and tests.
 */
import type { AIMessage } from './types';

export interface ConversationMemory {
  append(conversationId: string, message: AIMessage): Promise<void>;
  history(conversationId: string): Promise<AIMessage[]>;
  clear(conversationId: string): Promise<void>;
}

/** Ephemeral, per-runtime conversation store. */
export class InMemoryConversationMemory implements ConversationMemory {
  private store = new Map<string, AIMessage[]>();

  async append(conversationId: string, message: AIMessage): Promise<void> {
    const existing = this.store.get(conversationId) ?? [];
    existing.push(message);
    this.store.set(conversationId, existing);
  }

  async history(conversationId: string): Promise<AIMessage[]> {
    return [...(this.store.get(conversationId) ?? [])];
  }

  async clear(conversationId: string): Promise<void> {
    this.store.delete(conversationId);
  }
}
