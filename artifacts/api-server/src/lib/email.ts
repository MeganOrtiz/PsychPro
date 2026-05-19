import { logger } from "./logger";

export type EmailMessage = {
  to: string;
  cc?: string;
  subject: string;
  html: string;
  text: string;
};

export type EmailSendResult =
  | { ok: true; provider: "resend" | "console" | "noop"; id?: string }
  | { ok: false; reason: string };

// Single sender entry point. Swap implementations behind this signature.
//
// Drivers (selected by env):
//   - "noop":    EMAIL_ENABLED is unset/false OR NODE_ENV === "test" —
//                returns ok without doing anything. Used by smoke tests.
//   - "resend":  EMAIL_ENABLED + RESEND_API_KEY present — POSTs to Resend.
//   - "console": EMAIL_ENABLED but no RESEND_API_KEY — logs the message at
//                INFO level so it shows up in the api-server workflow logs
//                (useful for local dev and the task's smoke test).
//
// The intro-email flow MUST never expose the requester's email address to
// the recipient before mutual accept, so callers are responsible for only
// passing the appropriate addresses in `to`/`cc`. This helper itself does
// not filter — it forwards exactly what it is given.
export async function sendEmail(msg: EmailMessage): Promise<EmailSendResult> {
  const enabled =
    process.env.EMAIL_ENABLED === "true" && process.env.NODE_ENV !== "test";
  if (!enabled) {
    return { ok: true, provider: "noop" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "PsychPro <noreply@psychpro.app>";

  if (apiKey) {
    try {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: msg.to,
          cc: msg.cc,
          subject: msg.subject,
          html: msg.html,
          text: msg.text,
        }),
      });
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        logger.error({ status: resp.status, body }, "Resend email send failed");
        return { ok: false, reason: `Resend ${resp.status}` };
      }
      const data = (await resp.json().catch(() => ({}))) as { id?: string };
      return { ok: true, provider: "resend", id: data?.id };
    } catch (err) {
      logger.error({ err }, "Resend email send threw");
      return { ok: false, reason: "Resend request failed" };
    }
  }

  // No Resend key — log so the smoke test can verify the right addresses
  // and content went out without provisioning a provider.
  logger.info(
    { to: msg.to, cc: msg.cc, subject: msg.subject, text: msg.text },
    "[email/console] would send email",
  );
  return { ok: true, provider: "console" };
}
