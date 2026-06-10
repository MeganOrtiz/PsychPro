import { ChevronLeft } from "lucide-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

// Replaces the old breadcrumb trail with a single "Back" control. It simply
// returns the user to the previous page (browser history) when clicked, instead
// of linking to a fixed parent route. The `items` prop is accepted but ignored
// so existing callers keep compiling.
export function Breadcrumbs(_props: { items?: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Back" className="mb-4">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1 text-sm hover:underline cursor-pointer"
        style={{ color: P.paper }}
        data-testid="button-back"
      >
        <ChevronLeft className="w-4 h-4 flex-shrink-0" />
        Back
      </button>
    </nav>
  );
}
