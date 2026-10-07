import type { CSSProperties, ReactNode } from "react";
import tealSplash from "@/assets/psychpro-teal-ink-splash.jpg";
import diffusionMask from "@/assets/psychpro-artwork-diffusion.svg";

export function DashboardBrandArtwork({ children }: { children: ReactNode }) {
  return (
    <div
      className="dashboard-brand-artwork"
      style={{ "--dashboard-artwork-mask": `url("${diffusionMask}")` } as CSSProperties}
    >
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