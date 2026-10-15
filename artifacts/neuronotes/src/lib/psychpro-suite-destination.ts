/** StudyAccess is server-derived and already includes admin/legacy/trial access. */
export function psychproSuiteDestination(hasAccess: boolean | undefined, isAdmin = false) {
  return hasAccess || isAdmin ? "/dashboard" : "/psychpro/welcome";
}
