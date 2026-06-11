import { useEffect, useState } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/brand/page-title";
import { authHeaders, jsonAuthHeaders } from "@/lib/auth-headers";

type Stats = {
  days: number;
  pending: number;
  accepted: number;
  declined: number;
  blocked: number;
  introEmailsSent: number;
  blocksRecorded: number;
};

const RANGES: Array<{ label: string; days: number }> = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

export default function AdminConnectionsPage() {
  const [range, setRange] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvestigate, setShowInvestigate] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/connections/stats?days=${range}`, {
          headers: await authHeaders(),
        });
        if (!res.ok) {
          toast.error(res.status === 403 ? "Admin access required" : `Couldn't load (error ${res.status})`);
          return;
        }
        const data = (await res.json()) as Stats;
        if (!cancelled) setStats(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [range]);

  async function submitAudit() {
    if (reason.trim().length < 10) {
      toast.error("Reason must be at least 10 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/connections/audit", {
        method: "POST",
        headers: await jsonAuthHeaders(),
        body: JSON.stringify({ reason: reason.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? `Couldn't log audit (error ${res.status})`);
        return;
      }
      toast.success("Audit reveal recorded. Contact engineering with the audit reference for details.");
      setReason("");
      setShowInvestigate(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="admin-connections-page">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        <PageTitle
          title="Connection Requests"
          icon={Shield}
          subtitle="Aggregate-only stats. Individual users and message content are not shown — and never should be — under normal moderation. Use Investigate abuse only when there is a credible safety concern; every reveal is audit-logged."
          className="mb-6"
        />

        <div className="flex gap-2 mb-6">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              className={`px-3 py-1.5 rounded-none text-sm font-medium border ${
                range === r.days
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
              data-testid={`range-${r.days}`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {loading || !stats ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatTile label="Requests sent" value={stats.pending + stats.accepted + stats.declined + stats.blocked} />
              <StatTile label="Accepted" value={stats.accepted} accent="text-emerald-300" />
              <StatTile label="Declined" value={stats.declined} accent="text-amber-300" />
              <StatTile label="Blocked" value={stats.blocked} accent="text-red-300" />
              <StatTile label="Pending" value={stats.pending} />
              <StatTile label="Intro emails sent" value={stats.introEmailsSent} accent="text-primary" />
              <StatTile label="Block-list adds" value={stats.blocksRecorded} accent="text-red-300" />
            </div>

            <div className="bg-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="font-semibold text-foreground">Investigate abuse</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Reveals identifying details for a specific request. This action is audit-logged
                with your reason. Only use when investigating a reported safety concern.
              </p>
              {!showInvestigate ? (
                <Button variant="outline" onClick={() => setShowInvestigate(true)} data-testid="button-show-investigate">
                  Start an investigation
                </Button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for this audit reveal (≥10 chars)…"
                    rows={3}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground resize-none"
                    data-testid="input-audit-reason"
                  />
                  <div className="flex gap-2">
                    <Button onClick={submitAudit} disabled={submitting} data-testid="button-submit-audit">
                      {submitting ? "Logging…" : "Log audit reveal"}
                    </Button>
                    <Button variant="outline" onClick={() => { setShowInvestigate(false); setReason(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="bg-card rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold ${accent ?? "text-foreground"}`}>{value.toLocaleString()}</p>
    </div>
  );
}
