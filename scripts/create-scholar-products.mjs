import Stripe from "stripe";

async function getStripeSecret() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) throw new Error("No Replit token found");

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set("include_secrets", "true");
  url.searchParams.set("connector_names", "stripe");
  url.searchParams.set("environment", "development");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json", "X-Replit-Token": xReplitToken },
  });
  const data = await res.json();
  return data.items?.[0]?.settings?.secret;
}

const secretKey = await getStripeSecret();
if (!secretKey) throw new Error("Could not get Stripe secret key");
console.log("Got Stripe credentials");

const stripe = new Stripe(secretKey, { apiVersion: "2026-03-25.dahlia" });

// Check if Scholar product already exists
const existing = await stripe.products.search({ query: 'metadata["neuronotes_tier"]:"scholar"' });
if (existing.data.length > 0) {
  console.log("Scholar product already exists:", existing.data[0].id);
  const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
  for (const p of prices.data) {
    console.log(`  Price: ${p.id} - $${p.unit_amount / 100}/${p.recurring?.interval}`);
  }
  process.exit(0);
}

const product = await stripe.products.create({
  name: "PsychPro Scholar",
  description: "Upload your own study materials and generate custom flashcards, quizzes, study guides & exams — built exclusively from your content.",
  metadata: { neuronotes_tier: "scholar" },
});
console.log("Created product:", product.id);

const monthly = await stripe.prices.create({
  product: product.id,
  unit_amount: 1999,
  currency: "usd",
  recurring: { interval: "month" },
});
console.log("Monthly price:", monthly.id, `$${monthly.unit_amount / 100}/mo`);

const annual = await stripe.prices.create({
  product: product.id,
  unit_amount: 15999,
  currency: "usd",
  recurring: { interval: "year" },
});
console.log("Annual price:", annual.id, `$${annual.unit_amount / 100}/yr`);
console.log("Done!");
