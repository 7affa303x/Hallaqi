/**
 * Context retrieval abstraction (RAG seam).
 *
 * Given a user query, a retriever returns snippets to inject into the prompt.
 * The AI phase can implement this against Supabase vector search, full-text
 * search, or an external index. The default retriever returns nothing so the
 * app behaves identically until retrieval is wired up.
 */

export interface RetrievedContext {
  id: string;
  content: string;
  /** Relevance score in [0, 1] when the backend provides one. */
  score?: number;
  source?: string;
}

export interface ContextRetriever {
  retrieve(query: string, limit?: number): Promise<RetrievedContext[]>;
}

/** No-op retriever used until a real context source is configured. */
export class NoopContextRetriever implements ContextRetriever {
  async retrieve(_query: string, _limit?: number): Promise<RetrievedContext[]> {
    return [];
  }
}
