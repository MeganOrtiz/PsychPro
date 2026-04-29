import Stripe from "stripe";

// Usage:
//   pnpm --filter @workspace/db exec tsx ../../scripts/seed-stripe-products.ts
//   STRIPE_ENV=production pnpm --filter @workspace/db exec tsx ../../scripts/seed-stripe-products.ts
//
// Pass STRIPE_ENV=production (or run inside a deployment where REPLIT_DEPLOYMENT=1)
// to seed against the LIVE Stripe connector. Defaults to development (test mode).

function resolveEnvironment(): "development" | "production" {
  const explicit = process.env.STRIPE_ENV;
  if (explicit === "production" || explicit === "development") return explicit;
  return process.env.REPLIT_DEPLOYMENT === "1" ? "production" : "development";
}

async function getStripeKey(environment: "development" | "production"): Promise<string> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken || !hostname) {
    throw new Error("Missing Replit token or hostname");
  }

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set("include_secrets", "true");
  url.searchParams.set("connector_names", "stripe");
  url.searchParams.set("environment", environment);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "X-Replit-Token": xReplitToken,
    },
  });

  const data = await response.json();
  const connection = data.items?.[0];

  if (!connection?.settings?.secret) {
    throw new Error(`Stripe ${environment} connection not found — connect Stripe in the ${environment} environment first.`);
  }

  return connection.settings.secret;
}

type TierSpec = {
  tier: "pro" | "scholar";
  name: string;
  description: string;
  monthlyAmount: number;
  annualAmount: number;
};

const TIERS: TierSpec[] = [
  {
    tier: "pro",
    name: "PsychPro Pro",
    description:
      "Unlimited access to all flashcards, quizzes, study guides, and practice exams across 20+ neuroscience topics.",
    monthlyAmount: 999,
    annualAmount: 7999,
  },
  {
    tier: "scholar",
    name: "PsychPro Scholar",
    description:
      "Upload your own study materials and generate custom flashcards, quizzes, study guides & exams — built exclusively from your content.",
    monthlyAmount: 1999,
    annualAmount: 15999,
  },
];

async function ensurePriceForInterval(
  stripe: Stripe,
  productId: string,
  interval: "month" | "year",
  amount: number,
  nickname: string,
): Promise<{ id: string; created: boolean }> {
  // List all active recurring prices for the product, then look for an exact
  // match on interval + amount + currency. If none, create a new one. We don't
  // archive mismatched prices — the user can do that manually if desired.
  const all = await stripe.prices.list({ product: productId, active: true, limit: 100 });
  const match = all.data.find(
    (p) =>
      p.currency === "usd" &&
      p.unit_amount === amount &&
      p.recurring?.interval === interval,
  );
  if (match) return { id: match.id, created: false };

  const created = await stripe.prices.create({
    product: productId,
    unit_amount: amount,
    currency: "usd",
    recurring: { interval },
    nickname,
  });
  return { id: created.id, created: true };
}

async function ensureTier(stripe: Stripe, spec: TierSpec) {
  const existing = await stripe.products.search({
    query: `metadata["neuronotes_tier"]:"${spec.tier}"`,
  });

  let productId: string;
  if (existing.data.length > 0) {
    productId = existing.data[0].id;
    console.log(`${spec.name}: product exists (${productId}) — reconciling prices.`);
  } else {
    const product = await stripe.products.create({
      name: spec.name,
      description: spec.description,
      metadata: { neuronotes_tier: spec.tier },
    });
    productId = product.id;
    console.log(`${spec.name}: created product (${productId}).`);
  }

  const monthly = await ensurePriceForInterval(stripe, productId, "month", spec.monthlyAmount, "Monthly");
  const annual = await ensurePriceForInterval(stripe, productId, "year", spec.annualAmount, "Annual");

  console.log(
    `  Monthly price: ${monthly.id} — $${spec.monthlyAmount / 100}/mo${monthly.created ? " (created)" : " (existing)"}`,
  );
  console.log(
    `  Annual  price: ${annual.id} — $${spec.annualAmount / 100}/yr${annual.created ? " (created)" : " (existing)"}`,
  );
}

async function seedProducts() {
  const environment = resolveEnvironment();
  console.log(`Seeding Stripe products against ${environment.toUpperCase()} Stripe…`);

  const secretKey = await getStripeKey(environment);
  const stripe = new Stripe(secretKey, { apiVersion: "2026-03-25.dahlia" });

  for (const spec of TIERS) {
    await ensureTier(stripe, spec);
  }

  console.log("Done!");
  process.exit(0);
}

seedProducts().catch((err) => {
  console.error("Error seeding Stripe products:", err);
  process.exit(1);
});
