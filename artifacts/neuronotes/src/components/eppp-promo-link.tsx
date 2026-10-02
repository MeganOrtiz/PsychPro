import { Link } from "wouter";

export function EpppPromoLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/eppp/promo?code=EPPP7"
      className={`text-sm underline underline-offset-4 text-foreground ${className}`}
      data-testid="link-eppp-promo"
    >
      Have a code? Try EPPP free for 7 days, no card needed
    </Link>
  );
}
