import type { ReactNode } from "react";

// Dashboard-only owner artwork; landing keeps its independent splash asset.
const tealSplash = `${import.meta.env.BASE_URL}api/storage/public-objects/brand/dashboard-teal-splash-complete.webp`;

// The desktop splash belongs to the whole shell so it can pass behind navigation.
// The local copy below remains the compact, stacked mobile composition.
export function DashboardHeaderBackdrop() {
  return (
    <img
      src={tealSplash}
      alt=""
      aria-hidden
      className="dashboard-header-backdrop"
      width={1672}
      height={603}
    />
  );
}

export function DashboardBrandArtwork({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-brand-artwork">
      <img
        src={tealSplash}
        alt=""
        aria-hidden
        className="dashboard-brand-splash"
        width={1672}
        height={603}
      />
      {children}
    </div>
  );
}