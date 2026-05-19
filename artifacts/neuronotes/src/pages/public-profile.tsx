import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrCreateAnonymousUserId } from "@/lib/anonymous-user";

type PublicProfile = {
  userId: string;
  displayName: string | null;
  profilePhotoUrl: string | null;
  currentRole: string | null;
  institution: string | null;
  bio: string | null;
};

export default function PublicProfilePage() {
  const params = useParams<{ userId: string }>();
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "not-found">("loading");

  useEffect(() => {
    if (!params.userId) return;
    fetch(`/api/profile/public/${encodeURIComponent(params.userId)}`, {
      headers: { "X-User-Id": getOrCreateAnonymousUserId() },
    })
      .then(async (r) => {
        if (r.ok) { setProfile(await r.json()); setState("ok"); }
        else setState("not-found");
      })
      .catch(() => setState("not-found"));
  }, [params.userId]);

  return (
    <div className="min-h-full study-page-bg" data-testid="public-profile-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/featured-work")} className="mb-4 gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Featured Work
        </Button>
        {state === "loading" ? (
          <Skeleton className="h-64 rounded-2xl" />
        ) : state === "not-found" ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
            <UserIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-foreground mb-1">Profile not available</p>
            <p className="text-sm">This contributor's profile is private or no longer exists.</p>
          </div>
        ) : profile ? (
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4 mb-5">
              {profile.profilePhotoUrl ? (
                <img
                  src={profile.profilePhotoUrl.startsWith("/objects/") ? `/api/storage${profile.profilePhotoUrl}` : profile.profilePhotoUrl}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-primary" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-foreground" data-testid="text-display-name">{profile.displayName ?? "Contributor"}</h1>
                {(profile.currentRole || profile.institution) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {[profile.currentRole, profile.institution].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
            {profile.bio && (
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
