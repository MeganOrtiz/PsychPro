import Stripe from "stripe";

async function getStripeKey(): Promise<string> {
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
  url.searchParams.set("environment", "development");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "X-Replit-Token": xReplitToken,
    },
  });

  const data = await response.json();
  const connection = data.items?.[0];

  if (!connection?.settings?.secret) {
    throw new Error("Stripe development connection not found");
  }

  return connection.settings.secret;
}

async function seedProducts() {
  console.log("Seeding Stripe products...");
  const secretKey = await getStripeKey();
  const stripe = new Stripe(secretKey, { apiVersion: "2026-03-25.dahlia" });

  const existing = await stripe.products.list({ active: true });
  if (existing.data.length > 0) {
    console.log(`Found ${existing.data.length} existing products — skipping seed`);
    process.exit(0);
  }

  const product = await stripe.products.create({
    name: "NeuroNotes Pro",
    description: "Unlimited access to all flashcards, quizzes, study guides, and practice exams across 20+ neuroscience topics.",
  });

  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 999,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Monthly",
  });

  const annualPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 7999,
    currency: "usd",
    recurring: { interval: "year" },
    nickname: "Annual",
  });

  console.log(`Created product: ${product.id}`);
  console.log(`Monthly price: ${monthlyPrice.id} — $9.99/month`);
  console.log(`Annual price: ${annualPrice.id} — $79.99/year`);
  console.log("Done!");
  process.exit(0);
}

seedProducts().catch((err) => {
  console.error("Error seeding Stripe products:", err);
  process.exit(1);
});
