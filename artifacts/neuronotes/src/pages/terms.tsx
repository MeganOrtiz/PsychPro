import { Link } from "wouter";
import { Brain } from "lucide-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

const TRACK_NAV: React.CSSProperties = {
  letterSpacing: "0.22em",
  fontFamily: '"Montserrat", sans-serif',
};

export default function TermsPage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "#04080c",
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
      <header className="border-b" style={{ borderColor: "rgba(118,228,247,0.15)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
            data-testid="terms-home-link"
          >
            <Brain
              className="w-6 h-6"
              style={{ color: P.surf, filter: `drop-shadow(0 0 8px ${P.surf}aa)` }}
            />
            <span
              className="text-base"
              style={{ ...TRACK_NAV, color: P.cloud, fontWeight: 300 }}
            >
              PSYCHPRO
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs"
            style={{ ...TRACK_NAV, color: P.inkSoft, fontWeight: 300 }}
          >
            BACK TO HOME
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ ...TRACK_NAV, color: P.cloud, fontWeight: 300 }}
        >
          TERMS OF SERVICE
        </h1>
        <p className="text-xs mb-10" style={{ color: P.inkSoft }}>
          Last updated: May 25, 2026
        </p>

        <div
          className="space-y-6 text-sm leading-relaxed font-light"
          style={{ color: P.mist }}
        >
          <p>
            Welcome to PsychPro. By creating an account or using the service you
            agree to these terms. Please read them carefully.
          </p>

          <Section title="Your account">
            <p>
              You are responsible for the activity on your account and for
              keeping your sign-in credentials safe. PsychPro is for individual
              learning use. Please don&apos;t share your account or use it to
              violate any law.
            </p>
          </Section>

          <Section title="Educational use">
            <p>
              PsychPro provides study material for educational purposes only. It
              is not a substitute for professional clinical, medical, or legal
              advice, and should not be relied on to diagnose or treat any
              condition.
            </p>
          </Section>

          <Section title="Content & intellectual property">
            <p>
              All content, flashcards, study guides, and visuals shown in the
              app are owned by PsychPro or its licensors. You may use them for
              your own learning but may not republish, resell, or redistribute
              them.
            </p>
          </Section>

          <Section title="Subscriptions & payments">
            <p>
              Paid plans renew automatically until cancelled. You can cancel any
              time from your subscription settings; cancellation takes effect at
              the end of your current billing period. Refunds are handled per
              our refund policy &mdash; reach out and we&apos;ll work with you
              fairly.
            </p>
          </Section>

          <Section title="Termination">
            <p>
              We may suspend or terminate accounts that violate these terms or
              that harm other users or the service. You can close your account
              at any time.
            </p>
          </Section>

          <Section title="Disclaimer">
            <p>
              The service is provided &ldquo;as is&rdquo; without warranties of
              any kind. To the maximum extent permitted by law, PsychPro is not
              liable for indirect, incidental, or consequential damages arising
              from your use of the service.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms? Reach us at{" "}
              <a
                href="mailto:hello@psychprosuite.com"
                className="underline"
                style={{ color: P.surf }}
              >
                hello@psychprosuite.com
              </a>
              .
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-sm mb-3"
        style={{ ...TRACK_NAV, color: "#fff", fontWeight: 400 }}
      >
        {title.toUpperCase()}
      </h2>
      {children}
    </section>
  );
}
