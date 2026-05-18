import { useEffect, useState } from "react";
import { Copy, KeyRound, Trash2, Plus, Check, AlertTriangle, Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type TokenRow = {
  id: number;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
};

const SECRET_STORAGE_KEY = "psychpro_admin_secret";

function getStoredSecret(): string {
  try {
    return sessionStorage.getItem(SECRET_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function setStoredSecret(value: string) {
  try {
    if (value) sessionStorage.setItem(SECRET_STORAGE_KEY, value);
    else sessionStorage.removeItem(SECRET_STORAGE_KEY);
  } catch { /* ignore */ }
}

export default function AdminTokensPage() {
  const [secret, setSecret] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [serverConfigured, setServerConfigured] = useState<boolean | null>(null);
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("Claude Desktop");
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState<{ token: string; label: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [mcpUrl, setMcpUrl] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMcpUrl(`${window.location.origin}/api/mcp`);
      setSecret(getStoredSecret());
    }
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((d) => setServerConfigured(Boolean(d.secretConfigured)))
      .catch(() => setServerConfigured(false));
  }, []);

  function authHeaders(): Record<string, string> {
    return secret ? { Authorization: `Bearer ${secret}` } : {};
  }

  async function loadTokens(currentSecret: string) {
    if (!currentSecret) return;
    setLoading(true);
    setUnauthorized(false);
    try {
      const res = await fetch("/api/admin/tokens", {
        headers: { Authorization: `Bearer ${currentSecret}` },
      });
      if (res.status === 401) {
        setUnauthorized(true);
        setTokens([]);
        return;
      }
      if (!res.ok) throw new Error("Failed");
      setTokens(await res.json());
    } catch {
      toast.error("Couldn't load tokens");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (secret) loadTokens(secret);
  }, [secret]);

  function unlock() {
    const trimmed = secretInput.trim();
    if (trimmed.length < 16) {
      toast.error("Secret must be at least 16 characters");
      return;
    }
    setSecret(trimmed);
    setStoredSecret(trimmed);
    setSecretInput("");
  }

  function lock() {
    setSecret("");
    setStoredSecret("");
    setTokens([]);
    setJustCreated(null);
    setUnauthorized(false);
  }

  async function createOne() {
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/tokens", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim() || "Claude Desktop" }),
      });
      if (res.status === 401) {
        setUnauthorized(true);
        toast.error("Invalid admin secret");
        return;
      }
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setJustCreated({ token: data.token, label: data.label });
      setCopied(false);
      await loadTokens(secret);
    } catch {
      toast.error("Couldn't create token");
    } finally {
      setCreating(false);
    }
  }

  async function revoke(id: number) {
    if (!confirm("Revoke this token? Any Claude connection using it will stop working immediately.")) return;
    try {
      const res = await fetch(`/api/admin/tokens/${id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error("Failed");
      toast.success("Token revoked");
      await loadTokens(secret);
    } catch {
      toast.error("Couldn't revoke token");
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // === Render branches ===

  if (serverConfigured === false) {
    return (
      <div className="min-h-full study-page-bg">
        <div className="max-w-2xl mx-auto p-8">
          <div className="rounded-xl border border-amber-300/40 bg-amber-300/5 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-100 font-medium">
              <AlertTriangle className="w-4 h-4" /> Server not configured
            </div>
            <p className="text-sm text-white/80">
              Set the <code className="px-1 py-0.5 rounded bg-black/40 text-amber-200 text-xs">MCP_ADMIN_SECRET</code> environment variable on the API server (at least 16 characters) and restart it. Then refresh this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!secret) {
    return (
      <div className="min-h-full study-page-bg">
        <div className="max-w-md mx-auto p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-cyan-300" />
            <h1 className="text-2xl font-semibold">Unlock Admin</h1>
          </div>
          <p className="text-sm text-white/70">
            Enter your <code className="px-1 rounded bg-black/40 text-cyan-200 text-xs">MCP_ADMIN_SECRET</code> to manage Claude tokens. It's kept only in this browser tab's session storage.
          </p>
          <div className="space-y-2">
            <Input
              type="password"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") unlock(); }}
              placeholder="Admin secret"
              className="bg-white/5 border-white/10"
              autoFocus
            />
            <Button onClick={unlock} className="w-full">Unlock</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full study-page-bg">
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KeyRound className="w-6 h-6 text-cyan-300" />
            <h1 className="text-2xl md:text-3xl font-semibold">Claude MCP Tokens</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={lock}>
            <LogOut className="w-4 h-4 mr-1" /> Lock
          </Button>
        </div>

        {unauthorized && (
          <div className="rounded-xl border border-red-300/40 bg-red-300/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-red-100 font-medium">
              <AlertTriangle className="w-4 h-4" /> Invalid admin secret
            </div>
            <p className="text-sm text-white/80">
              The secret you entered doesn't match what the server expects. Click <b>Lock</b> above and try again.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 space-y-3">
          <h2 className="font-medium text-white/90">How to connect Claude Desktop</h2>
          <ol className="text-sm text-white/75 list-decimal pl-5 space-y-2">
            <li>Create a token below and copy it (you'll only see it once).</li>
            <li>In Claude Desktop: <span className="text-white/90">Settings → Connectors → Add custom connector</span>.</li>
            <li>
              Server URL:
              <code className="ml-2 px-2 py-0.5 rounded bg-black/40 text-cyan-200 text-xs">{mcpUrl || ".../api/mcp"}</code>
            </li>
            <li>Auth: <span className="text-white/90">Bearer Token</span>, paste the token (the long string starting with <code className="text-cyan-200">ppmcp_</code>).</li>
            <li>Save and restart Claude Desktop. PsychPro tools will appear in any chat.</li>
          </ol>
        </div>

        {justCreated && (
          <div className="rounded-xl border border-cyan-300/40 bg-cyan-300/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-cyan-100">New token: {justCreated.label}</div>
              <button onClick={() => setJustCreated(null)} className="text-xs text-white/60 hover:text-white">
                Dismiss
              </button>
            </div>
            <p className="text-xs text-white/70">Copy this now — for security, the full token will never be shown again.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all px-3 py-2 rounded bg-black/40 text-cyan-200 text-xs">
                {justCreated.token}
              </code>
              <Button size="sm" variant="secondary" onClick={() => copyText(justCreated.token)}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 space-y-3">
          <h2 className="font-medium text-white/90">Create a new token</h2>
          <div className="flex gap-2">
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label (e.g. Claude Desktop)"
              className="bg-white/5 border-white/10"
              maxLength={80}
            />
            <Button onClick={createOne} disabled={creating || unauthorized}>
              <Plus className="w-4 h-4 mr-1" />
              {creating ? "Creating…" : "Create"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5">
          <h2 className="font-medium text-white/90 mb-3">Your tokens</h2>
          {loading ? (
            <p className="text-sm text-white/60">Loading…</p>
          ) : tokens.length === 0 ? (
            <p className="text-sm text-white/60">No tokens yet.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {tokens.map((t) => (
                <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-white/90 truncate">{t.label}</div>
                    <div className="text-xs text-white/50">
                      Created {new Date(t.createdAt).toLocaleString()} ·{" "}
                      {t.lastUsedAt
                        ? `Last used ${new Date(t.lastUsedAt).toLocaleString()}`
                        : "Never used"}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => revoke(t.id)} className="text-red-300 hover:text-red-200 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
