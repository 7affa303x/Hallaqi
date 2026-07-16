/**
 * AI integration layer — public surface.
 *
 * Vendor-agnostic scaffolding prepared ahead of the AI implementation phase.
 * Nothing here calls a model yet; providers are registered during that phase.
 * See `docs/AI_ARCHITECTURE.md` for the design and setup steps.
 */
export * from './types';
export * from './errors';
export * from './config';
export * from './provider';
export * from './prompt';
export * from './memory';
export * from './context';
export * from './mcp';
export * from './client';
