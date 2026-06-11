import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Bell, CheckCheck } from "lucide-react";
import { authHeaders } from "@/lib/auth-headers";
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";

type Notification = {
  id: number;
  kind: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

function relativeTime(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const sec = Math.max(0, Math.floor((now - t) / 1000));
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/notifications", {
        headers: await authHeaders(),
      });
      if (!res.ok) return;
      const data = (await res.json()) as Notification[];
      setItems(data);
    } catch {
      /* silent */
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function markRead(id: number) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
    );
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: await authHeaders(),
      });
    } catch {
      /* optimistic */
    }
  }

  async function markAllRead() {
    const unread = items.filter((n) => !n.readAt);
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    const headers = await authHeaders();
    await Promise.all(
      unread.map((n) =>
        fetch(`/api/notifications/${n.id}/read`, {
          method: "PATCH",
          headers,
        }).catch(() => null),
      ),
    );
  }

  const unreadCount = items.filter((n) => !n.readAt).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative w-10 h-10 rounded-md flex items-center justify-center transition-all hover:scale-105"
        style={{
          background: "rgba(12, 66, 84, 0.55)",
          border: "1px solid rgba(118, 228, 247, 0.28)",
          color: PALETTE.mist,
        }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        data-testid="notifications-bell"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: "#ef4444", color: "white" }}
            data-testid="notifications-badge"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 w-80 max-h-[70vh] overflow-y-auto rounded-2xl z-[60] shadow-2xl"
          style={{
            background: "rgba(12, 66, 84, 0.95)",
            border: "1px solid rgba(118, 228, 247, 0.28)",
            backdropFilter: "blur(20px) saturate(140%)",
          }}
          data-testid="notifications-dropdown"
        >
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: PALETTE.mist }}>
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                className="text-xs flex items-center gap-1 hover:underline"
                style={{ color: PALETTE.tealDeep }}
                onClick={markAllRead}
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="p-6 text-xs text-center" style={{ color: PALETTE.mistSoft }}>
              You're all caught up.
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {items.map((n) => {
                const inner = (
                  <div className={`p-3 hover:bg-white/[0.06] transition-all ${!n.readAt ? "bg-white/[0.04]" : ""}`}>
                    <div className="flex items-start gap-2">
                      {!n.readAt && (
                        <span
                          className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: PALETTE.teal }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium" style={{ color: PALETTE.mist }}>
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: PALETTE.mistSoft }}>
                            {n.body}
                          </p>
                        )}
                        <p className="text-[11px] mt-1" style={{ color: PALETTE.mistSoft }}>
                          {relativeTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link
                        href={n.href}
                        onClick={() => {
                          markRead(n.id);
                          setOpen(false);
                        }}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <button className="w-full text-left" onClick={() => markRead(n.id)}>
                        {inner}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
