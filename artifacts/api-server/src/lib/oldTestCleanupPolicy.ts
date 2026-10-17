import { createHash } from "node:crypto";

export const CLEANUP_CONFIRMATION = "DELETE OLD TEST DATA";
export const PROTECTED_CLEANUP_EMAIL = "admin@psychprosuite.com";

// Fixed inventory approved by the owner. Never expand this from a runtime
// query: accounts created after this reset must not become deletion targets.
export const OLD_TEST_ACCOUNT_IDS = [
  "383657ae-3272-493d-a3b6-fd5e743f1712",
  "3e8f3883-0261-49dc-8c2e-851d60a06671",
  "53933021",
  "58e7e771-76bb-4666-8496-50a046932b38",
  "697bbbe4-2693-4a63-9f27-c4ea0158248a",
  "a95cded0-606b-4a35-812d-76d20c2a1cb8",
  "ae39e988-0167-4b31-a299-9714ecc8f37b",
  "b0f985a3-350b-4f66-87c1-c6111af143a8",
  "c54fcbb4-d8eb-4e75-87f2-309ac514a2f8",
  "e0182322-c946-4a80-8970-80dc885f6a1f",
  "ec5607f3-7e6f-4547-ab6b-9008a0ce5b0f",
  "ed956643-1091-4b29-b52c-dc28c3136e1f",
  "f3259d86-38ea-4b7e-9575-992bfdb6b1bf",
  "owner",
  "user_3CGeUQt2cy430Fs10RfdGcfpav9",
  "user_3E6KEsU7AdTVVdOlWhIRCwkQ2tN",
  "user_3EzFFO76xKqLpuahe2zl3RQPgpu",
  "user_3F36POKPg7R6gXP4HrbZilOb01r",
  "user_3F377Od5S9BPdxV2KNxjuOeESUB",
  "user_3F91JGOsY1PPPrKykL5jmLroIA4",
  "user_3F9gz8nq6kLe3r88eEAiTKt3Jne",
  "user_3FJkwhRoZ2cBL8FfSrEfqlSVlQQ",
  "user_3FpJbefkMBEuTmERvHmr0TdP4DR",
  "user_3G4j2vhh4Tu263Kp3FhQPNbnr17",
  "user_3HWLuLe88es2JJJEdpO2NrT1vGv",
  "user_3J0u3jPdVRUemSjSUA76ZEhB8nX",
  "user_3KkV6Lsx5vkNJBxaDFzuvGQq33u",
  "user_3KmyxIrCZxBOc0xmHjYJzGEFybX",
] as const;
const approvedIds = new Set<string>(OLD_TEST_ACCOUNT_IDS);

export type CleanupAccount = {
  id: string;
  email: string | null;
  stripeSubscriptionId: string | null;
  epppSubscriptionId: string | null;
};

export function isProtectedCleanupEmail(email: string | null): boolean {
  return email?.trim().toLowerCase() === PROTECTED_CLEANUP_EMAIL;
}

export function cleanupBlockReason(
  account: CleanupAccount,
  callerId: string,
  identityExists: boolean,
  hasUploadedSource: boolean,
): string | null {
  if (!approvedIds.has(account.id)) return "Outside the approved historical inventory";
  if (account.id === callerId || isProtectedCleanupEmail(account.email)) return "Protected account";
  if (account.stripeSubscriptionId || account.epppSubscriptionId) return "Subscription reference present";
  if (identityExists) return "Sign-in still exists";
  if (hasUploadedSource) return "Uploaded source requires separate review";
  return null;
}

export function cleanupFingerprint(accounts: CleanupAccount[], callerId: string): string {
  return createHash("sha256").update(JSON.stringify({
    callerId,
    accounts: [...accounts].sort((a, b) => a.id.localeCompare(b.id)),
  })).digest("hex");
}

export class CleanupSafetyError extends Error {
  constructor(message: string, public status = 409) {
    super(message);
  }
}

export function assertCleanupConfirmation(confirmation: string, supplied: string, fresh: string): void {
  if (confirmation !== CLEANUP_CONFIRMATION) throw new CleanupSafetyError("Type DELETE OLD TEST DATA to confirm.", 400);
  if (supplied !== fresh) throw new CleanupSafetyError("The preview changed. Review a fresh preview before deleting.");
}
