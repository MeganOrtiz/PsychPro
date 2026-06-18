import { Link } from "wouter";
import { Brain } from "lucide-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

const TRACK_NAV: React.CSSProperties = {
  letterSpacing: "0.22em",
  fontFamily: '"Montserrat", sans-serif',
};

const SECTIONS: { id: string; n: string; title: string }[] = [
  { id: "info-we-collect", n: "1", title: "Information We Collect" },
  { id: "how-we-use", n: "2", title: "How We Use Your Information" },
  { id: "ai-processing", n: "3", title: "AI Processing of Uploaded Content" },
  { id: "community", n: "4", title: "Community and Networking Features" },
  { id: "sharing", n: "5", title: "How We Share Information" },
  { id: "retention", n: "6", title: "Data Retention" },
  { id: "security", n: "7", title: "Data Security" },
  { id: "rights", n: "8", title: "Your Rights and Choices" },
  { id: "international", n: "9", title: "International Users" },
  { id: "illinois", n: "10", title: "Illinois Residents" },
  { id: "children", n: "11", title: "Children's Privacy" },
  { id: "changes", n: "12", title: "Changes to This Policy" },
  { id: "contact", n: "13", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "#050e10",
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
        <p
          className="text-[10px] mb-3"
          style={{ ...TRACK_NAV, color: P.surf, fontWeight: 400 }}
        >
          LEGAL
        </p>
        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ ...TRACK_NAV, color: P.cloud, fontWeight: 300 }}
        >
          PRIVACY POLICY
        </h1>
        <p className="text-xs mb-1" style={{ color: P.inkSoft }}>
          Effective date: June 2026 &middot; Last updated: June 2026
        </p>

        <p
          className="text-sm leading-relaxed font-light mt-10"
          style={{ color: P.mist }}
        >
          This Privacy Policy explains how PsychPro (&ldquo;PsychPro,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects,
          uses, shares, and protects information about you when you use the
          PsychPro website, applications, and related services (collectively,
          the &ldquo;Service&rdquo;). PsychPro is a study platform for
          neuroscience and neuropsychology learners, including students,
          educators, and professionals.
        </p>
        <p
          className="text-sm leading-relaxed font-light mt-4"
          style={{ color: P.mist }}
        >
          By using the Service, you agree to the collection and use of
          information in accordance with this Policy. If you do not agree,
          please do not use the Service.
        </p>

        {/* Table of contents */}
        <nav
          className="mt-10 mb-12 rounded-lg p-5"
          style={{
            border: "1px solid rgba(118,228,247,0.18)",
            background:
              "linear-gradient(145deg, hsl(var(--surf-hue) 88% 19% / 0.69), hsl(var(--surf-hue) 88% 14% / 0.83))",
          }}
          aria-label="On this page"
        >
          <p
            className="text-[10px] mb-3"
            style={{ ...TRACK_NAV, color: P.surf, fontWeight: 400 }}
          >
            ON THIS PAGE
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-sm font-light">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="hover:underline"
                  style={{ color: P.mist }}
                >
                  <span style={{ color: P.surf }}>{s.n}.</span> {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div
          className="space-y-10 text-sm leading-relaxed font-light"
          style={{ color: P.mist }}
        >
          <Section id="info-we-collect" n="1" title="Information We Collect">
            <p>We collect the following categories of information:</p>

            <SubSection n="1.1" title="Account and Identity Information">
              <p>
                When you create an account, our authentication provider collects
                information needed to identify you and secure your account,
                which may include your email address and a unique account
                identifier. We use a third-party authentication service to
                manage sign-in and account credentials.
              </p>
            </SubSection>

            <SubSection n="1.2" title="Profile Information You Provide">
              <p>If you choose to complete a profile, you may provide:</p>
              <BulletList
                items={[
                  "Display name — the name shown to you and, where applicable, to other members.",
                  "Current role and institution — for example, your area of study or affiliation (optional).",
                  "Bio — a short free-text introduction (optional).",
                  "Interests — topic tags you select to personalize matching and content (optional).",
                  "Profile photo — an image you upload (optional).",
                ]}
              />
            </SubSection>

            <SubSection n="1.3" title="Learning and Usage Data">
              <p>
                As you use the Service, we collect data about your learning
                activity so that we can provide progress tracking and improve
                the product. This includes study progress, quiz attempts,
                practice exam attempts, streaks, usage counts, and feature
                interactions.
              </p>
            </SubSection>

            <SubSection n="1.4" title="Content You Upload">
              <p>
                If you use custom study deck features, you may upload files
                (such as PDF, DOCX, or TXT documents) or paste text. This source
                material is stored to generate study tools for you and is
                processed as described in Section 3. Please do not upload
                material you are not permitted to share, and avoid including
                sensitive personal or third-party information you do not wish to
                process.
              </p>
            </SubSection>

            <SubSection n="1.5" title="Billing Information">
              <p>
                If you purchase a subscription, payments are processed by our
                third-party payment processor. We do not store your full payment
                card details. We retain limited billing-related identifiers
                (such as a customer identifier, subscription identifier, and
                your current subscription tier) to manage your access to paid
                features.
              </p>
            </SubSection>

            <SubSection n="1.6" title="Communications and Feedback">
              <p>
                If you contact us or submit feedback, we collect the contents of
                your message and any contact details or role information you
                choose to include.
              </p>
            </SubSection>

            <SubSection n="1.7" title="Technical and Device Information">
              <p>
                We may automatically collect technical information such as a
                browser-scoped identifier stored locally on your device, error
                and diagnostic logs, and general usage information necessary to
                operate, secure, and troubleshoot the Service.
              </p>
            </SubSection>
          </Section>

          <Section id="how-we-use" n="2" title="How We Use Your Information">
            <p>We use the information we collect to:</p>
            <BulletList
              items={[
                "Provide, maintain, and operate the Service, including your account and learning progress.",
                "Generate study materials, including AI-assisted tools created from content you upload or paste.",
                "Process subscriptions, manage paid access, and handle billing through our payment processor.",
                "Personalize content and, where you opt in, suggest connections with other members who share your interests.",
                "Respond to your feedback, questions, and support requests.",
                "Monitor, secure, and improve the Service, including diagnosing technical issues and preventing abuse.",
                "Comply with legal obligations and enforce our Terms of Service.",
              ]}
            />
          </Section>

          <Section
            id="ai-processing"
            n="3"
            title="AI Processing of Uploaded Content"
          >
            <p>
              Certain features use a third-party artificial intelligence
              provider to generate study materials such as flashcards, quizzes,
              and study guides. When you use these features, the relevant
              portion of your uploaded or pasted source material is transmitted
              to that provider to produce the requested output. We send only the
              content needed to fulfill your request. We do not use your
              uploaded or pasted content to train third-party AI models, and we
              do not sell it or use it for purposes unrelated to providing the
              Service to you. We encourage you to review the practices of our AI
              provider and to avoid submitting sensitive information you do not
              wish to be processed by a third party.
            </p>
          </Section>

          <Section
            id="community"
            n="4"
            title="Community and Networking Features"
          >
            <p>
              PsychPro may offer optional community and networking features.
              These features are governed by your preferences and operate on a
              double opt-in basis:
            </p>
            <BulletList
              items={[
                "Connection suggestions are shown only if you enable the relevant preference, and you are suggested to others only when you have also enabled it.",
                "Email introductions occur only when both members have opted in. When both sides agree, we facilitate a one-time introduction by email. Your email address is not displayed within the app interface itself.",
                "Featured work submissions display your profile details to others only if you enable the corresponding preference.",
              ]}
            />
            <p>
              You can change these preferences at any time in your profile
              settings. Turning a preference off stops future sharing associated
              with that preference.
            </p>
          </Section>

          <Section id="sharing" n="5" title="How We Share Information">
            <p>
              We do not sell your personal information. We share information
              only in the following circumstances:
            </p>
            <DefList
              items={[
                {
                  term: "Service providers",
                  def: "With vendors who perform services on our behalf, such as authentication, payment processing, AI generation, hosting, and email delivery, under obligations to protect your information.",
                },
                {
                  term: "Other members",
                  def: "With other users only through the opt-in community features described in Section 4, and only the information those features are designed to share.",
                },
                {
                  term: "Legal and safety",
                  def: "When we believe disclosure is necessary to comply with law, enforce our terms, or protect the rights, safety, or property of PsychPro, our users, or the public.",
                },
                {
                  term: "Business transfers",
                  def: "In connection with a merger, acquisition, financing, or sale of assets, subject to the protections described in this Policy.",
                },
              ]}
            />
          </Section>

          <Section id="retention" n="6" title="Data Retention">
            <p>
              We retain your information for as long as your account is active
              or as needed to provide the Service, comply with legal
              obligations, resolve disputes, and enforce our agreements. You may
              request deletion of your account and associated personal
              information as described in Section 8. Note that some technical
              identifiers are tied to your device or browser storage; clearing
              that storage may affect access to data associated with it.
            </p>
          </Section>

          <Section id="security" n="7" title="Data Security">
            <p>
              We use reasonable administrative, technical, and organizational
              measures designed to protect your information, including encrypted
              transport for data in transit. No method of transmission or
              storage is completely secure, and we cannot guarantee absolute
              security. You are responsible for keeping your account credentials
              confidential.
            </p>
          </Section>

          <Section id="rights" n="8" title="Your Rights and Choices">
            <p>
              Depending on your location, you may have rights regarding your
              personal information, which may include the right to access,
              correct, delete, or port your data, and to object to or restrict
              certain processing. You can:
            </p>
            <BulletList
              items={[
                "Update your profile information and communication preferences in your account settings.",
                "Adjust community and networking preferences at any time.",
                "Request access to or deletion of your personal information by contacting us.",
              ]}
            />
            <p>
              To exercise any of these rights, contact us using the details in
              Section 13. We will respond consistent with applicable law. We
              will not discriminate against you for exercising your rights.
            </p>
          </Section>

          <Section id="international" n="9" title="International Users">
            <p>
              PsychPro may be operated from, and use service providers located
              in, jurisdictions that may differ from your own. Where we transfer
              personal information across borders, we take steps designed to
              ensure appropriate protection consistent with applicable law.
            </p>
          </Section>

          <Section id="illinois" n="10" title="Illinois Residents">
            <p>
              This section applies to residents of the State of Illinois and
              reflects our practices under Illinois law, including the Personal
              Information Protection Act (815 ILCS 530) and the Biometric
              Information Privacy Act (740 ILCS 14).
            </p>
            <SubSection n="10.1" title="Security of Personal Information">
              <p>
                We implement and maintain reasonable security measures designed
                to protect personal information about Illinois residents from
                unauthorized access, acquisition, use, modification, disclosure,
                or destruction, consistent with the Personal Information
                Protection Act. When personal information is no longer needed,
                we take reasonable steps to dispose of it securely so that it is
                unreadable or unrecoverable.
              </p>
            </SubSection>
            <SubSection n="10.2" title="Data Breach Notification">
              <p>
                In the event of a breach of the security of the system involving
                unencrypted personal information of Illinois residents, we will
                notify affected individuals in the most expedient time possible
                and without unreasonable delay, consistent with the Personal
                Information Protection Act. Where a breach affects more than 500
                Illinois residents, we will also notify the Illinois Attorney
                General as required by law. Our notification will describe the
                nature of the breach, the type of personal information involved,
                and steps you can take to help protect yourself.
              </p>
            </SubSection>
            <SubSection n="10.3" title="Biometric Information">
              <p>
                PsychPro does not collect, capture, or use biometric identifiers
                or biometric information as defined by the Biometric Information
                Privacy Act. Specifically, although you may upload a profile
                photo, we do not perform facial recognition, do not scan or
                extract facial geometry, and do not use uploaded images to
                identify you or any other person. Your profile photo is stored
                and displayed only as described in this Policy. We do not sell,
                lease, trade, or otherwise profit from any biometric
                information.
              </p>
            </SubSection>
          </Section>

          <Section id="children" n="11" title="Children's Privacy">
            <p>
              The Service is intended for users who are at least the age of
              majority in their jurisdiction, or who use the Service under the
              supervision of an institution or responsible adult where
              permitted. We do not knowingly collect personal information from
              children under the age at which consent is required under
              applicable law. If you believe a child has provided us with
              personal information, please contact us so we can take appropriate
              action.
            </p>
          </Section>

          <Section id="changes" n="12" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we make
              material changes, we will update the &ldquo;Last updated&rdquo;
              date above and, where appropriate, provide additional notice. Your
              continued use of the Service after changes take effect constitutes
              acceptance of the revised Policy.
            </p>
          </Section>

          <Section id="contact" n="13" title="Contact Us">
            <p>
              If you have questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div
              className="rounded-lg p-4 text-sm"
              style={{
                border: "1px solid rgba(118,228,247,0.18)",
                background:
              "linear-gradient(145deg, hsl(var(--surf-hue) 88% 19% / 0.69), hsl(var(--surf-hue) 88% 14% / 0.83))",
              }}
            >
              <p style={{ ...TRACK_NAV, fontSize: 11, color: P.cloud }}>
                PSYCHPRO
              </p>
              <p
                className="mt-2 font-light text-xs"
                style={{ color: P.inkSoft }}
              >
                PsychPro Suites
              </p>
              <p className="mt-1 font-light" style={{ color: P.mist }}>
                <a
                  href="mailto:admin@psychprosuite.com"
                  className="underline"
                  style={{ color: P.surf }}
                >
                  admin@psychprosuite.com
                </a>
              </p>
            </div>
          </Section>
        </div>

        <div
          className="mt-16 pt-6 flex flex-wrap items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(118,228,247,0.15)" }}
        >
          <p className="text-xs" style={{ color: P.inkSoft }}>
            © {new Date().getFullYear()} PsychPro. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/terms" style={{ ...TRACK_NAV, color: P.mist }}>
              TERMS OF SERVICE
            </Link>
            <span style={{ color: P.inkSoft }}>|</span>
            <Link href="/" style={{ ...TRACK_NAV, color: P.mist }}>
              HOME
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2
        className="text-xs flex items-baseline gap-3"
        style={{ ...TRACK_NAV, color: "#fff", fontWeight: 400 }}
      >
        <span style={{ color: P.surf }}>{n}.</span>
        <span>{title.toUpperCase()}</span>
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SubSection({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 space-y-2">
      <h3
        className="text-[11px] flex items-baseline gap-2"
        style={{ ...TRACK_NAV, color: P.cloud, fontWeight: 400 }}
      >
        <span style={{ color: P.surf }}>{n}</span>
        <span>{title.toUpperCase()}</span>
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden style={{ color: P.surf, lineHeight: 1.5 }}>
            ›
          </span>
          <span style={{ color: P.mist }}>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function DefList({ items }: { items: { term: string; def: string }[] }) {
  return (
    <dl className="space-y-2 mt-2">
      {items.map((it) => (
        <div key={it.term} className="flex flex-col sm:flex-row sm:gap-3">
          <dt
            className="text-xs sm:w-40 shrink-0 pt-0.5"
            style={{ ...TRACK_NAV, color: P.cloud, fontWeight: 400 }}
          >
            {it.term.toUpperCase()}
          </dt>
          <dd style={{ color: P.mist }}>{it.def}</dd>
        </div>
      ))}
    </dl>
  );
}
