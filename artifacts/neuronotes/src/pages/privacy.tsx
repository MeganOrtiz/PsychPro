import { Link } from "wouter";
import { Brain } from "lucide-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

const TRACK_NAV: React.CSSProperties = {
  letterSpacing: "0.22em",
  fontFamily: '"Montserrat", sans-serif',
};

export default function PrivacyPage() {
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
            data-testid="privacy-home-link"
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
          PRIVACY POLICY
        </h1>
        <p className="text-xs mb-10" style={{ color: P.inkSoft }}>
          Last updated: May 25, 2026
        </p>

        <div
          className="space-y-6 text-sm leading-relaxed font-light"
          style={{ color: P.mist }}
        >
          <p>
            PsychPro (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy.
            This policy describes the information we collect, how we use it, and
            the choices you have. By using PsychPro you agree to the practices
            described here.
          </p>

          <Section title="Information we collect">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white font-medium">Account info</strong> &mdash; your
                name, email address, and authentication identifiers provided
                through our sign-in provider.
              </li>
              <li>
                <strong className="text-white font-medium">Study activity</strong> &mdash; topics
                you study, flashcard performance, quiz results, and notes you
                create, so we can show your progress.
              </li>
              <li>
                <strong className="text-white font-medium">Technical data</strong> &mdash; basic
                logs (IP, browser, timestamps) used for security and to keep the
                service reliable.
              </li>
            </ul>
          </Section>

          <Section title="How we use your information">
            <p>
              We use your information to provide and improve the service,
              personalize your learning experience, respond to support requests,
              and protect against abuse. We do not sell your personal data.
            </p>
          </Section>

          <Section title="Sharing">
            <p>
              We share information only with the service providers that help us
              run PsychPro (such as our authentication, hosting, and payment
              providers), or when required by law.
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              You can update your account information from your profile page, or
              request deletion of your account at any time by emailing{" "}
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

          <Section title="Contact">
            <p>
              Questions about this policy? Reach us at{" "}
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
