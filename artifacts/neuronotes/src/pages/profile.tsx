import { useEffect, useMemo, useRef, useState } from "react";
import { User as UserIcon, Save, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getCurrentUserId } from "@/lib/user-id";
import {
  INTERESTS_TAXONOMY,
  PROFILE_ROLES,
  MAX_BIO_LENGTH,
  MAX_DISPLAY_NAME_LENGTH,
  MAX_INSTITUTION_LENGTH,
  MAX_INTERESTS,
} from "@workspace/community";

type Profile = {
  userId: string;
  displayName: string | null;
  profilePhotoUrl: string | null;
  currentRole: string | null;
  institution: string | null;
  bio: string | null;
  interests: string[];
  prefSuggestConnections: boolean;
  prefNetworkingIntros: boolean;
  prefShowOnFeaturedWork: boolean;
};

type FieldErrors = Partial<Record<
  "displayName" | "currentRole" | "institution" | "bio" | "interests" | "profilePhotoUrl",
  string
>>;

const FIELD_KEYS: ReadonlyArray<keyof FieldErrors> = [
  "displayName",
  "currentRole",
  "institution",
  "bio",
  "interests",
  "profilePhotoUrl",
];

function extractFieldErrors(body: unknown): FieldErrors | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { fieldErrors?: unknown }).fieldErrors;
  if (!raw || typeof raw !== "object") return null;
  const src = raw as Record<string, unknown>;
  const out: FieldErrors = {};
  for (const key of FIELD_KEYS) {
    const v = src[key];
    if (typeof v === "string") out[key] = v;
  }
  return Object.keys(out).length > 0 ? out : null;
}

function userHeaders(): HeadersInit {
  return { "X-User-Id": getCurrentUserId(), "Content-Type": "application/json" };
}

function initialsFor(name: string | null | undefined): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "G";
  const parts = trimmed.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "G";
}

function photoSrc(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `/api/storage${path}`;
  return path;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [currentRole, setCurrentRole] = useState<string>("");
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [prefSuggestConnections, setPrefSuggestConnections] = useState(false);
  const [prefNetworkingIntros, setPrefNetworkingIntros] = useState(false);
  const [prefShowOnFeaturedWork, setPrefShowOnFeaturedWork] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profile/me", { headers: userHeaders() });
        if (!res.ok) throw new Error(`load failed: ${res.status}`);
        const p = (await res.json()) as Profile;
        if (cancelled) return;
        setDisplayName(p.displayName ?? "");
        setCurrentRole(p.currentRole ?? "");
        setInstitution(p.institution ?? "");
        setBio(p.bio ?? "");
        setInterests(p.interests ?? []);
        setPhotoPath(p.profilePhotoUrl ?? null);
        setPrefSuggestConnections(p.prefSuggestConnections);
        setPrefNetworkingIntros(p.prefNetworkingIntros);
        setPrefShowOnFeaturedWork(p.prefShowOnFeaturedWork);
      } catch (err) {
        console.error("[profile] load error", err);
        toast.error("Couldn't load your profile. Please refresh and try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const interestCount = interests.length;
  const atCap = interestCount >= MAX_INTERESTS;
  const bioLength = bio.length;

  function toggleInterest(tag: string) {
    setFieldErrors((p) => ({ ...p, interests: undefined }));
    setInterests((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= MAX_INTERESTS) {
        toast.error(`You can pick up to ${MAX_INTERESTS} interests. Remove one to add another.`);
        return prev;
      }
      return [...prev, tag];
    });
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please pick an image file (PNG, JPG, etc.).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: userHeaders(),
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!urlRes.ok) throw new Error(`request-url failed: ${urlRes.status}`);
      const { uploadURL, objectPath } = (await urlRes.json()) as {
        uploadURL: string;
        objectPath: string;
      };
      const putRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error(`upload failed: ${putRes.status}`);
      setPhotoPath(objectPath);
      toast.success("Photo uploaded. Don't forget to save your profile.", {
        duration: 4000,
        position: "bottom-right",
      });
    } catch (err) {
      console.error("[profile] photo upload error", err);
      toast.error("Couldn't upload your photo. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function validateClient(): FieldErrors {
    const errs: FieldErrors = {};
    const trimmedName = displayName.trim();
    if (!trimmedName) errs.displayName = "Display name is required.";
    else if (trimmedName.length > MAX_DISPLAY_NAME_LENGTH)
      errs.displayName = `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`;
    if (institution.trim().length > MAX_INSTITUTION_LENGTH)
      errs.institution = `Institution must be ${MAX_INSTITUTION_LENGTH} characters or fewer.`;
    if (bio.length > MAX_BIO_LENGTH)
      errs.bio = `Bio must be ${MAX_BIO_LENGTH} characters or fewer (currently ${bio.length}).`;
    if (interests.length > MAX_INTERESTS)
      errs.interests = `Pick up to ${MAX_INTERESTS} interests.`;
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clientErrs = validateClient();
    setFieldErrors(clientErrs);
    if (Object.keys(clientErrs).length > 0) return;

    setSaving(true);
    let res: Response;
    try {
      res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: userHeaders(),
        body: JSON.stringify({
          displayName: displayName.trim(),
          currentRole: currentRole || null,
          institution: institution.trim() || null,
          bio: bio || null,
          interests,
          profilePhotoUrl: photoPath,
          prefSuggestConnections,
          prefNetworkingIntros,
          prefShowOnFeaturedWork,
        }),
      });
    } catch (networkErr) {
      console.error("[profile] network error", networkErr);
      toast.error("Can't reach the server. Check your connection and try again.");
      setSaving(false);
      return;
    }

    let body: unknown = null;
    try { body = await res.clone().json(); } catch { /* ignore */ }

    if (res.ok) {
      setFieldErrors({});
      window.dispatchEvent(new CustomEvent("psychpro:profile-updated"));
      toast.success("Profile saved.", { duration: 4000, position: "bottom-right" });
      setSaving(false);
      return;
    }

    console.error(`[profile] save failed: ${res.status}`, body);
    const serverErrs = extractFieldErrors(body);
    if (res.status === 400 && serverErrs) {
      setFieldErrors(serverErrs);
      toast.error("Please fix the highlighted fields and try again.");
    } else if (res.status >= 500) {
      toast.error("Something went wrong on our end. Please try again in a minute.");
    } else {
      toast.error(`Couldn't save profile (error ${res.status}). Please try again.`);
    }
    setSaving(false);
  }

  const photoUrl = useMemo(() => photoSrc(photoPath), [photoPath]);

  return (
    <div className="min-h-full study-page-bg" data-testid="profile-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Set up how you show up in the PsychPro community.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-12 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading your profile…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="bg-card p-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border border-white/15"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/15 border border-white/15 flex items-center justify-center text-2xl font-semibold text-foreground">
                      {initialsFor(displayName)}
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    data-testid="button-upload-photo"
                  >
                    <Camera className="w-4 h-4" />
                    {photoPath ? "Replace photo" : "Upload photo"}
                  </Button>
                  {photoPath && (
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground text-left"
                      onClick={() => setPhotoPath(null)}
                    >
                      Remove photo
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="profile-name">
                  Display name <span className="text-red-400">*</span>
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={displayName}
                  maxLength={MAX_DISPLAY_NAME_LENGTH + 20}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (fieldErrors.displayName) setFieldErrors((p) => ({ ...p, displayName: undefined }));
                  }}
                  placeholder="e.g., Dr. Jane Doe"
                  aria-invalid={!!fieldErrors.displayName}
                  className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                    fieldErrors.displayName
                      ? "border-red-400/60 focus:ring-red-400/60"
                      : "border-border focus:ring-primary"
                  }`}
                  data-testid="input-display-name"
                />
                {fieldErrors.displayName && (
                  <p className="mt-1.5 text-xs text-red-400" role="alert">{fieldErrors.displayName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="profile-role">
                    Current role
                  </label>
                  <select
                    id="profile-role"
                    value={currentRole}
                    onChange={(e) => {
                      setCurrentRole(e.target.value);
                      if (fieldErrors.currentRole) setFieldErrors((p) => ({ ...p, currentRole: undefined }));
                    }}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      fieldErrors.currentRole
                        ? "border-red-400/60 focus:ring-red-400/60"
                        : "border-border focus:ring-primary"
                    }`}
                    data-testid="select-role"
                  >
                    <option value="">Select a role…</option>
                    {PROFILE_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {fieldErrors.currentRole && (
                    <p className="mt-1.5 text-xs text-red-400" role="alert">{fieldErrors.currentRole}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="profile-institution">
                    Institution <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="profile-institution"
                    type="text"
                    value={institution}
                    onChange={(e) => {
                      setInstitution(e.target.value);
                      if (fieldErrors.institution) setFieldErrors((p) => ({ ...p, institution: undefined }));
                    }}
                    placeholder="e.g., University of Somewhere"
                    className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                      fieldErrors.institution
                        ? "border-red-400/60 focus:ring-red-400/60"
                        : "border-border focus:ring-primary"
                    }`}
                    data-testid="input-institution"
                  />
                  {fieldErrors.institution && (
                    <p className="mt-1.5 text-xs text-red-400" role="alert">{fieldErrors.institution}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground" htmlFor="profile-bio">
                    Bio <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <span className={`text-xs ${bioLength > MAX_BIO_LENGTH ? "text-red-400" : "text-muted-foreground"}`}>
                    {bioLength} / {MAX_BIO_LENGTH}
                  </span>
                </div>
                <textarea
                  id="profile-bio"
                  value={bio}
                  rows={4}
                  onChange={(e) => {
                    setBio(e.target.value);
                    if (fieldErrors.bio) setFieldErrors((p) => ({ ...p, bio: undefined }));
                  }}
                  placeholder="A short intro — research interests, current work, what you're looking for."
                  aria-invalid={!!fieldErrors.bio}
                  className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 ${
                    fieldErrors.bio
                      ? "border-red-400/60 focus:ring-red-400/60"
                      : "border-border focus:ring-primary"
                  }`}
                  data-testid="textarea-bio"
                />
                {fieldErrors.bio && (
                  <p className="mt-1.5 text-xs text-red-400" role="alert">{fieldErrors.bio}</p>
                )}
              </div>
            </div>

            <div className="bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Clinical & research interests</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pick up to {MAX_INTERESTS}. These power Featured Work tagging and Connections matching.
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    atCap
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-white/15 bg-white/[0.05] text-muted-foreground"
                  }`}
                  data-testid="text-interests-count"
                >
                  {interestCount} of {MAX_INTERESTS} selected
                </span>
              </div>

              {fieldErrors.interests && (
                <p className="text-xs text-red-400" role="alert">{fieldErrors.interests}</p>
              )}

              <div className="space-y-4">
                {INTERESTS_TAXONOMY.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-semibold text-white/55 uppercase tracking-wider mb-2">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag) => {
                        const selected = interests.includes(tag);
                        const disabled = !selected && atCap;
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleInterest(tag)}
                            disabled={disabled}
                            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                              selected
                                ? "border-primary bg-primary/15 text-primary"
                                : disabled
                                  ? "border-white/8 bg-white/[0.02] text-white/30 cursor-not-allowed"
                                  : "border-white/15 bg-white/[0.04] text-foreground hover:bg-white/[0.08]"
                            }`}
                            data-testid={`tag-${tag}`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card p-5 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Connect preferences</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You control if and how the community can reach you.
                </p>
              </div>

              <PreferenceToggle
                id="pref-suggest"
                title="Allow PsychPro to suggest connections with users who share my interests"
                description="Lets us surface other members with overlapping interests in your Connections suggestions."
                checked={prefSuggestConnections}
                onCheckedChange={setPrefSuggestConnections}
              />
              <PreferenceToggle
                id="pref-intros"
                title="Open to networking introductions via email"
                description="When both sides opt in, we'll facilitate a one-time email introduction."
                checked={prefNetworkingIntros}
                onCheckedChange={setPrefNetworkingIntros}
              />
              <PreferenceToggle
                id="pref-featured"
                title="Show my profile on featured work submissions"
                description="Your display name and photo appear next to work you submit to Featured Work."
                checked={prefShowOnFeaturedWork}
                onCheckedChange={setPrefShowOnFeaturedWork}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button type="submit" className="gap-2" disabled={saving} data-testid="button-save-profile">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function PreferenceToggle({
  id, title, description, checked, onCheckedChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-foreground cursor-pointer">{title}</label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-1 flex-shrink-0"
        data-testid={`switch-${id}`}
      />
    </div>
  );
}
