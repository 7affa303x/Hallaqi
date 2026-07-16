/** Errors surfaced by the AI layer. */

/** Thrown when an AI operation is attempted before a provider is configured. */
export class AINotConfiguredError extends Error {
  constructor() {
    super('AI provider is not configured. Set VITE_AI_ENDPOINT to enable AI features.');
    this.name = 'AINotConfiguredError';
  }
}

/** Thrown when the AI proxy responds with a non-successful status. */
export class AIRequestError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'AIRequestError';
    this.status = status;
  }
}
