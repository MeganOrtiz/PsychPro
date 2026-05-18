import express, { Router, type Request, type Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { verifyBearerToken } from "../lib/adminTokens";
import { buildMcpServer } from "../lib/mcpServer";

const router = Router();

// `/api/mcp` accepts large study-guide payloads (schema allows ~200k chars),
// so we override the app-wide 100kb default just for this route.
const mcpJsonParser = express.json({ limit: "1mb" });

// Simple in-memory per-token rate limiter (60 requests / minute) with
// opportunistic cleanup so the map can't grow unboundedly across token
// rotations on a long-lived server.
const RATE_LIMIT = 60;
const WINDOW_MS = 60_000;
const hits = new Map<number, number[]>();
let lastSweep = 0;
function sweepStale(now: number): void {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  for (const [id, arr] of hits) {
    const fresh = arr.filter((t) => now - t < WINDOW_MS);
    if (fresh.length === 0) hits.delete(id);
    else if (fresh.length !== arr.length) hits.set(id, fresh);
  }
}
function rateLimited(tokenId: number): boolean {
  const now = Date.now();
  sweepStale(now);
  const arr = (hits.get(tokenId) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(tokenId, arr);
  return arr.length > RATE_LIMIT;
}

async function handleMcp(req: Request, res: Response): Promise<void> {
  const verified = await verifyBearerToken(req.header("authorization"));
  if (!verified) {
    res.status(401).json({
      jsonrpc: "2.0",
      error: { code: -32001, message: "Unauthorized: invalid or missing bearer token" },
      id: null,
    });
    return;
  }
  if (rateLimited(verified.tokenId)) {
    res.status(429).json({
      jsonrpc: "2.0",
      error: { code: -32002, message: "Rate limit exceeded (60 requests/min)" },
      id: null,
    });
    return;
  }

  // Stateless mode: build a fresh server + transport per request. Simpler than
  // tracking sessions, and the MCP write tools we expose are short-lived calls.
  const server = buildMcpServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => {
    transport.close().catch(() => undefined);
    server.close().catch(() => undefined);
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    req.log.error({ err }, "MCP request failed");
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal MCP error" },
        id: null,
      });
    }
  }
}

router.post("/mcp", mcpJsonParser, handleMcp);
router.get("/mcp", (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "GET not supported in stateless mode. Use POST." },
    id: null,
  });
});
router.delete("/mcp", (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "DELETE not supported in stateless mode." },
    id: null,
  });
});

export default router;
