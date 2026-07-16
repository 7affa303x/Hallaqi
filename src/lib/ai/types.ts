/**
 * Core AI type definitions.
 *
 * This is the provider-agnostic type layer shared by every part of the AI
 * integration (providers, chat, memory, tools, MCP). It intentionally has no
 * runtime code and no dependency on any specific LLM vendor.
 */

export type AIRole = 'system' | 'user' | 'assistant' | 'tool';

/** A single message in a conversation. */
export interface AIMessage {
  role: AIRole;
  content: string;
  /** Present only on `tool` messages: the id of the tool call being answered. */
  toolCallId?: string;
  /** Optional display name (e.g. the tool name for `tool` messages). */
  name?: string;
}

/** JSON-schema description of a tool the model may call. */
export interface AITool {
  name: string;
  description: string;
  /** JSON Schema for the tool's parameters. */
  parameters: Record<string, unknown>;
}

/** A tool invocation requested by the model. */
export interface AIToolCall {
  id: string;
  name: string;
  /** Raw JSON arguments as produced by the model. */
  arguments: string;
}

/** Options controlling a single completion request. */
export interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: AITool[];
  signal?: AbortSignal;
}

/** A full (non-streaming) completion request. */
export interface AICompletionRequest extends AICompletionOptions {
  messages: AIMessage[];
}

/** Token accounting returned by providers that report it. */
export interface AIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** The result of a non-streaming completion. */
export interface AICompletionResult {
  content: string;
  toolCalls: AIToolCall[];
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'error';
  usage?: AIUsage;
}

/** An incremental chunk emitted while streaming a completion. */
export interface AIStreamChunk {
  /** Text delta for this chunk, if any. */
  delta: string;
  /** A completed tool call, emitted once the model finishes producing it. */
  toolCall?: AIToolCall;
  done: boolean;
}

export type AIProviderName = 'edge-function' | 'openai' | 'anthropic' | 'gateway' | 'custom';

/** Provider configuration resolved from the environment. */
export interface AIProviderConfig {
  provider: AIProviderName;
  /**
   * Endpoint the browser talks to. For security this MUST be a server-side
   * proxy (e.g. a Supabase Edge Function or Vercel Function) that holds the
   * real model API keys — never a raw vendor endpoint with a client key.
   */
  endpoint: string;
  defaultModel: string;
}
