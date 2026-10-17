import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Brain, Crown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { suiteLoginHref } from "@/lib/suite-login";
import { clearPendingTrial } from "@/lib/pending-trial";
import { clearPendingCheckout } from "@/lib/pending-checkout";
import { trackEvent } from "@/lib/analytics";

export function LandingLoginMenu({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpened = useRef(false);
  const cancelClose = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const closeSoon = () => {
    cancelClose();
    timer.current = setTimeout(() => setOpen(false), 180);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="landing-nav-login"
          data-testid="nav-login"
          onPointerEnter={(event) => {
            cancelClose();
            if (event.pointerType === "mouse") {
              hoverOpened.current = true;
              setOpen(true);
            }
          }}
          onPointerLeave={closeSoon}
          onPointerDown={() => { hoverOpened.current = false; }}
          onKeyDown={() => { hoverOpened.current = false; }}
        >
          LOG IN
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-56"
        data-testid="landing-login-options"
        onPointerEnter={cancelClose}
        onPointerLeave={closeSoon}
        onCloseAutoFocus={(event) => {
          if (hoverOpened.current) event.preventDefault();
        }}
      >
        {([
          { suite: "psychpro", label: "PsychPro", Icon: Brain },
          { suite: "eppp", label: "EPPP Mastery Suite", Icon: Crown },
        ] as const).map(({ suite, label, Icon }) => (
          <DropdownMenuItem key={suite} asChild>
            <Link
              href={suiteLoginHref(suite, signedIn, window.location.origin, import.meta.env.BASE_URL)}
              data-testid={`login-${suite}`}
              onClick={() => {
                cancelClose();
                clearPendingTrial();
                clearPendingCheckout();
                setOpen(false);
                trackEvent("navigation_clicked", { surface: "landing_login", suite, signed_in: signedIn });
              }}
            >
              <Icon aria-hidden />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
