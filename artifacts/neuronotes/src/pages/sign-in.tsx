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
            // Deep-cerulean translucent glass — pigment, no cyan glow. Lower
            // opacity + strong backdrop blur let the smoke wallpaper diffuse
            // through so the card reads as real glass (not a flat opaque box);
            // depth comes from the bright top edge + soft drop shadow.
            card: {
              background:
                "linear-gradient(160deg, hsl(192 92% 20% / 0.70), hsl(192 96% 12% / 0.82))",
              border: "1px solid rgba(196, 232, 242, 0.22)",
              borderRadius: "20px",
              backdropFilter: "blur(30px) saturate(155%)",
              WebkitBackdropFilter: "blur(30px) saturate(155%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.20), 0 32px 70px -34px rgba(0,0,0,0.78)",
            },
            // Kill Clerk's default lighter footer band so the whole card reads
            // as one cohesive glass panel (was a mismatched two-tone block).
            footer: {
              background: "transparent",
              borderTop: "1px solid rgba(196, 232, 242, 0.10)",
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
