import { useEffect, useState } from "react";
import { Copy, KeyRound, Trash2, Plus, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getOrCreateAnonymousUserId } from "@/lib/anonymous-user";

type TokenRow = {
  id: number;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
};

type OwnerStatus = {
  callerUserId: string | null;
  ownerConfigured: boolean;
  callerIsOwner: boolean;
};

function authHeaders() {
  return { "X-User-Id": getOrCreateAnonymousUserId() };
}

export default function AdminTokensPage() {
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("Claude Desktop");
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState<{ token: string; label: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [mcpUrl, setMcpUrl] = useState("");
  const [owner, setOwner] = useState<OwnerStatus | null>(null);
  const [myUserId, setMyUserId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMcpUrl(`${window.location.origin}/api/mcp`);
      setMyUserId(getOrCreateAnonymousUserId());
    }
  }, []);

  async function loadOwner() {
    try {
      const res = await fetch("/api/admin/owner-status", { headers: authHeaders() });
      if (res.ok) setOwner(await res.json());
    } catch { /* ignore */ }
  }

  async function loadTokens() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tokens", { headers: authHeaders() });
      if (res.status === 401 || res.status === 403 || res.status === 503) {
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
    loadOwner();
    loadTokens();
  }, []);

  async function createOne() {
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/tokens", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim() || "Claude Desktop" }),
      });
      if (res.status === 503) {
        toast.error("Set OWNER_USER_ID env var first");
        return;
      }
      if (res.status === 403) {
        toast.error("Only the configured owner can create tokens");
        return;
      }
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setJustCreated({ token: data.token, label: data.label });
      setCopied(false);
      await loadTokens();
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
      await loadTokens();
    } catch {
      toast.error("Couldn't revoke token");
    }
  }

  function copy(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setter(false), 2000);
    });
  }

  const canMintTokens = owner?.ownerConfigured && owner?.callerIsOwner;
  const needsOwnerConfig = owner && !owner.ownerConfigured;
  const wrongUser = owner && owner.ownerConfigured && !owner.callerIsOwner;

  return (
    <div className="min-h-full study-page-bg">
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <KeyRound className="w-6 h-6 text-cyan-300" />
          <h1 className="text-2xl md:text-3xl font-semibold">Claude MCP Tokens</h1>
        </div>

        {needsOwnerConfig && (
          <div className="rounded-xl border border-amber-300/40 bg-amber-300/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-100 font-medium">
              <AlertTriangle className="w-4 h-4" /> One-time setup required
            </div>
            <p className="text-sm text-white/80">
              No owner is configured yet. Set the <code className="px-1 py-0.5 rounded bg-black/40 text-amber-200 text-xs">OWNER_USER_ID</code> environment variable on the server to your user id below, then restart the API server.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all px-3 py-2 rounded bg-black/40 text-amber-200 text-xs">{myUserId}</code>
              <Button size="sm" variant="secondary" onClick={() => copy(myUserId, setCopiedId)}>
                {copiedId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {wrongUser && (
          <div className="rounded-xl border border-red-300/40 bg-red-300/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-red-100 font-medium">
              <AlertTriangle className="w-4 h-4" /> Not the owner
            </div>
            <p className="text-sm text-white/80">
              An owner is already configured and your user id does not match. Sign in from the owner's browser to manage tokens.
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
            <li>Auth: <span className="text-white/90">Bearer Token</span>, paste your token.</li>
            <li>Save and restart Claude Desktop. The PsychPro tools will appear in any chat.</li>
          </ol>
        </div>

        {justCreated && (
          <div className="rounded-xl border border-cyan-300/40 bg-cyan-300/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-cyan-100">New token: {justCreated.label}</div>
              <button
                onClick={() => setJustCreated(null)}
                className="text-xs text-white/60 hover:text-white"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-white/70">
              Copy this now — for security, the full token will never be shown again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all px-3 py-2 rounded bg-black/40 text-cyan-200 text-xs">
                {justCreated.token}
              </code>
              <Button size="sm" variant="secondary" onClick={() => copy(justCreated.token, setCopied)}>
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
              disabled={!canMintTokens}
            />
            <Button onClick={createOne} disabled={creating || !canMintTokens}>
              <Plus className="w-4 h-4 mr-1" />
              {creating ? "Creating…" : "Create"}
            </Button>
          </div>
          {!canMintTokens && (
            <p className="text-xs text-white/55">Token creation is locked until the owner is configured and you're signed in as them.</p>
          )}
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
