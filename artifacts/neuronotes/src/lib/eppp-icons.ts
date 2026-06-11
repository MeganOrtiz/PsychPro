import {
  ClipboardList,
  Atom,
  Brain,
  Users,
  Baby,
  Stethoscope,
  BarChart3,
  Scale,
  BookOpen,
} from "lucide-react";
import type React from "react";

// Maps an EPPP content-domain name to a representative lucide icon. Shared by
// the EPPP Suite knowledge rail/panes and the EPPP dashboard domain cards so the
// iconography stays consistent across both surfaces.
export function knowledgeDomainIcon(
  name: string,
): React.ComponentType<{ className?: string }> {
  const n = name.toLowerCase();
  if (n.includes("assessment") || n.includes("diagnosis")) return ClipboardList;
  if (n.includes("biological")) return Atom;
  if (n.includes("cognitive") || n.includes("affective")) return Brain;
  if (n.includes("social") || n.includes("cultural")) return Users;
  if (n.includes("growth") || n.includes("lifespan") || n.includes("development"))
    return Baby;
  if (
    n.includes("treatment") ||
    n.includes("intervention") ||
    n.includes("prevention") ||
    n.includes("supervision")
  )
    return Stethoscope;
  if (n.includes("research") || n.includes("statistic")) return BarChart3;
  if (n.includes("ethic") || n.includes("legal") || n.includes("professional"))
    return Scale;
  return BookOpen;
}
