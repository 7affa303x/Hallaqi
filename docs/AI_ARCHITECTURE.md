# Hallaqi — AI Integration Architecture

This document describes the AI seam prepared under `src/lib/ai/`. **No model is
called yet** — this is scaffolding so the AI implementation phase can plug in a
provider without touching application code or leaking secrets to the browser.

## Modules

| File | Responsibility |
|------|----------------|
| `types.ts` | Vendor-agnostic types: messages, tools, tool calls, requests, streaming chunks, provider config. |
| `config.ts` | Resolves config from `VITE_AI_*` env vars. `isAIConfigured()` / `getAIConfig()`. |
| `provider.ts` | `AIProvider` contract (`complete`, `stream`) + `AIProviderRegistry` for swappable providers. |
| `prompt.ts` | `PromptTemplate` (`{{var}}` interpolation) + `buildMessages()` for composing histories. |
| `memory.ts` | `ConversationMemory` interface + `InMemoryConversationMemory`. Back with Supabase `conversations`/`messages` in the AI phase. |
| `context.ts` | `ContextRetriever` (RAG seam) + `NoopContextRetriever` (default, returns nothing). |
| `mcp.ts` | `MCPClient` contract for tool discovery/invocation over MCP. |
| `client.ts` | `AIClient` orchestrating provider + prompt + memory + context; `createAIClient()`. |
| `index.ts` | Public barrel export. |
| `errors.ts` | `AINotConfiguredError`, `AIRequestError`. |

## Security model

The browser must **never** hold a model vendor API key. `AIProviderConfig.endpoint`
points at a **server-side proxy** (Supabase Edge Function or Vercel Function) that
holds the key and forwards requests. Until `VITE_AI_ENDPOINT` is set, the layer is
inert and `AIClient` throws `AINotConfiguredError` rather than fabricating output.

## Environment variables (add during the AI phase)

```
VITE_AI_ENDPOINT=   # URL of the server-side AI proxy (e.g. /functions/v1/ai-chat)
VITE_AI_PROVIDER=   # edge-function | openai | anthropic | gateway | custom
VITE_AI_MODEL=      # default model id, e.g. gpt-4o-mini
```

## Recommended implementation steps (AI phase)

1. Create a server-side proxy (Supabase Edge Function `ai-chat` or a Vercel
   Function) that reads the vendor key from a secret and streams responses.
2. Implement an `AIProvider` that POSTs `AICompletionRequest` to that endpoint
   and adapts the response/stream to `AICompletionResult` / `AIStreamChunk`.
3. `aiProviderRegistry.register(new EdgeFunctionProvider(getAIConfig()!))`.
4. Back `ConversationMemory` with the existing Supabase `conversations` /
   `messages` tables.
5. Implement `ContextRetriever` (Supabase full-text or `pgvector`) if RAG is needed.
6. Register MCP tools via an `MCPClient` implementation and pass them in
   `AICompletionOptions.tools`.

Nothing in this layer is imported by the app today, so it is fully tree-shaken
out of the production bundle and does not change current behavior.
