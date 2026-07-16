/**
 * Model Context Protocol (MCP) client abstraction.
 *
 * Defines how the AI layer discovers and invokes MCP tools without binding to
 * a specific MCP transport. The AI phase supplies a concrete client (e.g. over
 * an edge-function proxy) and registers its tools with the provider request.
 */
import type { AITool } from './types';

export interface MCPToolResult {
  /** Serialized tool output returned to the model. */
  content: string;
  isError: boolean;
}

export interface MCPClient {
  /** List the tools exposed by the connected MCP server(s). */
  listTools(): Promise<AITool[]>;
  /** Invoke a tool by name with JSON-serializable arguments. */
  callTool(name: string, args: Record<string, unknown>): Promise<MCPToolResult>;
}
