import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useUser, UserButton } from "@clerk/react";
import { Brain, LayoutDashboard, BookOpen, Trophy, CreditCard, Menu, X, ChevronRight, MessageSquare, ShieldCheck, BookMarked, Library, Wrench, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/topics", label: "Categories", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: Trophy },
  { href: "/resources", label: "Resources", icon: Library },
  { href: "/subscription", label: "Upgrade", icon: CreditCard },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/feature-request", label: "Be Featured", icon: Star },
];

function useUserMeta() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScholar, setIsScholar] = useState(false);

  useEffect(() => {
    fetch("/api/feedback/is-admin")
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.isAdmin ?? false))
      .catch(() => setIsAdmin(false));

    fetch("/api/subscription/status")
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
  const { user } = useUser();
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
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar flex flex-col transition-transform duration-300 md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        data-testid="sidebar"
      >
        <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
          <Brain className="w-7 h-7 text-sidebar-primary flex-shrink-0" />
          <span className="text-sidebar-foreground font-bold text-lg">PsychPro</span>
          <button
            className="ml-auto md:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
            );
          })}

          {isScholar && (
            <>
              <div className="px-3 pt-3 pb-1">
                <p className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">Toolkit</p>
              </div>
              <Link
                href="/my-decks"
                onClick={() => setSidebarOpen(false)}
                data-testid="nav-my-decks"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                    location === "/my-decks" || (location.startsWith("/my-decks/") && location !== "/my-decks/new")
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <BookMarked className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">My Toolkits</span>
                  {(location === "/my-decks" || (location.startsWith("/my-decks/") && location !== "/my-decks/new")) && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
              <Link
                href="/my-decks/new?tier=standard"
                onClick={() => setSidebarOpen(false)}
                data-testid="nav-new-standard"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                    location === "/my-decks/new" && typeof window !== "undefined" && window.location.search.includes("tier=standard")
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Wrench className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Standard Tools</span>
                </div>
              </Link>
              <Link
                href="/my-decks/new?tier=pro"
                onClick={() => setSidebarOpen(false)}
                data-testid="nav-new-pro"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                    location === "/my-decks/new" && typeof window !== "undefined" && window.location.search.includes("tier=pro")
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Pro Tools</span>
                </div>
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <div className="px-3 pt-3 pb-1">
                <p className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">Admin</p>
              </div>
              <Link
                href="/admin/feedback"
                onClick={() => setSidebarOpen(false)}
                data-testid="nav-admin-feedback"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                    location === "/admin/feedback"
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Feedback Inbox</span>
                  {location === "/admin/feedback" && <ChevronRight className="w-4 h-4 ml-auto" />}
                </div>
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
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
