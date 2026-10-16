export type CheckoutChoice = { suite: "psychpro" | "eppp"; priceId: string };
const KEY = "psychpro:pending-checkout";

export function checkoutChoice(search: string): CheckoutChoice | null {
  const params = new URLSearchParams(search);
  const suite = params.get("checkout");
  const priceId = params.get("priceId");
  if ((suite !== "psychpro" && suite !== "eppp") || !priceId || !/^price_[a-zA-Z0-9]+$/.test(priceId)) return null;
  return { suite, priceId };
}

export function checkoutReturnPath(choice: CheckoutChoice) {
  return `/subscription?${new URLSearchParams({ checkout: choice.suite, priceId: choice.priceId })}`;
}

export function checkoutAuthHref(choice: CheckoutChoice, origin: string, basePath: string) {
  const destination = new URL(`${basePath.replace(/\/$/, "")}${checkoutReturnPath(choice)}`, origin);
  return `/sign-up?redirect_url=${encodeURIComponent(destination.href)}`;
}

export function rememberPendingCheckout(choice: CheckoutChoice) {
  try { window.sessionStorage.setItem(KEY, JSON.stringify({ ...choice, at: Date.now() })); } catch { /* URL also carries intent */ }
}

export function readPendingCheckout(): CheckoutChoice | null {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(KEY) ?? "null");
    if (!saved || typeof saved.at !== "number" || Date.now() - saved.at > 30 * 60_000) return null;
    return checkoutChoice(new URLSearchParams({ checkout: saved.suite, priceId: saved.priceId }).toString());
  } catch { return null; }
}

export function clearPendingCheckout() {
  try { window.sessionStorage.removeItem(KEY); } catch { /* optional recovery store */ }
}
