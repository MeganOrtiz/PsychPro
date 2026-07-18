import { SignIn } from "@clerk/clerk-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { PP } from "@/lib/palette";

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
            colorDanger: PP.red,
            // Overrides Clerk's default orange warning color (e.g. the
            // "You're signing in from a new device" banner) so security
            // notices match the PsychPro cyan palette instead of clashing.
            colorWarning: P.surf,
            borderRadius: "0.75rem",
            fontFamily: "inherit",
          },
          elements: {
            card: `bg-[${P.surface}]/90 border border-black/10 shadow-2xl`,
            headerTitle: `text-[${P.cloud}]`,
            headerSubtitle: `text-[${P.mistSoft}]`,
            formButtonPrimary: `bg-[${P.surf}] hover:bg-[${P.teal}] text-[${P.ink}] font-medium`,
            socialButtonsBlockButton: "border border-black/10 hover:bg-black/5",
            socialButtonsBlockButtonText: `text-[${P.cloud}]`,
            formFieldLabel: `text-[${P.mist}]`,
            formFieldInput: `bg-black/5 border border-black/10 text-[${P.cloud}]`,
            footerActionText: `text-[${P.mistSoft}]`,
            footerActionLink: `text-[${P.surf}] hover:text-[${P.mist}]`,
            dividerLine: "bg-black/10",
            dividerText: `text-[${P.mistSoft}]`,
            identityPreviewText: `text-[${P.cloud}]`,
            identityPreviewEditButton: `text-[${P.surf}]`,
          },
        }}
      />
    </div>
  );
}
