import { Link } from "wouter";
import { Brain } from "lucide-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

const TRACK_NAV: React.CSSProperties = {
  letterSpacing: "0.22em",
  fontFamily: '"Montserrat", sans-serif',
};

const SECTIONS: { id: string; n: string; title: string }[] = [
  { id: "eligibility", n: "1", title: "Eligibility and Accounts" },
  { id: "service", n: "2", title: "The Service" },
  { id: "subscriptions", n: "3", title: "Subscriptions, Plans, and Payment" },
  { id: "user-content", n: "4", title: "User Content" },
  { id: "acceptable-use", n: "5", title: "Acceptable Use" },
  { id: "community", n: "6", title: "Community and Networking Features" },
  { id: "ip", n: "7", title: "Intellectual Property" },
  { id: "dmca", n: "8", title: "Copyright Complaints (DMCA)" },
  { id: "third-parties", n: "9", title: "Third-Party Services" },
  { id: "disclaimers", n: "10", title: "Disclaimers" },
  { id: "liability", n: "11", title: "Limitation of Liability" },
  { id: "indemnity", n: "12", title: "Indemnification" },
  { id: "termination", n: "13", title: "Suspension and Termination" },
  { id: "changes", n: "14", title: "Changes to These Terms" },
  { id: "governing-law", n: "15", title: "Governing Law and Dispute Resolution" },
  { id: "general", n: "16", title: "General" },
  { id: "contact", n: "17", title: "Contact Us" },
];

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
          TERMS OF SERVICE
        </h1>
        <p className="text-xs mb-1" style={{ color: P.inkSoft }}>
          Effective date: June 2026 &middot; Last updated: June 2026
        </p>

        <p
          className="text-sm leading-relaxed font-light mt-10"
          style={{ color: P.mist }}
        >
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of the PsychPro website, applications, and related services
          (collectively, the &ldquo;Service&rdquo;) provided by PsychPro
          (&ldquo;PsychPro,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;). PsychPro is a study platform for neuroscience and
          neuropsychology learners.
        </p>
        <p
          className="text-sm leading-relaxed font-light mt-4"
          style={{ color: P.mist }}
        >
          Please read these Terms carefully. By accessing or using the Service,
          you agree to be bound by these Terms and by our{" "}
          <Link href="/privacy" className="underline" style={{ color: P.surf }}>
            Privacy Policy
          </Link>
          . If you do not agree, do not use the Service.
        </p>

        {/* Table of contents */}
        <nav
          className="mt-10 mb-12 rounded-lg p-5"
          style={{
            border: "1px solid rgba(118,228,247,0.18)",
            background:
              "linear-gradient(145deg, rgba(20,90,116,0.36), rgba(11,62,82,0.50))",
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
          <Section id="eligibility" n="1" title="Eligibility and Accounts">
            <p>
              You must be at least the age of majority in your jurisdiction, or
              have permission from a parent, guardian, or supervising
              institution where permitted, to use the Service. By using the
              Service, you represent that you meet these requirements.
            </p>
            <p>
              You are responsible for the activity that occurs under your
              account and for keeping your account credentials secure. You agree
              to provide accurate information and to keep it up to date. Notify
              us promptly of any unauthorized use of your account.
            </p>
          </Section>

          <Section id="service" n="2" title="The Service">
            <p>
              PsychPro provides study tools, including topic content,
              flashcards, quizzes, study guides, practice exams, progress
              tracking, and, for eligible plans, AI-assisted tools that generate
              study materials from content you provide. We may add, modify, or
              remove features from time to time.
            </p>
            <SubSection n="2.1" title="Educational Use Only — Not Professional Advice">
              <p>
                PsychPro is an educational study tool. Content available through
                the Service, including AI-generated materials, is provided for
                general learning and study purposes only. It is not medical,
                psychological, clinical, diagnostic, legal, or other
                professional advice, and must not be relied upon as a substitute
                for the judgment of a qualified professional or for formal
                academic or clinical instruction. You are solely responsible for
                how you use the materials.
              </p>
            </SubSection>
            <SubSection n="2.2" title="AI-Generated Content">
              <p>
                Certain features use third-party artificial intelligence to
                generate study materials based on content you upload or paste.
                AI-generated output may contain inaccuracies, omissions, or
                errors and should be independently verified. You are responsible
                for reviewing AI-generated materials before relying on them.
              </p>
            </SubSection>
          </Section>

          <Section
            id="subscriptions"
            n="3"
            title="Subscriptions, Plans, and Payment"
          >
            <p>
              PsychPro offers a free tier and paid subscription tiers (Master
              and Scholar). Paid plans provide access to additional features and
              are billed on a recurring monthly or annual basis through our
              third-party payment processor.
            </p>
            <DefList
              items={[
                {
                  term: "Billing",
                  def: "By subscribing, you authorize us and our payment processor to charge your selected payment method on a recurring basis until you cancel.",
                },
                {
                  term: "Renewal",
                  def: "Subscriptions renew automatically at the end of each billing period unless cancelled before the renewal date.",
                },
                {
                  term: "Cancellation",
                  def: "You may cancel at any time through the billing portal. Cancellation stops future charges; access to paid features generally continues until the end of the current billing period.",
                },
                {
                  term: "Price changes",
                  def: "We may change subscription prices. We will provide notice of changes, which will apply to subsequent billing periods.",
                },
                {
                  term: "Refunds",
                  def: "Except where required by applicable law, payments are non-refundable.",
                },
              ]}
            />
            <p>
              Current subscription prices are set out below. Prices are in U.S.
              dollars and exclude any applicable taxes.
            </p>
            <div
              className="rounded-lg overflow-hidden mt-3"
              style={{ border: "1px solid rgba(118,228,247,0.18)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "rgba(118,228,247,0.06)" }}>
                    <th
                      className="text-left px-4 py-3 font-light"
                      style={{ ...TRACK_NAV, color: P.cloud, fontSize: 10 }}
                    >
                      PLAN
                    </th>
                    <th
                      className="text-left px-4 py-3 font-light"
                      style={{ ...TRACK_NAV, color: P.cloud, fontSize: 10 }}
                    >
                      MONTHLY
                    </th>
                    <th
                      className="text-left px-4 py-3 font-light"
                      style={{ ...TRACK_NAV, color: P.cloud, fontSize: 10 }}
                    >
                      ANNUAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderTop: "1px solid rgba(118,228,247,0.12)" }}>
                    <td className="px-4 py-3" style={{ color: P.cloud }}>
                      PsychPro Master
                    </td>
                    <td className="px-4 py-3" style={{ color: P.mist }}>
                      $9.99 / month
                    </td>
                    <td className="px-4 py-3" style={{ color: P.mist }}>
                      $79.99 / year
                    </td>
                  </tr>
                  <tr style={{ borderTop: "1px solid rgba(118,228,247,0.12)" }}>
                    <td className="px-4 py-3" style={{ color: P.cloud }}>
                      PsychPro Scholar
                    </td>
                    <td className="px-4 py-3" style={{ color: P.mist }}>
                      $19.99 / month
                    </td>
                    <td className="px-4 py-3" style={{ color: P.mist }}>
                      $159.99 / year
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs" style={{ color: P.inkSoft }}>
              Annual plans are offered at a discount relative to twelve months
              at the monthly rate. We may update these prices as described
              above; the prices applicable to you are those displayed at the
              time of purchase or renewal.
            </p>
          </Section>

          <Section id="user-content" n="4" title="User Content">
            <p>
              &ldquo;User Content&rdquo; means any content you upload, paste,
              submit, or otherwise make available through the Service, including
              study materials, profile information, and feedback.
            </p>
            <SubSection n="4.1" title="Ownership and License">
              <p>
                You retain ownership of your User Content. You grant PsychPro a
                limited, non-exclusive, worldwide, royalty-free license to host,
                store, reproduce, and process your User Content solely to
                operate and provide the Service to you, including transmitting
                relevant portions to our AI provider to generate the materials
                you request.
              </p>
            </SubSection>
            <SubSection n="4.2" title="Your Responsibilities">
              <p>
                You represent that you have the rights necessary to submit your
                User Content and that it does not infringe the rights of others
                or violate any law. Do not upload content that is unlawful,
                infringing, confidential without authorization, or that you are
                not permitted to share.
              </p>
            </SubSection>
            <SubSection n="4.3" title="We Use Your Content Only With Your Permission">
              <p>
                PsychPro accesses and uses your User Content only as needed to
                provide the Service to you and only for the purposes you
                authorize when you use a feature. For example, when you upload
                or paste source material to generate study tools, you are
                directing us to process that material for that purpose. We do
                not use your User Content to train third-party AI models, do not
                sell it, and do not use it for unrelated purposes, except as
                required by law or as otherwise described in these Terms and our{" "}
                <Link
                  href="/privacy"
                  className="underline"
                  style={{ color: P.surf }}
                >
                  Privacy Policy
                </Link>
                . You may stop this processing at any time by ceasing to use the
                relevant feature, and you may request deletion of your User
                Content as described in our Privacy Policy. The permission you
                grant us in Section 4.1 ends when your User Content is deleted,
                except for residual copies retained for a limited period in
                routine backups or as required by law.
              </p>
            </SubSection>
            <SubSection n="4.4" title="We Are Not Responsible for User Content">
              <p>
                User Content is the sole responsibility of the person who
                submitted it. PsychPro does not create, endorse, verify, or take
                ownership of User Content, and we are not responsible or liable
                for it, including for its accuracy, legality, or whether the
                person who submitted it had the right to do so. We do not
                routinely monitor User Content, but we may review, remove, or
                disable access to any User Content that we believe, in our
                reasonable discretion, infringes the rights of others, violates
                these Terms or applicable law, or is otherwise objectionable. By
                using the Service, you acknowledge that you may encounter User
                Content submitted by others and that you use it at your own
                risk.
              </p>
            </SubSection>
          </Section>

          <Section id="acceptable-use" n="5" title="Acceptable Use">
            <p>You agree not to:</p>
            <BulletList
              items={[
                "Use the Service for any unlawful purpose or in violation of these Terms.",
                "Attempt to gain unauthorized access to the Service, other accounts, or our systems.",
                "Interfere with, disrupt, or place an unreasonable load on the Service, including through automated scraping or excessive requests.",
                "Reverse engineer, copy, or resell the Service except as permitted by law.",
                "Upload malicious code or content that is harmful, harassing, hateful, or infringing.",
                "Misuse community or networking features, including unsolicited or abusive contact with other members.",
              ]}
            />
          </Section>

          <Section
            id="community"
            n="6"
            title="Community and Networking Features"
          >
            <p>
              Optional community features, such as connection suggestions and
              email introductions, operate on a double opt-in basis and are
              controlled by your profile preferences. When you participate, you
              agree to interact respectfully and lawfully. We may suspend or
              remove access to these features for conduct that violates these
              Terms. For details on how related information is handled, see our{" "}
              <Link
                href="/privacy"
                className="underline"
                style={{ color: P.surf }}
              >
                Privacy Policy
              </Link>
              .
            </p>
          </Section>

          <Section id="ip" n="7" title="Intellectual Property">
            <p>
              The Service, including its software, source code, design, text,
              graphics, logos, the PsychPro name and marks, and built-in study
              content (excluding User Content), is owned by PsychPro or its
              licensors and is protected by copyright, trademark, and other
              intellectual property laws. These are and remain the exclusive
              property of PsychPro and its licensors. We grant you a limited,
              non-exclusive, non-transferable, revocable license to access and
              use the Service for your personal, non-commercial study use,
              subject to these Terms. You may not copy, reproduce, distribute,
              modify, create derivative works from, publicly display, sell, or
              otherwise exploit any part of the Service or its content without
              our prior written permission. All rights not expressly granted are
              reserved.
            </p>
          </Section>

          <Section id="dmca" n="8" title="Copyright Complaints (DMCA)">
            <p>
              We respect the intellectual property rights of others and expect
              our users to do the same. We respond to notices of alleged
              copyright infringement that comply with the U.S. Digital
              Millennium Copyright Act (DMCA). If you believe that content
              available through the Service infringes a copyright you own or
              control, you may send a written notice to our designated agent
              that includes the following:
            </p>
            <BulletList
              items={[
                "A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.",
                "Identification of the copyrighted work claimed to have been infringed.",
                "Identification of the material claimed to be infringing and information reasonably sufficient to let us locate it (for example, the URL or a description of where it appears in the Service).",
                "Your name, mailing address, telephone number, and email address.",
                "A statement that you have a good-faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.",
                "A statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the owner's behalf.",
              ]}
            />
            <p>
              Upon receiving a valid notice, we will remove or disable access to
              the allegedly infringing material in accordance with the DMCA. We
              may also remove material and terminate access for users who
              repeatedly infringe the rights of others. If you believe your
              material was removed in error, you may submit a counter-notice
              containing the information required by the DMCA. Notices and
              counter-notices should be sent to our designated agent:
            </p>
            <div
              className="rounded-lg p-4 text-sm"
              style={{
                border: "1px solid rgba(118,228,247,0.18)",
                background:
              "linear-gradient(145deg, rgba(20,90,116,0.36), rgba(11,62,82,0.50))",
                color: P.cloud,
              }}
            >
              <p style={{ ...TRACK_NAV, fontSize: 11 }}>
                PSYCHPRO — DMCA DESIGNATED AGENT
              </p>
              <p className="mt-2 font-light" style={{ color: P.mist }}>
                PsychPro is a registered literary work under the Digital
                Millennium Copyright Act (DMCA). Send notices to{" "}
                <a
                  href="mailto:admin@psychprosuite.com"
                  className="underline"
                  style={{ color: P.surf }}
                >
                  admin@psychprosuite.com
                </a>
                .
              </p>
            </div>
          </Section>

          <Section id="third-parties" n="9" title="Third-Party Services">
            <p>
              The Service relies on third-party providers, including
              authentication, payment processing, AI generation, hosting, and
              email delivery. Your use of those features may be subject to the
              third parties&apos; own terms and policies. We are not responsible
              for third-party services and do not control their practices.
            </p>
          </Section>

          <Section id="disclaimers" n="10" title="Disclaimers">
            <p
              className="uppercase tracking-wide"
              style={{ color: P.cloud, fontWeight: 400, letterSpacing: "0.04em" }}
            >
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, whether express,
              implied, or statutory, including implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement. We do not warrant that the Service will be
              uninterrupted, error-free, or that content, including
              AI-generated content, will be accurate or complete.
            </p>
          </Section>

          <Section id="liability" n="11" title="Limitation of Liability">
            <p
              className="uppercase tracking-wide"
              style={{ color: P.cloud, fontWeight: 400, letterSpacing: "0.04em" }}
            >
              To the maximum extent permitted by law, PsychPro and its
              affiliates, officers, employees, and agents will not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages, or for any loss of profits, data, or goodwill, arising
              out of or relating to your use of the Service. Our total liability
              for any claim relating to the Service will not exceed the greater
              of the amounts you paid to us in the twelve months preceding the
              claim or one hundred U.S. dollars.
            </p>
          </Section>

          <Section id="indemnity" n="12" title="Indemnification">
            <p>
              You agree to indemnify and hold harmless PsychPro and its
              affiliates from any claims, damages, liabilities, and expenses
              (including reasonable legal fees) arising out of your User
              Content, your use of the Service, or your violation of these Terms
              or applicable law.
            </p>
          </Section>

          <Section id="termination" n="13" title="Suspension and Termination">
            <p>
              We may suspend or terminate your access to the Service at any time
              if you violate these Terms or if we reasonably believe it is
              necessary to protect the Service or other users. You may stop
              using the Service and may request deletion of your account at any
              time. Provisions that by their nature should survive termination
              will survive, including ownership, disclaimers, limitations of
              liability, and indemnification.
            </p>
          </Section>

          <Section id="changes" n="14" title="Changes to These Terms">
            <p>
              We may modify these Terms from time to time. When we make material
              changes, we will update the &ldquo;Last updated&rdquo; date and,
              where appropriate, provide additional notice. Your continued use
              of the Service after the changes take effect constitutes
              acceptance of the revised Terms.
            </p>
          </Section>

          <Section
            id="governing-law"
            n="15"
            title="Governing Law and Dispute Resolution"
          >
            <p>
              These Terms are governed by the laws of the United States,
              without regard to its conflict-of-laws principles. Subject to any
              binding dispute-resolution mechanism stated below, you and
              PsychPro agree that any dispute arising out of or relating to
              these Terms or the Service will be brought exclusively in the
              state or federal courts, and you consent to the personal
              jurisdiction of those courts.
            </p>
          </Section>

          <Section id="general" n="16" title="General">
            <DefList
              items={[
                {
                  term: "Entire agreement",
                  def: "These Terms and the Privacy Policy constitute the entire agreement between you and PsychPro regarding the Service.",
                },
                {
                  term: "Severability",
                  def: "If any provision is found unenforceable, the remaining provisions remain in effect.",
                },
                {
                  term: "No waiver",
                  def: "Our failure to enforce any provision is not a waiver of our right to do so later.",
                },
                {
                  term: "Assignment",
                  def: "You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of assets.",
                },
              ]}
            />
          </Section>

          <Section id="contact" n="17" title="Contact Us">
            <p>
              If you have questions about these Terms, please contact us:
            </p>
            <div
              className="rounded-lg p-4 text-sm"
              style={{
                border: "1px solid rgba(118,228,247,0.18)",
                background:
              "linear-gradient(145deg, rgba(20,90,116,0.36), rgba(11,62,82,0.50))",
              }}
            >
              <p style={{ ...TRACK_NAV, fontSize: 11, color: P.cloud }}>
                PSYCHPRO
              </p>
              <p
                className="mt-2 font-light text-xs"
                style={{ color: P.inkSoft }}
              >
                PsychPro
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
            <Link href="/privacy" style={{ ...TRACK_NAV, color: P.mist }}>
              PRIVACY POLICY
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
            className="text-xs sm:w-36 shrink-0 pt-0.5"
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
