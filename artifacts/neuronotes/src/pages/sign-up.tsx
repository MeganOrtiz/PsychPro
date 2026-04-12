import { SignUp } from "@clerk/react";
import { useLocation } from "wouter";

export default function SignUpPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <button
          className="text-muted-foreground hover:text-foreground mb-4 text-sm flex items-center gap-1"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <SignUp
          fallbackRedirectUrl="/onboarding"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
