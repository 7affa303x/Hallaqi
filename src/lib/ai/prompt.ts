/**
 * Prompt construction layer.
 *
 * Keeps prompt text out of business logic and gives the AI phase a single
 * place to version and compose system prompts and message histories.
 */
import type { AIMessage } from './types';

export interface PromptTemplateVars {
  [key: string]: string | number | boolean;
}

/** A named, versioned prompt template with `{{variable}}` interpolation. */
export class PromptTemplate {
  readonly id: string;
  private readonly template: string;

  constructor(id: string, template: string) {
    this.id = id;
    this.template = template;
  }

  render(vars: PromptTemplateVars = {}): string {
    return this.template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => {
      const value = vars[key];
      return value === undefined ? '' : String(value);
    });
  }
}

/** Build a conversation, optionally prefixed with a rendered system prompt. */
export function buildMessages(
  history: AIMessage[],
  systemPrompt?: string,
): AIMessage[] {
  if (!systemPrompt) return [...history];
  return [{ role: 'system', content: systemPrompt }, ...history];
}
