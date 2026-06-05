import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs mb-4 flex-wrap"
      data-testid="breadcrumbs"
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5 min-w-0">
            {idx > 0 && (
              <ChevronRight
                className="w-3 h-3 flex-shrink-0"
                style={{ color: P.inkSoft }}
              />
            )}
            {isLast || !item.href ? (
              <span
                className="truncate"
                style={{ color: P.paper }}
                data-testid="crumb-current"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link href={item.href}>
                <span
                  className="hover:underline cursor-pointer truncate"
                  style={{ color: P.paper }}
                  data-testid={`crumb-${idx}`}
                >
                  {item.label}
                </span>
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
