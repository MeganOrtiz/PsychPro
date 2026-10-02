import { cn } from "@/lib/utils";

// Both suites share the same navigation treatment; their destinations stay separate.
const NAV_ITEM_BASE =
  "nav-glass group relative flex items-center gap-2.5 px-3 py-2 rounded-[8px] cursor-pointer transition-all duration-200 ease-in-out border";

export function navItemClass(isActive: boolean) {
  return cn(
    NAV_ITEM_BASE,
    isActive ? "nav-glass-active suite-nav-item-active" : "nav-glass-idle suite-nav-item-idle",
  );
}