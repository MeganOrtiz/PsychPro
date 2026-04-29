import Stripe from 'stripe';

interface ConnectionSettings {
  settings: {
    publishable: string;
    secret: string;
  };
}

function getKeysFromEnv(): { publishableKey: string; secretKey: string } | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey =
    process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (secretKey && publishableKey) {
    return { publishableKey, secretKey };
  }
  return null;
}

async function getCredentialsFromConnector(): Promise<{ publishableKey: string; secretKey: string } | null> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!hostname || !xReplitToken) {
    return null;
  }

  try {
    const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
    const targetEnvironment = isProduction ? 'production' : 'development';

    const url = new URL(`https://${hostname}/api/v2/connection`);
    url.searchParams.set('include_secrets', 'true');
    url.searchParams.set('connector_names', 'stripe');
    url.searchParams.set('environment', targetEnvironment);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    });

    const data = (await response.json()) as { items?: ConnectionSettings[] };
    const connectionSettings = data.items?.[0];

    if (
      !connectionSettings ||
      !connectionSettings.settings.publishable ||
      !connectionSettings.settings.secret
    ) {
      return null;
    }

    return {
      publishableKey: connectionSettings.settings.publishable,
      secretKey: connectionSettings.settings.secret,
    };
  } catch {
    return null;
  }
}

async function getCredentials() {
  // Prefer plain env-var keys when present so the app can run without the
  // Replit Stripe integration / sandbox claim. Fall back to the connector
  // when env vars are missing.
  const fromEnv = getKeysFromEnv();
  if (fromEnv) {
    return fromEnv;
  }

  const fromConnector = await getCredentialsFromConnector();
  if (fromConnector) {
    return fromConnector;
  }

  throw new Error(
    'Stripe credentials not found. Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY (or VITE_STRIPE_PUBLISHABLE_KEY) as Secrets, or connect the Stripe integration.'
  );
}

export async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey, {
    apiVersion: '2026-03-25.dahlia',
  });
}

export async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

export async function getStripeSecretKey() {
  const { secretKey } = await getCredentials();
  return secretKey;
}
