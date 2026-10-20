import assert from "node:assert/strict";
import {
  usesStripeSandbox, sandboxStripeCredentials, stripeWebhookSecret, assertStripeWebhookMode,
} from "../src/lib/stripeEnvironment";

const sandbox = {
  NODE_ENV: "development",
  STRIPE_SANDBOX_SECRET_KEY: "sk_test_fixture",
  STRIPE_SANDBOX_PUBLISHABLE_KEY: "pk_test_fixture",
  STRIPE_SANDBOX_WEBHOOK_SECRET: "whsec_sandbox_fixture",
  STRIPE_SECRET_KEY: "sk_live_fixture",
  STRIPE_WEBHOOK_SECRET: "whsec_live_fixture",
};

assert.equal(usesStripeSandbox(sandbox), true);
assert.deepEqual(sandboxStripeCredentials(sandbox), {
  secretKey: "sk_test_fixture", publishableKey: "pk_test_fixture",
});
assert.equal(stripeWebhookSecret(sandbox), "whsec_sandbox_fixture");
assert.equal(stripeWebhookSecret({ ...sandbox, STRIPE_SANDBOX_WEBHOOK_SECRET: undefined }), undefined);
assert.throws(() => assertStripeWebhookMode(true, sandbox));
assert.doesNotThrow(() => assertStripeWebhookMode(false, sandbox));

for (const production of [
  { ...sandbox, NODE_ENV: "production" },
  { ...sandbox, REPLIT_DEPLOYMENT: "1" },
  { ...sandbox, NODE_ENV: undefined },
]) {
  assert.equal(usesStripeSandbox(production), false);
  assert.equal(sandboxStripeCredentials(production), null);
  assert.equal(stripeWebhookSecret(production), "whsec_live_fixture");
}

for (const broken of [
  { ...sandbox, STRIPE_SANDBOX_SECRET_KEY: undefined },
  { ...sandbox, STRIPE_SANDBOX_PUBLISHABLE_KEY: undefined },
  { ...sandbox, STRIPE_SANDBOX_SECRET_KEY: "sk_live_fixture" },
  { ...sandbox, STRIPE_SANDBOX_PUBLISHABLE_KEY: "pk_live_fixture" },
]) {
  assert.throws(() => sandboxStripeCredentials(broken), /refusing live fallback/);
}
assert.equal(usesStripeSandbox({ NODE_ENV: "development" }), false);
assert.equal(sandboxStripeCredentials({ NODE_ENV: "development" }), null);
console.log("Stripe sandbox isolation checks passed");
