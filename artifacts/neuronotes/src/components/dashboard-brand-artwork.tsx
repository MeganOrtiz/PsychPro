import type { ReactNode } from "react";
import tealSplash from "@/assets/psychpro-teal-ink-splash.jpg";

export function DashboardBrandArtwork({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-brand-artwork">
      <img
        src={tealSplash}
        alt=""
        aria-hidden
        className="dashboard-brand-splash"
        width={1672}
        height={941}
      />
      {children}
    </div>
  );
}