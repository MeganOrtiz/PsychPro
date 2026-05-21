import { useEffect, useRef, useState } from "react";
import { getOrCreateAnonymousUserId } from "./anonymous-user";

/**
 * Single source of truth for the `X-User-Id` header sent on every API call.
 *
 * Resolution order:
 *   1. If a Clerk user is signed in (set via `setClerkUserId` from the
 *      `ClerkUserIdBridge`), return their Clerk user id.
 *   2. Otherwise fall back to a browser-scoped anonymous UUID stored in
 *      localStorage. This is the path used during the pre-onboarding visit
 *      and for components that read profile data on the public landing
 *      surfaces.
 *
 * Components must call `getCurrentUserId()` instead of
 * `getOrCreateAnonymousUserId()` directly — that way a signed-in user's
 * Clerk id reaches the API server and `clerkMiddleware` can pin DB rows to
 * the right account. The generated API client picks up the same value via
 * `setUserIdProvider` in `App.tsx`.
 */

let clerkUserId: string | null = null;
const listeners = new Set<() => void>();

export function setClerkUserId(id: string | null): void {
  if (clerkUserId === id) return;
  clerkUserId = id;
  for (const fn of listeners) fn();
}

export function getCurrentUserId(): string {
  return clerkUserId ?? getOrCreateAnonymousUserId();
}

/**
 * Subscribe to user-id changes. Used by components that have already mounted
 * before Clerk's session loads (e.g. the sidebar profile fetch) so they can
 * re-fetch under the right identity once the Clerk id arrives.
 */
function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/**
 * React hook returning the current X-User-Id. Re-renders the caller when
 * the resolved identity changes (e.g. when Clerk finishes loading after the
 * component first mounted).
 */
export function useCurrentUserId(): string {
  const [id, setId] = useState<string>(() => getCurrentUserId());
  // Track the last value we observed via an effect so we don't double-render
  // when the value is already up to date.
  const lastRef = useRef(id);
  useEffect(() => {
    const sync = () => {
      const next = getCurrentUserId();
      if (next !== lastRef.current) {
        lastRef.current = next;
        setId(next);
      }
    };
    sync();
    return subscribe(sync);
  }, []);
  return id;
}
