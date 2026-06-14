import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Brain, LayoutDashboard, BookOpen, Trophy, CreditCard, Menu, X, ChevronRight, MessageSquare, ShieldCheck, BookMarked, Library, Wrench, Sparkles, Star, Beaker, Lightbulb, Users, GraduationCap } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { NotificationsBell } from "@/components/notifications-bell";
import { authHeaders } from "@/lib/auth-headers";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STUDY_PALETTE } from "@/lib/study-theme";
import smokeBg from "@/assets/bg/nebula-cerulean.png";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

// Sidebar nav tile — compact luminous dark-glass pill (2026-06 spec). Layout
// (size, padding, radius, blur) lives in the tokens here; the surface color,
// border, outer glow, and the glowing active left-bar live in the
// .nav-glass-* rules in index.css. Idle text is muted icy-blue and brightens
// to luminous cyan (#A7F3FF) on hover/active.
const NAV_ITEM_BASE =
  "nav-glass group relative flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ease-in-out border backdrop-blur-md";
const NAV_ITEM_IDLE = "nav-glass-idle text-[#B9D2DA] hover:text-[#A7F3FF]";
const NAV_ITEM_ACTIVE = "nav-glass-active text-[#A7F3FF]";

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
  // One NotificationsBell at a time: the mobile and desktop headers both live
  // in the DOM (toggled by CSS), so gate the bell by breakpoint to avoid two
  // instances mounting and double-polling /api/notifications.
  const isMobile = useIsMobile();
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
    <div className="study-page-bg flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 md:sticky md:top-4 md:bottom-auto md:self-start md:h-[calc(100vh-2rem)] md:translate-x-0 overflow-hidden m-4 rounded-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          // CSS var consumed by NAV_ITEM_* tokens for the teal hover glow.
          ["--nav-glow" as never]: STUDY_PALETTE.surf,
          // Match the Spotlight card's backdrop: the same nebula smoke
          // image painted inside with a dark gradient overlay, over the
          // StudySurface "dark" base gradient — so the smoky cloud continuum
          // bleeds through the sidebar exactly like it does through the card.
          background: `linear-gradient(180deg, hsl(var(--surf-hue) 75% 14% / 0.26) 0%, hsl(var(--surf-hue) 75% 14% / 0.44) 55%, hsl(var(--surf-hue) 75% 14% / 0.66) 100%), url(${smokeBg}), linear-gradient(180deg, ${STUDY_PALETTE.surfaceElev}, ${STUDY_PALETTE.surface})`,
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

        {/* Brand header — mirrors the EPPP suite sidebar wordmark (icon box +
            word + eyebrow) so the main workspace carries a matching identity at
            the top of the column. "learn. connect. expand." echoes the three
            primary nav groups (Learn / Connect / Expand). */}
        <div className="relative flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-[11px]">
            <span
              className="inline-flex items-center justify-center w-9 h-9 flex-shrink-0 rounded-[11px]"
              style={{
                background: "rgba(118,228,247,0.09)",
                border: "1px solid rgba(118,228,247,0.27)",
                color: "#76E4F7",
                boxShadow: "0 0 18px -4px rgba(118,228,247,0.5)",
              }}
            >
              <Brain className="w-[18px] h-[18px]" />
            </span>
            <span className="flex flex-col leading-none">
              <span
                className="text-[18px] font-light"
                style={{
                  fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
                  letterSpacing: "0.22em",
                  paddingLeft: "0.22em",
                  color: "#F4FBFF",
                  textShadow: "0 0 18px rgba(118,228,247,0.23)",
                }}
              >
                PSYCHPRO
              </span>
              <span
                className="mt-[5px] text-[10px] font-bold uppercase whitespace-nowrap"
                style={{ letterSpacing: "0.1em", color: "#A7F3FF" }}
              >
                learn. connect. expand.
              </span>
            </span>
          </div>
          <button
            className="md:hidden text-white/80 mt-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 pt-1 pb-1">
            <p className="text-[11px] font-semibold text-[#94B8C2]/60 uppercase tracking-[1.2px]">Learn</p>
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
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
            );
          })}

          <div className="px-3 pt-4 pb-1">
            <p className="text-[11px] font-semibold text-[#94B8C2]/60 uppercase tracking-[1.2px]">Expand</p>
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
                  <item.icon className="w-4 h-4 flex-shrink-0" />
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

          <div className="px-3 pt-4 pb-1">
            <p className="text-[11px] font-semibold text-[#94B8C2]/60 uppercase tracking-[1.2px]">Connect</p>
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
                  <item.icon className="w-4 h-4 flex-shrink-0" />
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
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
            );
          })}

          {!isScholar && (
            <>
              <div className="px-3 pt-4 pb-1">
                <p className="text-[11px] font-semibold text-[#94B8C2]/60 uppercase tracking-[1.2px]">Account</p>
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
                      <item.icon className="w-4 h-4 flex-shrink-0" />
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
              <div className="px-3 pt-4 pb-1">
                <p className="text-[11px] font-semibold text-[#94B8C2]/60 uppercase tracking-[1.2px]">Admin</p>
              </div>
              <Link
                href="/admin/feedback"
                onClick={() => setSidebarOpen(false)}
                data-testid="nav-admin-feedback"
              >
                <div className={navItemClass(location === "/admin/feedback")}>
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
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
                  <Star className="w-4 h-4 flex-shrink-0" />
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
                  <Users className="w-4 h-4 flex-shrink-0" />
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
          <div className="ml-auto flex items-center gap-2.5">
            <Link
              href="/eppp/suite"
              className="eppp-launch-btn eppp-launch-btn--compact"
              data-testid="eppp-launch-mobile"
              aria-label="EPPP Mastery Suite"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="eppp-launch-btn__inner">
                <GraduationCap aria-hidden />
                <span>EPPP</span>
              </span>
            </Link>
            {isMobile && <NotificationsBell />}
            <UserButton afterSignOutUrl={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"} />
          </div>
        </header>

        {/* Desktop top bar: unified right-side cluster — the notifications
            bell sits next to the Clerk UserButton so account + alerts read as
            one consistent control group on every page. */}
        <header className="hidden md:flex items-center justify-end gap-3 px-6 py-3">
          <Link
            href="/eppp/suite"
            className="eppp-launch-btn"
            data-testid="eppp-launch-desktop"
          >
            <span className="eppp-launch-btn__inner">
              <GraduationCap aria-hidden />
              <span>EPPP Mastery Suite</span>
            </span>
          </Link>
          {!isMobile && <NotificationsBell />}
          <UserButton
            afterSignOutUrl={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 rounded-full ring-1 ring-[#76E4F7]/40",
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
// ToolsStudio — labeled group of the three deck-builder entries (My Tools /
// Standard Tools / Pro Tools). Rows share the same compact luminous glass
// treatment as the rest of the nav (navItemClass) and show a right-aligned
// "PRO" badge when the user isn't on Scholar.
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
  type Tier = {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    testId: string;
  };
  const tiers: Tier[] = [
    {
      href: "/my-decks",
      label: "My Tools",
      icon: BookMarked,
      isActive: isOnMyDecksList,
      testId: "nav-my-tools",
    },
    {
      href: "/my-decks/new?tier=standard",
      label: "Standard Tools",
      icon: Wrench,
      isActive: isOnStandardTools,
      testId: "nav-standard-tools",
    },
    {
      href: "/my-decks/new?tier=pro",
      label: "Pro Tools",
      icon: Sparkles,
      isActive: isOnProTools,
      testId: "nav-pro-tools",
    },
  ];

  return (
    <div className="relative mt-1">
      <div className="px-3 pt-4 pb-1">
        <p className="text-[11px] font-semibold tracking-[1.2px] uppercase text-[#94B8C2]/60">
          Tools Studio
        </p>
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
              <div className={navItemClass(t.isActive)}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{t.label}</span>
                {!isScholar && (
                  <span className="inline-flex items-center text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded-full text-[#A7F3FF] border border-[#76E4F7]/30 shadow-[0_0_8px_rgba(118,228,247,0.18)]">
                    PRO
                  </span>
                )}
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
        <div className={navItemClass(isActive)}>
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
