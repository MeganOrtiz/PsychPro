/** StudyAccess is server-derived and already includes admin/legacy/trial access. */
export function psychproSuiteDestination(hasAccess: boolean | undefined, isAdmin = false, canStart?: boolean) {
  if (hasAccess || isAdmin) return "/dashboard";
  return canStart === false ? "/subscription" : "/onboarding?suite=psychpro";
}
