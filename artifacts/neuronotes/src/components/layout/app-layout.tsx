import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Brain, LayoutDashboard, BookOpen, Trophy, CreditCard, Menu, X, ChevronRight, MessageSquare, ShieldCheck, BookMarked, Library, Wrench, Sparkles, Star, Beaker, Lightbulb, Users, Lock } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { authHeaders } from "@/lib/auth-headers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STUDY_PALETTE } from "@/lib/study-theme";
import smokeBg from "@/assets/bg/brain-clouds.png";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

// Shared glass tile styling for sidebar nav items — translucent surface
// with a soft teal glow on hover, mirroring the landing page chip styling.
// Sidebar nav tile — translucent glass surface with a layered teal glow on
// hover. We use two shadows: a tight inner highlight (inset white) so the
// pill reads as actual glass, plus a generous outer drop-shadow tinted with
// --nav-glow so the whole row lifts off the dark sidebar. The active state
// is the same recipe at a slightly higher intensity.
const NAV_ITEM_BASE =
  "nav-glass group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 border backdrop-blur-xl";
const NAV_ITEM_IDLE =
  "nav-glass-idle bg-white/[0.12] text-sidebar-foreground/90 border-[color:var(--nav-glow)]/35 " +
  "shadow-[0_6px_18px_-12px_var(--nav-glow),inset_0_1px_0_0_rgba(255,255,255,0.18)] " +
  "hover:bg-white/[0.20] hover:border-[color:var(--nav-glow)]/70 hover:text-white " +
  "hover:shadow-[0_12px_32px_-10px_var(--nav-glow),inset_0_1px_0_0_rgba(255,255,255,0.24)] " +
  "active:bg-white/[0.24] active:border-[color:var(--nav-glow)]/80 " +
  "active:shadow-[0_14px_36px_-8px_var(--nav-glow),inset_0_1px_0_0_rgba(255,255,255,0.26)]";
const NAV_ITEM_ACTIVE =
  "nav-glass-active bg-white/[0.22] text-white border-[color:var(--nav-glow)]/75 " +
  "shadow-[0_12px_32px_-10px_var(--nav-glow),inset_0_1px_0_0_rgba(255,255,255,0.26)]";

function navItemClass(isActive: boolean) {
  return cn(NAV_ITEM_BASE, isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE);
}

// Sidebar IA (updated 2026-05-25 per new landing/dashboard spec):
// STUDY / TOOLKIT / COMMUNITY / ADMIN.
// "Study Lab" and "Brain Lab" page titles are old internal names; routes
// are preserved here but the surface labels follow the new spec. The PRO
// tags on Standard Tools / Pro Tools live under TOOLKIT.
const workshopNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/topics", label: "Courses", icon: BookOpen },
  { href: "/study-lab", label: "Study Lab", icon: Beaker },
  { href: "/brain-lab", label: "Brain Lab", icon: Brain },
  { href: "/progress", label: "Progress", icon: Trophy },
  { href: "/resources", label: "Resources", icon: Library },
];

const labNav: NavItem[] = [
  { href: "/reflections", label: "Reflections", icon: Lightbulb },
];

const studioNav: NavItem[] = [
  { href: "/featured-work", label: "Featured Work", icon: Star },
];

const connectNav: NavItem[] = [
  { href: "/connections", label: "Connections", icon: Users },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

type ProfileSummary = {
  displayName: string | null;
  profilePhotoUrl: string | null;
};

function profileInitials(name: string | null | undefined): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "G";
  const parts = trimmed.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "G";
}

function profilePhotoSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `/api/storage${path}`;
  return path;
}

function useProfileSummary(): ProfileSummary {
  const [summary, setSummary] = useState<ProfileSummary>({ displayName: null, profilePhotoUrl: null });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/profile/me", {
          headers: await authHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setSummary({
          displayName: typeof data?.displayName === "string" ? data.displayName : null,
          profilePhotoUrl: typeof data?.profilePhotoUrl === "string" ? data.profilePhotoUrl : null,
        });
      } catch {
        /* silent — sidebar falls back to Guest */
      }
    }
    load();
    function onUpdated() { load(); }
    window.addEventListener("psychpro:profile-updated", onUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener("psychpro:profile-updated", onUpdated);
    };
  }, []);

  return summary;
}

const accountNav: NavItem[] = [
  { href: "/subscription", label: "Upgrade", icon: CreditCard },
];

function useUserMeta() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScholar, setIsScholar] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const headers = await authHeaders();
      if (cancelled) return;

      fetch("/api/feedback/is-admin", { headers })
        .then((r) => r.json())
        .then((d) => { if (!cancelled) setIsAdmin(d.isAdmin ?? false); })
        .catch(() => { if (!cancelled) setIsAdmin(false); });

      fetch("/api/subscription/status", { headers })
        .then((r) => r.json())
        .then((d) => { if (!cancelled) setIsScholar(d.tier === "scholar"); })
        .catch(() => { if (!cancelled) setIsScholar(false); });
    })();
    return () => { cancelled = true; };
  }, []);

  return { isAdmin, isScholar };
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  // Reactive query-string read. Wouter's `useLocation` returns pathname
  // only, so the previous `window.location.search` read at render time was
  // never reactive — clicking from Standard Tools → Pro Tools wouldn't
  // update the active highlight until a hard reload. `useSearch` re-renders
  // on every URL change.
  const search = useSearch();
  const currentTier = new URLSearchParams(search).get("tier");
  const { isAdmin, isScholar } = useUserMeta();

  // Active flags for the three Tools entries. Computed once so the JSX
  // below stays readable and we don't repeat the path/tier logic inline.
  const isOnMyDecksList =
    location === "/my-decks" ||
    (location.startsWith("/my-decks/") && !location.startsWith("/my-decks/new"));
  const isOnStandardTools = location === "/my-decks/new" && currentTier !== "pro";
  const isOnProTools = location === "/my-decks/new" && currentTier === "pro";

  return (
    <div className="study-page-bg flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 overflow-hidden m-4 rounded-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          // CSS var consumed by NAV_ITEM_* tokens for the teal hover glow.
          ["--nav-glow" as never]: STUDY_PALETTE.surf,
          // Match the Spotlight card's backdrop: the same brain-clouds smoke
          // image painted inside with a dark gradient overlay, over the
          // StudySurface "dark" base gradient — so the smoky cloud continuum
          // bleeds through the sidebar exactly like it does through the card.
          background: `linear-gradient(180deg, rgba(2,13,18,0.35) 0%, rgba(2,13,18,0.55) 55%, rgba(2,13,18,0.8) 100%), url(${smokeBg}), linear-gradient(180deg, ${STUDY_PALETTE.surfaceElev}, ${STUDY_PALETTE.surface})`,
          backgroundSize: "cover, cover, cover",
          backgroundPosition: "center, center, center",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          border: `1px solid ${STUDY_PALETTE.surf}55`,
          boxShadow: `0 20px 60px -20px ${STUDY_PALETTE.teal}77`,
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

        {/* Brand wordmark intentionally removed from the sidebar — the
            canonical PSYCHPRO title now lives centered on the page (dashboard
            BrandBanner / PageTitle), so a second top-left logo was redundant.
            We keep a slim top bar so the mobile close button still has a home
            and the nav gets a little breathing room on desktop. */}
        <div className="relative flex items-center justify-end px-4 pt-4 pb-1">
          <button
            className="md:hidden text-white/80"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 pt-1 pb-1">
            <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Study</p>
          </div>
          {workshopNav.map((item) => {
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

          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Toolkit</p>
          </div>
          {labNav.map((item) => {
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
          <ToolsStudio
            isScholar={isScholar}
            isOnMyDecksList={isOnMyDecksList}
            isOnStandardTools={isOnStandardTools}
            isOnProTools={isOnProTools}
            onNavigate={() => setSidebarOpen(false)}
          />

          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Community</p>
          </div>
          {studioNav.map((item) => {
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
          {connectNav.map((item) => {
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
              <Link
                href="/admin/featured-work"
                onClick={() => setSidebarOpen(false)}
                data-testid="nav-admin-featured-work"
              >
                <div className={navItemClass(location === "/admin/featured-work")}>
                  <Star className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Featured Work</span>
                  {location === "/admin/featured-work" && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
              <Link
                href="/admin/connections"
                onClick={() => setSidebarOpen(false)}
                data-testid="nav-admin-connections"
              >
                <div className={navItemClass(location === "/admin/connections")}>
                  <Users className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Connection Requests</span>
                  {location === "/admin/connections" && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
            </>
          )}
        </nav>

        <SidebarProfileLink onNavigate={() => setSidebarOpen(false)} />
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
          <div className="ml-auto">
            <UserButton afterSignOutUrl={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"} />
          </div>
        </header>

        {/* Desktop top bar: Clerk UserButton lives in the top-right so users
            can manage their account and sign out from any page. */}
        <header className="hidden md:flex items-center justify-end px-6 py-2 border-b border-white/5">
          <UserButton
            afterSignOutUrl={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </header>

        <main className="flex-1 overflow-y-auto" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ToolsStudio — single bordered "studio" tile that groups the three deck-
// builder entries (My Tools / Standard Tools / Pro Tools). Each row gets a
// tier-color dot on the left edge instead of a repeated "Pro" pill, and the
// whole card shows ONE consolidated lock when the user isn't on Scholar.
// Keeps the sidebar feeling editorial instead of bullet-list-of-CTAs.
// ---------------------------------------------------------------------------
function ToolsStudio({
  isScholar,
  isOnMyDecksList,
  isOnStandardTools,
  isOnProTools,
  onNavigate,
}: {
  isScholar: boolean;
  isOnMyDecksList: boolean;
  isOnStandardTools: boolean;
  isOnProTools: boolean;
  onNavigate: () => void;
}) {
  const anyActive = isOnMyDecksList || isOnStandardTools || isOnProTools;
  type Tier = {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    dot: string;
    isActive: boolean;
    testId: string;
  };
  const tiers: Tier[] = [
    {
      href: "/my-decks",
      label: "My Tools",
      icon: BookMarked,
      dot: STUDY_PALETTE.surf,
      isActive: isOnMyDecksList,
      testId: "nav-my-tools",
    },
    {
      href: "/my-decks/new?tier=standard",
      label: "Standard Tools",
      icon: Wrench,
      dot: STUDY_PALETTE.teal,
      isActive: isOnStandardTools,
      testId: "nav-standard-tools",
    },
    {
      href: "/my-decks/new?tier=pro",
      label: "Pro Tools",
      icon: Sparkles,
      dot: STUDY_PALETTE.tealDeep,
      isActive: isOnProTools,
      testId: "nav-pro-tools",
    },
  ];

  return (
    <div
      className={cn(
        "relative mt-1 rounded-xl border backdrop-blur-md p-1.5 transition-all",
        anyActive
          ? "bg-white/[0.08] border-[color:var(--nav-glow)]/45 shadow-[0_10px_30px_-12px_var(--nav-glow),inset_0_1px_0_0_rgba(255,255,255,0.10)]"
          : "bg-white/[0.04] border-white/10 hover:border-[color:var(--nav-glow)]/35",
      )}
    >
      <div className="flex items-center justify-between px-2 pt-1 pb-1.5">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/55">
          Tools Studio
        </p>
        {!isScholar && (
          <span
            className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/15"
            title="Upgrade to Scholar to unlock all tools"
          >
            <Lock className="w-2.5 h-2.5" />
            Pro
          </span>
        )}
      </div>
      <div className="space-y-1">
        {tiers.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              onClick={onNavigate}
              data-testid={t.testId}
            >
              <div
                className={cn(
                  "group relative flex items-center gap-3 pl-3 pr-2 py-2 rounded-lg cursor-pointer transition-all border",
                  t.isActive
                    ? "bg-white/[0.10] border-[color:var(--nav-glow)]/55 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                    : "bg-white/[0.02] border-white/[0.06] text-white/80 hover:bg-white/[0.08] hover:text-white hover:border-[color:var(--nav-glow)]/40",
                )}
              >
                {/* Tier color dot — left edge accent */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{
                    background: t.dot,
                    boxShadow: t.isActive ? `0 0 10px ${t.dot}` : "none",
                  }}
                />
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{t.label}</span>
                {t.isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SidebarProfileLink({ onNavigate }: { onNavigate: () => void }) {
  const [location] = useLocation();
  const { displayName, profilePhotoUrl } = useProfileSummary();
  const photoUrl = profilePhotoSrc(profilePhotoUrl);
  const isActive = location === "/profile";
  const name = (displayName ?? "").trim() || "Guest";

  return (
    <div className="relative p-4 border-t border-white/10 z-10">
      <Link href="/profile" onClick={onNavigate} data-testid="nav-profile">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 border transition-colors cursor-pointer",
            isActive
              ? "bg-white/[0.08] border-[color:var(--nav-glow)]/55 shadow-[0_8px_24px_-10px_var(--nav-glow)]"
              : "bg-white/[0.03] border-white/8 hover:bg-white/[0.07] hover:border-[color:var(--nav-glow)]/45",
          )}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-9 h-9 rounded-full object-cover border"
              style={{ borderColor: `${STUDY_PALETTE.surf}55` }}
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold border flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${STUDY_PALETTE.tealDeep}, ${STUDY_PALETTE.teal})`,
                borderColor: `${STUDY_PALETTE.surf}55`,
              }}
            >
              {profileInitials(displayName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate" data-testid="text-sidebar-display-name">
              {name}
            </p>
            <p className="text-white/55 text-xs truncate">View profile</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
