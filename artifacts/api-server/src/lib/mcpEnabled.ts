/**
 * Decide whether MCP + OAuth routes should be served by this instance.
 *
 * Default: MCP is **on** so the existing Claude Desktop / Claude.ai
 * connectors keep working without any new env var. Set `MCP_ENABLED=false`
 * (or `0` / `off` / `no`) on a deployment that does not need the integration
 * to take the route + discovery endpoint offline entirely — the SPA still
 * loads, but `/api/mcp`, `/api/oauth/*`, and the root
 * `/.well-known/oauth-authorization-server` will return 404.
 *
 * Read once at module load so callers can branch synchronously when wiring
 * routes / discovery handlers. Invalid values fail fast at startup.
 */
export function isMcpEnabled(): boolean {
  const raw = process.env.MCP_ENABLED;
  if (raw === undefined || raw.trim() === "") return true;
  const v = raw.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(v)) return true;
  if (["0", "false", "no", "off"].includes(v)) return false;
  throw new Error(
    `Invalid MCP_ENABLED env value: ${JSON.stringify(raw)} (expected 1/0/true/false/yes/no/on/off)`,
  );
}

export const MCP_ENABLED: boolean = isMcpEnabled();
