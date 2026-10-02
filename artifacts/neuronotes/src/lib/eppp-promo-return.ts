/**
 * Carry only the EPPP promo destination through auth and onboarding.
 * Never accept an arbitrary return URL from a public query string.
 */
export function getPromoReturn(search: string): string | null {
  const destination = new URLSearchParams(search).get("returnTo");
  if (!destination || !/^\/eppp\/promo(?:\?|$)/.test(destination)) return null;
  try {
    const url = new URL(destination, "https://psychpro.invalid");
    if (url.origin !== "https://psychpro.invalid" || url.pathname !== "/eppp/promo") return null;
    const code = url.searchParams.get("code");
    if (code !== null && (!code.trim() || code.length > 64)) return null;
    return `/eppp/promo${code ? `?code=${encodeURIComponent(code.trim())}` : ""}`;
  } catch {
    return null;
  }
}

export function buildPromoAuthHref(
  mode: "sign-up" | "sign-in",
  code: string,
  origin: string,
  basePath: string,
): string {
  const base = basePath.replace(/\/$/, "");
  const destination = `/eppp/promo?code=${encodeURIComponent(code.trim())}`;
  const welcome = new URL(`${base}/welcome`, origin);
  welcome.searchParams.set("returnTo", destination);
  return `${base}/${mode}?redirect_url=${encodeURIComponent(welcome.href)}`;
}

export function promoAuthHref(mode: "sign-up" | "sign-in", code: string): string {
  return buildPromoAuthHref(mode, code, window.location.origin, import.meta.env.BASE_URL);
}