import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
// Palette comes from the shared single-source-of-truth file.
// Do NOT redefine a local PALETTE here — it will fork the brand.
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";
import {
  Brain,
  ArrowRight,
  X,
  Search,
  ChevronRight,
  BookOpen,
  Target,
  Heart,
  Boxes,
  Activity,
  Network,
  Compass,
} from "lucide-react";
import {
  BRAIN_STRUCTURES,
  STRUCTURE_INDEX,
  SYSTEM_META,
  type BrainStructure,
  type BrainSystem,
} from "../data/brain-structures";

// =============================================================================
// Brain Lab (image-driven rewrite)
// -----------------------------------------------------------------------------
// The previous version rendered a procedural + GLB-shell 3D brain via
// react-three-fiber. Per user direction we've torn out the entire 3D
// model so the page is a clean slate ready to receive standalone diagram
// images the user will upload. Each uploaded image will become a clickable
// region that opens the structure detail panel.
//
// EVERYTHING else stays exactly as it was so no information is lost:
//   - BRAIN_STRUCTURES data, search, tabs, chip strip
//   - StructureDetail (Overview / Functions / Connections / Clinical tabs)
//   - URL hash sync for shareable focus links
//   - Mobile detail drawer + region-tab auto-switching on selection
// =============================================================================

// 5 high-level tab groups that consolidate the 8 anatomical systems —
// matches how clinicians actually think about regions vs. the granular
// data model.
const TAB_GROUPS = {
  cortex: {
    label: "Cortex",
    icon: Brain,
    systems: ["cortex"] as BrainSystem[],
  },
  limbic: {
    label: "Limbic",
    icon: Heart,
    systems: ["limbic"] as BrainSystem[],
  },
  subcortical: {
    label: "Subcortical",
    icon: Boxes,
    systems: ["diencephalon", "basal-ganglia", "ventricle"] as BrainSystem[],
  },
  brainstem: {
    label: "Brainstem",
    icon: Activity,
    systems: ["brainstem", "cerebellum"] as BrainSystem[],
  },
  whitematter: {
    label: "White Matter",
    icon: Network,
    systems: ["white-matter"] as BrainSystem[],
  },
} as const;
type TabGroup = keyof typeof TAB_GROUPS;
const TAB_KEYS: TabGroup[] = [
  "cortex",
  "limbic",
  "subcortical",
  "brainstem",
  "whitematter",
];

function tabForSystem(system: BrainSystem): TabGroup {
  for (const key of TAB_KEYS) {
    if (TAB_GROUPS[key].systems.includes(system)) return key;
  }
  return "cortex";
}

// ──────────────────────────── UI: search ────────────────────────────

function StructureSearch({
  onSelect,
  onClose,
}: {
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const matches = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return BRAIN_STRUCTURES.slice(0, 12);
    return BRAIN_STRUCTURES.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.shortName.toLowerCase().includes(term) ||
        s.system.toLowerCase().includes(term) ||
        s.functions.some((f) => f.toLowerCase().includes(term)) ||
        s.conditions.some((c) => c.toLowerCase().includes(term)),
    ).slice(0, 12);
  }, [q]);

  return (
    <div
      className="absolute inset-0 z-30 flex items-start justify-center pt-16 px-4"
      style={{ background: `${PALETTE.bg}cc`, backdropFilter: "blur(8px)" }}
      onClick={onClose}
      data-testid="structure-search-overlay"
      role="presentation"
    >
      <div
        className="w-full max-w-xl rounded-2xl border overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${PALETTE.surfaceElev}, ${PALETTE.surface})`,
          borderColor: `${PALETTE.surf}55`,
          boxShadow: `0 30px 80px -30px ${PALETTE.teal}aa`,
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search brain structures"
      >
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: `${PALETTE.steel}66` }}
        >
          <Search className="w-4 h-4" style={{ color: PALETTE.surf }} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search structures, functions, conditions…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: PALETTE.mist }}
            data-testid="input-structure-search"
            onKeyDown={(e) => {
              if (e.key === "Enter" && matches[0]) {
                onSelect(matches[0].id);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/5"
            style={{ color: PALETTE.mist }}
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <ul className="max-h-96 overflow-y-auto py-1">
          {matches.map((s) => {
            const meta = SYSTEM_META[s.system];
            return (
              <li key={s.id}>
                <button
                  onClick={() => onSelect(s.id)}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors"
                  data-testid={`search-result-${s.id}`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: PALETTE.mist }}>
                      {s.name}
                    </div>
                    <div className="text-xs truncate" style={{ color: `${PALETTE.mist}88` }}>
                      {meta.label}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: `${PALETTE.surf}99` }} />
                </button>
              </li>
            );
          })}
          {matches.length === 0 && (
            <li className="px-4 py-6 text-center text-sm" style={{ color: `${PALETTE.mist}88` }}>
              No structures match "{q}"
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

// ──────────────────────────── UI: 5-group top tabs ────────────────────────────

function TopTabs({
  active,
  setActive,
}: {
  active: TabGroup | "all";
  setActive: (g: TabGroup | "all") => void;
}) {
  const items: { value: TabGroup | "all"; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "all", label: "All", Icon: Compass },
    ...TAB_KEYS.map((k) => ({ value: k, label: TAB_GROUPS[k].label, Icon: TAB_GROUPS[k].icon })),
  ];
  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-2xl border overflow-x-auto"
      style={{
        background: `${PALETTE.surface}cc`,
        borderColor: `${PALETTE.steel}99`,
      }}
      role="tablist"
      aria-label="Brain region tabs"
      data-testid="brain-top-tabs"
    >
      {items.map(({ value, label, Icon }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActive(value)}
            className="px-3 md:px-4 py-1.5 rounded-xl text-xs md:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all"
            style={
              isActive
                ? {
                    background: `linear-gradient(135deg, ${PALETTE.surf}, ${PALETTE.teal})`,
                    color: PALETTE.bg,
                    boxShadow: `0 6px 18px -8px ${PALETTE.surf}cc`,
                  }
                : {
                    background: "transparent",
                    color: `${PALETTE.mist}cc`,
                  }
            }
            data-testid={`tab-${value}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

// Horizontal chip strip — shows structures inside the active tab group so
// users can pick by name without ever opening the search modal.
function GroupChips({
  active,
  selectedId,
  onPick,
}: {
  active: TabGroup | "all";
  selectedId: string | null;
  onPick: (id: string) => void;
}) {
  const items =
    active === "all"
      ? BRAIN_STRUCTURES
      : BRAIN_STRUCTURES.filter((s) => TAB_GROUPS[active].systems.includes(s.system));

  return (
    <div
      className="flex gap-1.5 overflow-x-auto py-1 px-1 -mx-1"
      style={{ scrollbarWidth: "thin" }}
      data-testid="brain-group-chips"
    >
      {items.map((s) => {
        const isActive = selectedId === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onPick(s.id)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium border whitespace-nowrap flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
            style={
              isActive
                ? {
                    background: `${s.color}33`,
                    borderColor: s.color,
                    color: PALETTE.mist,
                    boxShadow: `0 0 12px -2px ${s.color}aa`,
                  }
                : {
                    background: `${PALETTE.surface}aa`,
                    borderColor: `${PALETTE.steel}99`,
                    color: `${PALETTE.mist}bb`,
                  }
            }
            data-testid={`chip-${s.id}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
            />
            {s.shortName || s.name}
          </button>
        );
      })}
    </div>
  );
}

// ──────────────────────────── UI: detail panel ────────────────────────────

function DetailSection({
  title,
  items,
  bullet,
}: {
  title: string;
  items: string[];
  bullet: string;
}) {
  return (
    <div>
      <h4
        className="text-[11px] font-semibold uppercase tracking-wider mb-2"
        style={{ color: PALETTE.surf }}
      >
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm leading-relaxed"
            style={{ color: `${PALETTE.mist}dd` }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
              style={{ background: bullet }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type DetailTab = "overview" | "functions" | "connections" | "clinical";

function StructureDetail({
  struct,
  onClose,
}: {
  struct: BrainStructure;
  onClose: () => void;
}) {
  const meta = SYSTEM_META[struct.system];
  const [tab, setTab] = useState<DetailTab>("overview");

  // Reset to overview whenever the user picks a different structure.
  useEffect(() => {
    setTab("overview");
  }, [struct.id]);

  const tabs: { value: DetailTab; label: string }[] = [
    { value: "overview", label: "Overview" },
    { value: "functions", label: "Functions" },
    { value: "connections", label: "Connections" },
    { value: "clinical", label: "Clinical" },
  ];

  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col h-full"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.surfaceElev}, ${PALETTE.surface})`,
        borderColor: `${struct.color}66`,
        boxShadow: `0 30px 80px -30px ${struct.color}aa`,
      }}
      data-testid="structure-detail"
    >
      {/* Header */}
      <div
        className="px-5 pt-4 pb-3 flex items-start justify-between gap-3 border-b"
        style={{ borderColor: `${PALETTE.steel}66` }}
      >
        <div className="min-w-0 flex-1">
          <div
            className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
            style={{ color: `${PALETTE.surf}cc` }}
          >
            {meta.label}
          </div>
          <h3 className="text-xl font-bold text-white leading-tight">{struct.name}</h3>
          {struct.paired && (
            <div className="text-[11px] mt-0.5" style={{ color: `${PALETTE.mist}99` }}>
              Bilateral · paired structure
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close detail"
          className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: PALETTE.mist }}
          data-testid="button-close-detail"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 px-3 pt-2 border-b"
        style={{ borderColor: `${PALETTE.steel}66` }}
        role="tablist"
        aria-label="Structure detail sections"
      >
        {tabs.map((t) => {
          const active = t.value === tab;
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.value)}
              className="relative px-3 py-2 text-xs font-medium transition-colors"
              style={{ color: active ? PALETTE.surf : `${PALETTE.mist}99` }}
              data-testid={`detail-tab-${t.value}`}
            >
              {t.label}
              {active && (
                <span
                  className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full"
                  style={{ background: PALETTE.surf }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="px-5 py-4 overflow-y-auto flex-1 space-y-5" data-testid={`detail-body-${tab}`}>
        {tab === "overview" && (
          <p className="text-sm leading-relaxed" style={{ color: PALETTE.mist }}>
            {struct.overview}
          </p>
        )}

        {tab === "functions" && (
          <DetailSection title="Key Functions" items={struct.functions} bullet={PALETTE.surf} />
        )}

        {tab === "connections" && (
          <>
            <div>
              <h4
                className="text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: PALETTE.surf }}
              >
                Related Study Topics
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {struct.topicHints.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full border"
                    style={{
                      background: `${PALETTE.steel}66`,
                      borderColor: `${PALETTE.surf}44`,
                      color: PALETTE.mist,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="text-xs leading-relaxed pt-2 border-t"
              style={{ color: `${PALETTE.mist}aa`, borderColor: `${PALETTE.steel}66` }}
            >
              Part of the {meta.label.toLowerCase()}. {meta.description}
            </div>
          </>
        )}

        {tab === "clinical" && (
          <>
            <DetailSection
              title="Role in Neuropsychology"
              items={struct.neuropsych}
              bullet={struct.color}
            />
            <DetailSection
              title="Clinical Conditions"
              items={struct.conditions}
              bullet={PALETTE.mist}
            />
          </>
        )}
      </div>

      {/* Footer actions */}
      <div
        className="px-5 py-3 border-t flex flex-col gap-2"
        style={{ borderColor: `${PALETTE.steel}66` }}
      >
        <Link href={`/topics`}>
          <a
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl h-9 text-xs font-medium transition-all border"
            style={{
              background: `${PALETTE.surface}cc`,
              borderColor: `${PALETTE.steel}99`,
              color: PALETTE.mist,
            }}
            data-testid="button-explore-topics"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Explore matching topics
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </Link>
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div
      className="rounded-2xl border p-6 h-full flex flex-col items-center justify-center text-center"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.surface}, ${PALETTE.bg})`,
        borderColor: `${PALETTE.steel}99`,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${PALETTE.teal}33, ${PALETTE.surf}22)`,
          border: `1px solid ${PALETTE.surf}44`,
        }}
      >
        <Target className="w-7 h-7" style={{ color: PALETTE.surf }} />
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">Pick a structure</h3>
      <p className="text-sm leading-relaxed max-w-xs" style={{ color: `${PALETTE.mist}99` }}>
        Pick a region tab and chip below, or search by name or symptom. Each
        structure opens an overview, its primary functions, network
        connections, and the clinical conditions it's tied to.
      </p>
    </div>
  );
}

// Simple SVG wireframe brain. Each of the 5 region groups is a clickable
// shape that glows in its system color when the user clicks it OR when the
// currently-selected structure belongs to that group. Clicking a region
// promotes that group to the active tab so its chip strip is visible.
const REGION_PATHS: Record<
  TabGroup,
  {
    d: string;
    testid: string;
    label: string;
    color: string;
    labelPos: [number, number];
  }
> = {
  cortex: {
    d:
      "M 70 145 C 60 95, 95 45, 185 40 C 275 36, 335 70, 338 125 " +
      "C 340 155, 322 175, 292 178 L 118 178 C 90 178, 70 168, 70 145 Z " +
      "M 95 95 C 110 80, 130 75, 145 90 M 150 75 C 170 65, 195 65, 215 80 " +
      "M 225 65 C 250 60, 280 70, 295 90 M 305 110 C 320 120, 322 140, 312 155",
    testid: "wireframe-cortex",
    label: "Cortex",
    color: SYSTEM_META.cortex.color,
    labelPos: [200, 65],
  },
  whitematter: {
    d: "M 112 138 C 140 108, 270 108, 296 138",
    testid: "wireframe-whitematter",
    label: "White Matter",
    color: SYSTEM_META["white-matter"].color,
    labelPos: [200, 102],
  },
  limbic: {
    d:
      "M 170 158 C 168 142, 198 138, 218 150 C 232 160, 222 174, 200 172 " +
      "C 184 170, 170 168, 170 158 Z",
    testid: "wireframe-limbic",
    label: "Limbic",
    color: SYSTEM_META.limbic.color,
    labelPos: [195, 195],
  },
  subcortical: {
    d:
      "M 232 156 C 232 146, 272 146, 272 159 C 272 170, 232 170, 232 156 Z",
    testid: "wireframe-subcortical",
    label: "Subcortical",
    color: SYSTEM_META.diencephalon.color,
    labelPos: [252, 138],
  },
  brainstem: {
    d:
      "M 218 178 L 213 240 L 247 240 L 242 178 Z " +
      "M 248 180 C 292 180, 322 200, 322 222 C 322 242, 296 252, 272 246 " +
      "C 252 240, 248 222, 248 200 Z",
    testid: "wireframe-brainstem",
    label: "Brainstem",
    color: SYSTEM_META.brainstem.color,
    labelPos: [285, 268],
  },
};

function WireframeBrain({
  activeTab,
  selectedSystem,
  onPickGroup,
}: {
  activeTab: TabGroup | "all";
  selectedSystem: BrainSystem | null;
  onPickGroup: (group: TabGroup) => void;
}) {
  const selectedGroup = selectedSystem ? tabForSystem(selectedSystem) : null;

  return (
    <div
      className="relative h-full w-full flex items-center justify-center p-4 md:p-6"
      data-testid="brain-wireframe"
    >
      <svg
        viewBox="0 0 400 280"
        className="w-full h-full max-w-2xl"
        role="img"
        aria-label="Interactive wireframe brain — click a region to highlight it"
      >
        {TAB_KEYS.map((key) => {
          const r = REGION_PATHS[key];
          const isActive = activeTab === key || selectedGroup === key;
          const baseStroke = `${PALETTE.surf}55`;
          return (
            <g
              key={key}
              onClick={() => onPickGroup(key)}
              style={{ cursor: "pointer" }}
              data-testid={r.testid}
              role="button"
              aria-label={`Highlight ${r.label}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPickGroup(key);
                }
              }}
            >
              <path
                d={r.d}
                fill={isActive ? `${r.color}26` : "transparent"}
                stroke={isActive ? r.color : baseStroke}
                strokeWidth={isActive ? 2.2 : 1.2}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  transition:
                    "fill 0.25s ease, stroke 0.25s ease, stroke-width 0.25s ease, filter 0.25s ease",
                  filter: isActive
                    ? `drop-shadow(0 0 6px ${r.color}) drop-shadow(0 0 14px ${r.color}88)`
                    : undefined,
                }}
              />
              {isActive && (
                <text
                  x={r.labelPos[0]}
                  y={r.labelPos[1]}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill={r.color}
                  style={{
                    pointerEvents: "none",
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                  }}
                >
                  {r.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p
        className="absolute bottom-3 left-0 right-0 text-center text-[11px]"
        style={{ color: `${PALETTE.mist}66` }}
      >
        Click a region to highlight it, then pick a structure from the chips
        below.
      </p>
    </div>
  );
}

// URL hash sync — `#focus=structure-id`
function readFocusFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const focus = params.get("focus");
  return focus && STRUCTURE_INDEX[focus] ? focus : null;
}

function writeFocusToHash(id: string | null) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (id) {
    url.hash = `focus=${id}`;
  } else {
    url.hash = "";
  }
  window.history.replaceState(null, "", url.toString());
}

// ──────────────────────────── page ────────────────────────────

export default function BrainLabPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabGroup | "all">("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Init from media queries + URL hash
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mqMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    setIsMobile(mqMobile.matches);

    const initial = readFocusFromHash();
    if (initial) setSelectedId(initial);

    const onHash = () => {
      const f = readFocusFromHash();
      setSelectedId(f);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Selection handler — syncs the active region tab so the chip strip
  // highlights the picked structure, and writes the hash so the URL
  // remains shareable.
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setSearchOpen(false);
    writeFocusToHash(id);
    setShowMobileDetail(true);
    const struct = STRUCTURE_INDEX[id];
    if (struct) setActiveTab(tabForSystem(struct.system));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
    writeFocusToHash(null);
    setShowMobileDetail(false);
  }, []);

  const selected = selectedId ? STRUCTURE_INDEX[selectedId] ?? null : null;

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        else if (selectedId) handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, selectedId, handleClose]);

  return (
    <div className="h-full overflow-hidden study-page-bg flex flex-col">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 flex items-center justify-between gap-3 border-b"
        style={{
          borderColor: `${PALETTE.steel}66`,
          background: `linear-gradient(180deg, ${PALETTE.surface}cc, transparent)`,
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
              color: PALETTE.bg,
            }}
          >
            <Brain className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-bold text-white truncate">Brain Lab</h1>
            <p className="text-xs hidden sm:block" style={{ color: `${PALETTE.mist}99` }}>
              Explore the brain. Understand the mind.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all hover:-translate-y-0.5"
            style={{
              background: `${PALETTE.surface}cc`,
              borderColor: `${PALETTE.steel}99`,
              color: PALETTE.mist,
            }}
            data-testid="button-open-search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search structures</span>
            <span className="sm:hidden">Search</span>
            <kbd
              className="hidden md:inline px-1.5 py-0.5 rounded text-[10px] font-mono"
              style={{ background: `${PALETTE.steel}99`, color: PALETTE.mist }}
            >
              /
            </kbd>
          </button>
        </div>
      </div>

      {/* Tabs row — 5 region groups */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-2 flex items-center justify-center border-b"
        style={{
          borderColor: `${PALETTE.steel}66`,
          background: `linear-gradient(180deg, ${PALETTE.surface}66, transparent)`,
        }}
      >
        <TopTabs active={activeTab} setActive={setActiveTab} />
      </div>

      {/* Body — 2-pane: diagram canvas / detail */}
      <div
        className="flex-1 min-h-0 min-w-0 w-full overflow-hidden grid gap-3 p-3 md:p-4"
        style={{
          gridTemplateColumns: isMobile ? "1fr" : "1fr minmax(340px, 420px)",
        }}
      >
        {/* Center: diagram placeholder + chip strip below */}
        <div className="flex flex-col gap-3 min-h-0 min-w-0">
          <div
            className="relative rounded-2xl border overflow-hidden flex-1 min-h-0"
            style={{
              background: PALETTE.bg,
              borderColor: `${PALETTE.steel}99`,
              boxShadow: `0 20px 60px -30px ${PALETTE.teal}aa`,
            }}
            data-testid="brain-diagram-wrap"
          >
            <WireframeBrain
              activeTab={activeTab}
              selectedSystem={selected?.system ?? null}
              onPickGroup={(g) => {
                // Clicking a wireframe region promotes that group to the
                // active tab so its chip strip is visible. We intentionally
                // don't auto-select a specific structure — the user picks
                // from the chips below.
                setActiveTab(g);
              }}
            />

            {/* Search overlay */}
            {searchOpen && (
              <StructureSearch onSelect={handleSelect} onClose={() => setSearchOpen(false)} />
            )}
          </div>

          {/* Group chip strip — quick pick within the active tab */}
          <div
            className="flex-shrink-0 min-w-0 overflow-hidden rounded-2xl border px-3 py-2"
            style={{
              background: `${PALETTE.surface}aa`,
              borderColor: `${PALETTE.steel}99`,
            }}
          >
            <GroupChips active={activeTab} selectedId={selectedId} onPick={handleSelect} />
          </div>
        </div>

        {/* Right: detail panel (desktop) */}
        {!isMobile && (
          <aside className="overflow-hidden">
            {selected ? (
              <StructureDetail struct={selected} onClose={handleClose} />
            ) : (
              <EmptyDetail />
            )}
          </aside>
        )}
      </div>

      {/* Mobile detail drawer */}
      {isMobile && selected && showMobileDetail && (
        <div
          className="fixed inset-0 z-40 flex items-end"
          style={{ background: `${PALETTE.bg}cc`, backdropFilter: "blur(6px)" }}
          onClick={() => setShowMobileDetail(false)}
        >
          <div
            className="w-full max-h-[85vh] rounded-t-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <StructureDetail struct={selected} onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
}
