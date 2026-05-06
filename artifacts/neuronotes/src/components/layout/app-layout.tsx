import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Brain, LayoutDashboard, BookOpen, Trophy, CreditCard, Menu, X, ChevronRight, MessageSquare, ShieldCheck, BookMarked, Library, Wrench, Sparkles, Star, Beaker } from "lucide-react";
import { getOrCreateAnonymousUserId } from "@/lib/anonymous-user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STUDY_PALETTE } from "@/lib/study-theme";

type NavItem = { href: string; label: string; icon: React.ElementType };

// Shared glass tile styling for sidebar nav items — translucent surface
// with a soft teal glow on hover, mirroring the landing page chip styling.
const NAV_ITEM_BASE =
  "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border backdrop-blur-sm";
const NAV_ITEM_IDLE =
  "text-sidebar-foreground/85 bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-[color:var(--nav-glow)]/45 hover:text-white hover:shadow-[0_8px_24px_-12px_var(--nav-glow)]";
const NAV_ITEM_ACTIVE =
  "text-white bg-white/[0.10] border-[color:var(--nav-glow)]/55 shadow-[0_8px_24px_-10px_var(--nav-glow)]";

function navItemClass(isActive: boolean) {
  return cn(NAV_ITEM_BASE, isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE);
}

const studyNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/topics", label: "Topics", icon: BookOpen },
  { href: "/study-lab", label: "Study Lab", icon: Beaker },
  { href: "/brain-lab", label: "Brain Lab", icon: Brain },
  { href: "/progress", label: "Progress", icon: Trophy },
  { href: "/resources", label: "Resources", icon: Library },
];

const communityNav: NavItem[] = [
  { href: "/feature-request", label: "Be Featured", icon: Star },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

const accountNav: NavItem[] = [
  { href: "/subscription", label: "Upgrade", icon: CreditCard },
];

function useUserMeta() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScholar, setIsScholar] = useState(false);

  useEffect(() => {
    const headers = { "X-User-Id": getOrCreateAnonymousUserId() };

    fetch("/api/feedback/is-admin", { headers })
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.isAdmin ?? false))
      .catch(() => setIsAdmin(false));

    fetch("/api/subscription/status", { headers })
      .then((r) => r.json())
      .then((d) => setIsScholar(d.status === "scholar"))
      .catch(() => setIsScholar(false));
  }, []);

  return { isAdmin, isScholar };
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { isAdmin, isScholar } = useUserMeta();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 overflow-hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          // CSS var consumed by NAV_ITEM_* tokens for the teal hover glow.
          ["--nav-glow" as never]: STUDY_PALETTE.surf,
          background: "linear-gradient(180deg, #041A24 0%, #031923 100%)",
          borderRight: "1px solid rgba(94, 176, 200, 0.08)",
        }}
        data-testid="sidebar"
      >
        {/* Starry shimmer — same recipe as the Spotlight card */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 18% 12%, rgba(255,255,255,.85), transparent 60%), radial-gradient(1.2px 1.2px at 65% 8%, rgba(255,255,255,.7), transparent 60%), radial-gradient(1px 1px at 82% 28%, rgba(255,255,255,.6), transparent 60%), radial-gradient(1.4px 1.4px at 32% 52%, rgba(255,255,255,.45), transparent 60%), radial-gradient(1px 1px at 75% 68%, rgba(255,255,255,.5), transparent 60%), radial-gradient(1px 1px at 12% 76%, rgba(255,255,255,.45), transparent 60%), radial-gradient(1.2px 1.2px at 88% 90%, rgba(255,255,255,.55), transparent 60%), radial-gradient(0.8px 0.8px at 45% 22%, rgba(255,255,255,.5), transparent 60%), radial-gradient(0.8px 0.8px at 25% 38%, rgba(255,255,255,.4), transparent 60%), radial-gradient(1px 1px at 60% 80%, rgba(255,255,255,.4), transparent 60%)",
          }}
        />
        {/* Soft nebula glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-12 w-56 h-56 rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${STUDY_PALETTE.surf}33, transparent)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-12 w-56 h-56 rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${STUDY_PALETTE.teal}2e, transparent)` }}
        />

        <div className="relative flex items-center gap-2 p-4 border-b border-white/10">
          <Brain className="w-7 h-7 text-sidebar-primary flex-shrink-0" />
          <span className="text-white font-bold text-lg">PsychPro</span>
          <button
            className="ml-auto md:hidden text-white/80"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 pt-1 pb-1">
            <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Study</p>
          </div>
          {studyNav.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <div className={navItemClass(isActive)}>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
            );
          })}

          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Toolkit</p>
          </div>
          <Link
            href="/my-decks"
            onClick={() => setSidebarOpen(false)}
            data-testid="nav-my-decks"
          >
            <div
              className={navItemClass(
                location === "/my-decks" || (location.startsWith("/my-decks/") && location !== "/my-decks/new")
              )}
            >
              <BookMarked className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">My Tools</span>
              {!isScholar && (
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                  Pro
                </span>
              )}
              {isScholar && (location === "/my-decks" || (location.startsWith("/my-decks/") && location !== "/my-decks/new")) && <ChevronRight className="w-4 h-4 ml-auto" />}
            </div>
          </Link>
          <Link
            href="/my-decks/new?tier=standard"
            onClick={() => setSidebarOpen(false)}
            data-testid="nav-new-standard"
          >
            <div
              className={navItemClass(
                location === "/my-decks/new" && typeof window !== "undefined" && window.location.search.includes("tier=standard")
              )}
            >
              <Wrench className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Standard Tools</span>
              {!isScholar && (
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                  Pro
                </span>
              )}
            </div>
          </Link>
          <Link
            href="/my-decks/new?tier=pro"
            onClick={() => setSidebarOpen(false)}
            data-testid="nav-new-pro"
          >
            <div
              className={navItemClass(
                location === "/my-decks/new" && typeof window !== "undefined" && window.location.search.includes("tier=pro")
              )}
            >
              <Sparkles className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Pro Tools</span>
              {!isScholar && (
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                  Pro
                </span>
              )}
            </div>
          </Link>

          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Community</p>
          </div>
          {communityNav.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={navItemClass(isActive)}>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
            );
          })}

          {!isScholar && (
            <>
              <div className="px-3 pt-3 pb-1">
                <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Account</p>
              </div>
              {accountNav.map((item) => {
                const isActive = location === item.href || location.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <div className={navItemClass(isActive)}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </div>
                  </Link>
                );
              })}
            </>
          )}

          {isAdmin && (
            <>
              <div className="px-3 pt-3 pb-1">
                <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Admin</p>
              </div>
              <Link
                href="/admin/feedback"
                onClick={() => setSidebarOpen(false)}
                data-testid="nav-admin-feedback"
              >
                <div className={navItemClass(location === "/admin/feedback")}>
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Feedback Inbox</span>
                  {location === "/admin/feedback" && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
            </>
          )}
        </nav>

        <div className="relative p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold border"
              style={{
                background: `linear-gradient(135deg, ${STUDY_PALETTE.tealDeep}, ${STUDY_PALETTE.teal})`,
                borderColor: `${STUDY_PALETTE.surf}55`,
              }}
            >
              G
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                Guest
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            data-testid="menu-toggle"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Brain className="w-6 h-6 text-primary" />
          <span className="font-bold text-foreground">PsychPro</span>
        </header>

        <main className="flex-1 overflow-y-auto" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
