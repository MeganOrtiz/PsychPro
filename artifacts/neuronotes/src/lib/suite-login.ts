export type LoginSuite = "psychpro" | "eppp";

/** Login selects a protected destination; it never starts a trial. */
export function suiteLoginHref(suite: LoginSuite, signedIn: boolean, origin: string, basePath: string) {
  const destination = suite === "eppp" ? "/eppp/suite" : "/dashboard";
  if (signedIn) return destination;
  const target = new URL(`${basePath.replace(/\/$/, "")}${destination}`, origin);
  return `/sign-in?redirect_url=${encodeURIComponent(target.href)}`;
}
