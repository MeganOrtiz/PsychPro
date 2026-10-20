type StripeEnvironment = Record<string, string | undefined>;

/** Sandbox credentials are opt-in for the local preview, never a deployment. */
export function usesStripeSandbox(env: StripeEnvironment = process.env): boolean {
  return env.NODE_ENV === "development" && env.REPLIT_DEPLOYMENT !== "1" &&
    Boolean(env.STRIPE_SANDBOX_SECRET_KEY || env.STRIPE_SANDBOX_PUBLISHABLE_KEY);
}

export function sandboxStripeCredentials(env: StripeEnvironment = process.env) {
  if (!usesStripeSandbox(env)) return null;
  const secretKey = env.STRIPE_SANDBOX_SECRET_KEY?.trim();
  const publishableKey = env.STRIPE_SANDBOX_PUBLISHABLE_KEY?.trim();
  if (!secretKey?.startsWith("sk_test_") || !publishableKey?.startsWith("pk_test_")) {
    throw new Error("Preview Stripe sandbox requires both valid test API keys; refusing live fallback.");
  }
  return { secretKey, publishableKey };
}

export function stripeWebhookSecret(env: StripeEnvironment = process.env): string | undefined {
  // Never verify sandbox events with the live endpoint's signing secret.
  return usesStripeSandbox(env)
    ? env.STRIPE_SANDBOX_WEBHOOK_SECRET?.trim() || undefined
    : env.STRIPE_WEBHOOK_SECRET;
}

export function assertStripeWebhookMode(livemode: boolean, env: StripeEnvironment = process.env) {
  if (usesStripeSandbox(env) && livemode) {
    throw new Error("Live Stripe events are not allowed in the sandbox preview.");
  }
}
