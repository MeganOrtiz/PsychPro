import assert from "node:assert/strict";
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
assert.ok(verificationError instanceof Error);
logStripeWebhookError(logger, verificationError);
logStripeWebhookError(logger, Object.assign(new Error(sensitive.join(" ")), {
  payload: sensitive.join(" "), cause: verificationError,
}));
logStripeWebhookError(logger, { message: sensitive[0], payload: sensitive[1] });

for (const value of sensitive) assert.ok(!output.includes(value), "Sensitive data must not be logged");
const entries = output.trim().split("\n").map(line => JSON.parse(line));
assert.deepEqual(entries.map(e => e.errorType), [
  "signature_verification", "webhook_processing", "webhook_processing",
]);
for (const entry of entries) {
  assert.deepEqual(Object.keys(entry).sort(), ["errorType", "level", "msg"]);
}
console.log("Stripe webhook logging: sensitive payloads and errors are omitted");
