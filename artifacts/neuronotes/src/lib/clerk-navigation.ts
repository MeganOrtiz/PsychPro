import { navigate } from "wouter/use-browser-location";

/**
 * Clerk supplies browser-absolute paths, not Wouter base-relative paths.
 * Use Wouter's browser navigator directly so the artifact base isn't added
 * twice, and verification-step navigation doesn't reload/remount Clerk.
 */
export function createClerkNavigation(basePath: string) {
  const base = basePath.replace(/\/$/, "");

  function go(to: string, replace: boolean) {
    const target = new URL(to, window.location.href);
    const withinApp =
      target.origin === window.location.origin &&
      (!base || target.pathname === base || target.pathname.startsWith(`${base}/`));

    if (withinApp) {
      navigate(`${target.pathname}${target.search}${target.hash}`, { replace });
      return;
    }

    // Other origins (OAuth, for example) and sibling artifacts still need
    // real browser navigation rather than being swallowed by this SPA.
    if (replace) {
      window.location.replace(target.href);
    } else {
      window.location.assign(target.href);
    }
  }

  return {
    routerPush: (to: string) => go(to, false),
    routerReplace: (to: string) => go(to, true),
  };
}