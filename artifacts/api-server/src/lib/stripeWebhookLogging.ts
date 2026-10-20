import type { Logger } from "pino";
import Stripe from "stripe";

export function logStripeWebhookError(log: Pick<Logger, "error">, error: unknown) {
  // Stripe verification errors carry the raw payment payload and signature.
  // Never serialize the error, message, stack, cause, or arbitrary properties.
  const errorType = error instanceof Stripe.errors.StripeSignatureVerificationError
    ? "signature_verification"
    : "webhook_processing";
  log.error({ errorType }, "Stripe webhook error");
}
