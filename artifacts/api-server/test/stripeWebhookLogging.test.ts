import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Writable } from "node:stream";
import pino from "pino";
import Stripe from "stripe";
import { logStripeWebhookError } from "../src/lib/stripeWebhookLogging";

let output = "";
const logger = pino({ base: null, timestamp: false }, new Writable({
  write(chunk, _encoding, done) { output += chunk.toString(); done(); },
}));
const sensitive = [
  "private-customer@example.invalid", "PRIVATE_CUSTOMER_NAME",
  "PRIVATE_BILLING_ADDRESS", "PRIVATE_SIGNATURE", "whsec_PRIVATE_FIXTURE",
  "sk_test_PRIVATE_API_KEY",
];
const stripe = new Stripe("sk_test_fixture");
let verificationError: unknown;
try {
  stripe.webhooks.constructEvent(
    JSON.stringify({ email: sensitive[0], name: sensitive[1], address: sensitive[2] }),
    "t=1,v1=" + sensitive[3],
    sensitive[4],
  );
} catch (error) {
  verificationError = error;
}
assert.ok(verificationError instanceof Stripe.errors.StripeSignatureVerificationError);
assert.ok(verificationError.payload.includes(sensitive[0]));
assert.ok(verificationError.header.includes(sensitive[3]));
logStripeWebhookError(logger, verificationError);
logStripeWebhookError(logger, Object.assign(new Error(sensitive.join(" ")), {
  name: sensitive[1],
  type: sensitive[2],
  code: sensitive[3],
  stack: sensitive.join(" "),
  payload: sensitive.join(" "),
  headers: { "stripe-signature": sensitive[3], authorization: sensitive[5] },
  cause: verificationError,
}));
logStripeWebhookError(logger, { message: sensitive[0], payload: sensitive[1] });
logStripeWebhookError(logger, sensitive.join(" "));
logStripeWebhookError(logger, null);
logStripeWebhookError(logger, undefined);

for (const value of sensitive) assert.ok(!output.includes(value), "Sensitive data must not be logged");
const entries = output.trim().split("\n").map(line => JSON.parse(line));
assert.deepEqual(entries.map(e => e.errorType), [
  "signature_verification", "webhook_processing", "webhook_processing",
  "webhook_processing", "webhook_processing", "webhook_processing",
]);
for (const entry of entries) {
  assert.deepEqual(Object.keys(entry).sort(), ["errorType", "level", "msg"]);
  assert.equal(entry.level, 50);
  assert.equal(entry.msg, "Stripe webhook error");
}

// Guard the actual route wiring too: a safe helper alone would not prevent
// someone from restoring full error serialization directly in app.ts.
const appSource = readFileSync(new URL("../src/app.ts", import.meta.url), "utf8");
const webhookRoute = appSource.slice(
  appSource.indexOf('app.post(\n  "/api/stripe/webhook"'),
  appSource.indexOf("app.use(express.json())"),
);
assert.ok(webhookRoute.includes("stripe.webhooks.constructEvent(req.body, sig, webhookSecret)"));
assert.ok(webhookRoute.includes("await handleStripeWebhookEvent(event, logger)"));
assert.match(webhookRoute, /catch \(err\) \{\s*(?:\/\/[^\n]*\n\s*)*logStripeWebhookError\(logger, err\);\s*res\.status\(400\)\.json\(\{ error: "Webhook verification failed" \}\);\s*\}/);
console.log("Stripe webhook logging: sensitive payloads and errors are omitted");
