import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Account control shown in the app header. Shows the signed-in user's avatar
 * and a menu with links to
 * the profile page and a Sign out action that hits the Replit Auth logout
 * flow. `size` tunes the avatar dimensions so the mobile header can use a
 * slightly smaller control than the desktop bar.
 */
export function AccountMenu({ size = "md" }: { size?: "sm" | "md" }) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const dims = size === "sm" ? "w-9 h-9" : "w-10 h-10";
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.email ||
    "Account";
  const initials =
    (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") ||
    (user?.email?.[0]?.toUpperCase() ?? "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`${dims} rounded-full ring-1 ring-[#76E4F7]/40 outline-none focus-visible:ring-2 focus-visible:ring-[#76E4F7]`}
        aria-label="Open account menu"
        data-testid="account-menu-trigger"
      >
        <Avatar className={`${dims} rounded-full`}>
          {user?.profileImageUrl ? (
            <AvatarImage src={user.profileImageUrl} alt={name} />
          ) : null}
          <AvatarFallback className="bg-[hsl(var(--surf-hue)_73%_16%)] text-[#76E4F7] text-sm font-medium">
            {initials || <UserIcon className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => navigate("/profile")}
          data-testid="account-menu-profile"
        >
          <UserIcon className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => logout()}
          data-testid="account-menu-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
