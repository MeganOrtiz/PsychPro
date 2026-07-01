import { SignIn } from "@clerk/clerk-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  return (
    <div className="study-page-bg flex min-h-[100dvh] items-center justify-center px-4">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={`${basePath}/welcome`}
        appearance={{
          variables: {
            colorPrimary: P.surf,
            colorBackground: P.surface,
            colorText: P.cloud,
            colorTextSecondary: P.mistSoft,
            colorInputBackground: P.ink,
            colorInputText: P.cloud,
            colorDanger: "#ef4444",
            // Overrides Clerk's default orange warning color (e.g. the
            // "You're signing in from a new device" banner) so security
            // notices match the PsychPro cyan palette instead of clashing.
            colorWarning: P.surf,
            borderRadius: "0.75rem",
            fontFamily: "inherit",
          },
          elements: {
            // Canonical deep-cerulean pigment glass (matches the main-site
            // .bg-card / EPPP .epd-card) so the auth card reads as part of the
            // same surface system — pigment-only, no cyan glow.
            card: {
              background:
                "linear-gradient(145deg, hsl(192 100% 17% / 0.95), hsl(192 100% 11% / 0.99))",
              border: "1px solid rgba(196, 232, 242, 0.22)",
              backdropFilter: "blur(5px) saturate(190%)",
              WebkitBackdropFilter: "blur(5px) saturate(190%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.12), 0 22px 52px -40px rgba(0,0,0,0.80)",
            },
            headerTitle: "text-white",
            headerSubtitle: `text-[${P.mistSoft}]`,
            formButtonPrimary: `bg-[${P.surf}] hover:bg-[${P.teal}] text-[${P.ink}] font-medium`,
            socialButtonsBlockButton: "border border-white/10 hover:bg-white/5",
            socialButtonsBlockButtonText: "text-white",
            formFieldLabel: `text-[${P.mist}]`,
            formFieldInput: "bg-white/5 border border-white/10 text-white",
            footerActionText: `text-[${P.mistSoft}]`,
            footerActionLink: `text-[${P.surf}] hover:text-[${P.mist}]`,
            dividerLine: "bg-white/10",
            dividerText: `text-[${P.mistSoft}]`,
            identityPreviewText: "text-white",
            identityPreviewEditButton: `text-[${P.surf}]`,
          },
        }}
      />
    </div>
  );
}
