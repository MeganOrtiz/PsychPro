import { SignIn } from "@clerk/clerk-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center px-4"
      style={{
        background: `radial-gradient(ellipse at center, ${P.bgSoft} 0%, ${P.bg} 60%, ${P.ink} 100%)`,
      }}
    >
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={`${basePath}/dashboard`}
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
            card: `bg-[${P.surface}]/90 border border-white/10 backdrop-blur-md shadow-2xl`,
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
