import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, lazy, Suspense, Component, type ReactNode } from "react";
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
  Boxes,
  Activity,
  Network,
  Compass,
  Box,
  Layers,
  GraduationCap,
} from "lucide-react";
import {
  BRAIN_STRUCTURES,
  STRUCTURE_INDEX,
  SYSTEM_META,
  type BrainStructure,
  type DetailBlock,
} from "../data/brain-structures";
import brainLateral from "@/assets/brain-views/lateral.webp";
import brainMedial from "@/assets/brain-views/medial.webp";
import brainMidsagittal from "@/assets/brain-views/midsagittal.webp";
import brainCoronal from "@/assets/brain-views/coronal.webp";
import brainDorsal from "@/assets/brain-views/dorsal.webp";
import brainVentral from "@/assets/brain-views/ventral.webp";
import brainVentralNerves from "@/assets/brain-views/ventral-nerves.webp";
import { useBrainQuiz, BrainQuizDiagram, BrainQuizPanel, type QuizItem } from "@/components/brain/brain-quiz";

// Heavy 3D view (three.js + ~1.8MB meshopt-compressed GLB) is code-split so it only loads when
// the user opens the 3D tab — the Sections/image view stays instant.
const Brain3DView = lazy(() => import("@/components/brain/brain-3d-view"));

// Contains any failure inside the WebGL/3D subtree — a stale lazy chunk after a
// redeploy, a WebGL context failure, or a runtime error in three.js — so it
// degrades to a graceful "switch to Sections" prompt instead of white-screening
// the whole Brain Lab page.
class Brain3DErrorBoundary extends Component<
  { onFallback: () => void; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Brain3DView crashed, offering Sections fallback:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="h-full w-full flex flex-col items-center justify-center text-center gap-3 px-6"
          data-testid="brain-3d-error"
        >
          <p className="text-sm font-semibold text-white">3D view couldn't load</p>
          <p className="text-xs max-w-xs" style={{ color: `${PALETTE.mist}99` }}>
            The interactive 3D brain failed to start on this device. You can keep
            exploring every structure in the Sections view.
          </p>
          <button
            type="button"
            onClick={this.props.onFallback}
            className="mt-1 text-xs font-semibold px-3 py-1.5 rounded-md"
            style={{
              background: `${PALETTE.surf}22`,
              color: PALETTE.surf,
              border: `1px solid ${PALETTE.surf}55`,
            }}
            data-testid="brain-3d-error-fallback"
          >
            Switch to Sections view
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

type ViewMode = "3d" | "sections" | "quiz";

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
//   - BRAIN_STRUCTURES data, search, tabs, numbered key
//   - StructureDetail (Overview / Functions / Connections / Clinical tabs)
//   - URL hash sync for shareable focus links
//   - Mobile detail drawer + region-tab auto-switching on selection
// =============================================================================

// The Brain Lab is organized by anatomical VIEW (how you're looking at the
// brain) rather than by structure category. Each view maps to a diagram image
// and the structures visible from that angle. Views without an image yet render
// an elegant "coming soon" placeholder (see BRAIN_VIEWS / BrainDiagram).
const VIEWS = {
  lateral: { label: "Lateral", icon: Compass },
  // Display labels were renamed (internal ViewKeys kept to avoid churn):
  //   key "medial" (medial-surface render)  → shown as "Midsagittal"
  //   key "midsagittal" (deep midline cut)  → shown as "Sagittal"
  medial: { label: "Midsagittal", icon: Layers },
  midsagittal: { label: "Sagittal", icon: Activity },
  coronal: { label: "Coronal", icon: Boxes },
  dorsal: { label: "Dorsal", icon: Target },
  ventral: { label: "Ventral", icon: Box },
  ventralNerves: { label: "Cranial Nerves", icon: Network },
} as const;
type ViewKey = keyof typeof VIEWS;
const VIEW_KEYS: ViewKey[] = [
  "lateral",
  "medial",
  "midsagittal",
  "coronal",
  "dorsal",
  "ventral",
  "ventralNerves",
];

// Which view best shows a given structure — used to jump to the right diagram
// when a structure is picked from search or the key. When `preferred` already
// contains the structure (e.g. the user clicked a marker on the active diagram,
// or a structure shown on several views), stay there instead of snapping to the
// first matching view. Returns null when the structure isn't placed anywhere.
function viewForStructure(id: string, preferred?: ViewKey): ViewKey | null {
  if (preferred && HOTSPOTS[preferred].some((h) => h.id === id)) return preferred;
  for (const key of VIEW_KEYS) {
    if (HOTSPOTS[key].some((h) => h.id === id)) return key;
  }
  return null;
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
    if (!term) return [];
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
            className="p-1 rounded-md hover:bg-white/5"
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
                    style={{ background: PALETTE.surf, boxShadow: `0 0 8px ${PALETTE.surf}` }}
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
          {matches.length === 0 && q.trim() === "" && (
            <li className="px-4 py-6 text-center text-sm" style={{ color: `${PALETTE.mist}88` }}>
              Start typing to search structures, functions, or conditions…
            </li>
          )}
          {matches.length === 0 && q.trim() !== "" && (
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

function ViewTabs({
  active,
  onPick,
}: {
  active: ViewKey;
  onPick: (v: ViewKey) => void;
}) {
  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-2xl border overflow-x-auto"
      style={{
        background: `${PALETTE.surface}cc`,
        borderColor: `${PALETTE.steel}99`,
      }}
      role="tablist"
      aria-label="Brain view tabs"
      data-testid="brain-top-tabs"
    >
      {VIEW_KEYS.map((value) => {
        const { label, icon: Icon } = VIEWS[value];
        const isActive = active === value;
        return (
          <button
            key={value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onPick(value)}
            className="px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all"
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

// Renders the optional rich, structured long-form content (DetailBlock[]) for the
// in-depth structures (e.g. the four lobes). Handles sub-headings, paragraphs,
// bullet lists, and "term — description" pairs (the anatomical/assessment tables).
function RichBlocks({ blocks, accent }: { blocks: DetailBlock[]; accent: string }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        if ("h" in block) {
          return (
            <h4
              key={i}
              className="text-[11px] font-semibold uppercase tracking-wider pt-1.5"
              style={{ color: PALETTE.surf }}
            >
              {block.h}
            </h4>
          );
        }
        if ("p" in block) {
          return (
            <p key={i} className="text-sm leading-relaxed" style={{ color: `${PALETTE.mist}dd` }}>
              {block.p}
            </p>
          );
        }
        if ("ul" in block) {
          return (
            <ul key={i} className="space-y-1.5">
              {block.ul.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                  style={{ color: `${PALETTE.mist}dd` }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: accent }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        // term / description pairs
        return (
          <dl key={i} className="space-y-2">
            {block.dl.map((row, j) => (
              <div
                key={j}
                className="rounded-lg px-3 py-2"
                style={{ background: `${PALETTE.surface}99`, border: `1px solid ${PALETTE.steel}55` }}
              >
                <dt className="text-[13px] font-semibold" style={{ color: PALETTE.surf }}>
                  {row.term}
                </dt>
                <dd className="text-[13px] leading-relaxed mt-0.5" style={{ color: `${PALETTE.mist}cc` }}>
                  {row.desc}
                </dd>
              </div>
            ))}
          </dl>
        );
      })}
    </div>
  );
}

type DetailTab =
  | "overview"
  | "anatomy"
  | "functions"
  | "connections"
  | "clinical"
  | "assessment";

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

  const detail = struct.detail;
  // Anatomy and Assessment tabs only appear for in-depth structures that supply
  // that rich content; the four core tabs are always present. Order is fixed.
  const tabs: { value: DetailTab; label: string }[] = [
    { value: "overview", label: "Overview" },
    ...(detail?.anatomy ? [{ value: "anatomy" as DetailTab, label: "Anatomy" }] : []),
    { value: "functions", label: "Functions" },
    { value: "connections", label: "Connections" },
    { value: "clinical", label: "Clinical" },
    ...(detail?.assessment ? [{ value: "assessment" as DetailTab, label: "Assessment" }] : []),
  ];

  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col h-full min-h-0 max-h-full"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.surfaceElev}, ${PALETTE.surface})`,
        borderColor: `${PALETTE.steel}66`,
        boxShadow: `0 30px 80px -30px ${PALETTE.teal}aa`,
      }}
      data-testid="structure-detail"
    >
      {/* Header */}
      <div
        className="px-5 pt-4 pb-3 flex flex-shrink-0 items-start justify-between gap-3 border-b"
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
          className="p-1.5 rounded-md transition-colors hover:bg-white/5"
          style={{ color: PALETTE.mist }}
          data-testid="button-close-detail"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex flex-shrink-0 items-center gap-1 overflow-x-auto px-3 pt-2 border-b"
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
      <div
        className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-4"
        style={{ scrollbarWidth: "thin" }}
        data-testid={`detail-body-${tab}`}
      >
        {tab === "overview" && (
          <p className="text-sm leading-relaxed" style={{ color: PALETTE.mist }}>
            {struct.overview}
          </p>
        )}

        {tab === "anatomy" && detail?.anatomy && (
          <RichBlocks blocks={detail.anatomy} accent={PALETTE.surf} />
        )}

        {tab === "functions" &&
          (detail?.functions ? (
            <RichBlocks blocks={detail.functions} accent={PALETTE.surf} />
          ) : (
            <DetailSection title="Key Functions" items={struct.functions} bullet={PALETTE.surf} />
          ))}

        {tab === "connections" && (
          <>
            {detail?.connections ? (
              <RichBlocks blocks={detail.connections} accent={PALETTE.surf} />
            ) : (
              struct.connections.length > 0 && (
                <DetailSection
                  title="Network Connections"
                  items={struct.connections}
                  bullet={PALETTE.surf}
                />
              )
            )}
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

        {tab === "clinical" &&
          (detail?.clinical ? (
            <RichBlocks blocks={detail.clinical} accent={PALETTE.surf} />
          ) : (
            <>
              <DetailSection
                title="Role in Neuropsychology"
                items={struct.neuropsych}
                bullet={PALETTE.surf}
              />
              <DetailSection
                title="Clinical Conditions"
                items={struct.conditions}
                bullet={PALETTE.mist}
              />
            </>
          ))}

        {tab === "assessment" && detail?.assessment && (
          <RichBlocks blocks={detail.assessment} accent={PALETTE.surf} />
        )}
      </div>

      {/* Footer actions */}
      <div
        className="px-5 py-3 border-t flex flex-col gap-2"
        style={{ borderColor: `${PALETTE.steel}66` }}
      >
        <Link href={`/topics`}>
          <a
            className="w-full inline-flex items-center justify-center gap-2 rounded-md h-9 text-xs font-medium transition-all border"
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

// Image-driven brain views. Each region tab swaps the diagram to the brain
// view that best exposes that group's structures. As new view images are
// added, drop them into src/assets/brain-views and wire them up here — any
// group still set to `src: null` renders an elegant "coming soon" placeholder
// so the page never breaks while the image library is being filled in.
const BRAIN_VIEWS: Record<
  ViewKey,
  { src: string | null; viewName: string; caption: string }
> = {
  lateral: {
    src: brainLateral,
    viewName: "Lateral view",
    caption: "The brain's outer surface — side profile",
  },
  medial: {
    src: brainMedial,
    viewName: "Midsagittal view",
    caption: "The medial surface seen on a midsagittal cut",
  },
  midsagittal: {
    src: brainMidsagittal,
    viewName: "Sagittal view",
    caption: "Deep sagittal section — midline structures",
  },
  coronal: {
    src: brainCoronal,
    viewName: "Coronal section",
    caption: "Frontal slice — subcortical nuclei & ventricles",
  },
  dorsal: {
    src: brainDorsal,
    viewName: "Dorsal (superior) view",
    caption: "Top-down view of the cerebral hemispheres",
  },
  ventral: {
    src: brainVentral,
    viewName: "Ventral (inferior) view",
    caption: "The underside of the brain",
  },
  ventralNerves: {
    src: brainVentralNerves,
    viewName: "Ventral view — cranial nerves",
    caption: "The underside of the brain showing the cranial nerves",
  },
};

// Clickable region markers overlaid on each view. Coordinates are percentages
// of the rendered image box (x = left→right, y = top→bottom) and are tuned to
// the current view images in src/assets/brain-views. Each tab shows only the
// structures that are actually visible in its image, so the markers always sit
// on real anatomy. Clicking a marker selects that structure — its name pins to
// the brain and its full detail opens in the panel on the right.
// Each label is drawn as a thin leader line from a precise anatomical anchor
// (x, y — % of the rendered image box) out to a label box (lx, ly). `side`
// controls which way the label box extends from its (lx, ly) attach point:
// "left" means the box grows leftward (text right-aligned, right edge at lx),
// "right" means it grows rightward (left edge at lx). When lx/ly are omitted the
// label sits just beside the anchor (legacy fallback).
type Hotspot = {
  id: string;
  x: number;
  y: number;
  lx?: number;
  ly?: number;
  side?: "left" | "right";
};

const HOTSPOTS: Record<ViewKey, Hotspot[]> = {
  // Lateral view (brain faces left) — cortical surface.
  lateral: [
    { id: "precentral-gyrus", x: 43.8, y: 18.2 },
    { id: "central-sulcus", x: 45.9, y: 16.4 },
    { id: "postcentral-gyrus", x: 49.9, y: 18.2 },
    { id: "superior-frontal-gyrus", x: 33.8, y: 18.2 },
    { id: "middle-frontal-gyrus", x: 28.8, y: 27.3 },
    { id: "inferior-frontal-gyrus", x: 24.8, y: 39.1 },
    { id: "pars-opercularis", x: 31.8, y: 44.5 },
    { id: "pars-triangularis", x: 26.8, y: 46.4 },
    { id: "pars-orbitalis", x: 20.8, y: 48.2 },
    { id: "broca-area", x: 29.8, y: 50.9 },
    { id: "lateral-sulcus", x: 39.8, y: 50.9 },
    { id: "temporal-pole", x: 16.7, y: 60.0 },
    { id: "superior-temporal-gyrus", x: 40.8, y: 59.1 },
    { id: "superior-temporal-sulcus", x: 43.8, y: 61.8 },
    { id: "middle-temporal-gyrus", x: 44.8, y: 64.5 },
    { id: "inferior-temporal-gyrus", x: 47.9, y: 69.1 },
    { id: "intraparietal-sulcus", x: 58.9, y: 26.4 },
    { id: "superior-parietal-lobule", x: 59.9, y: 22.7 },
    { id: "supramarginal-gyrus", x: 62.9, y: 37.3 },
    { id: "angular-gyrus", x: 67.9, y: 44.5 },
    { id: "inferior-parietal-lobule", x: 65.9, y: 40.9 },
    { id: "wernicke-area", x: 60.9, y: 51.8 },
    { id: "occipital-pole", x: 86.0, y: 46.4 },
    { id: "lateral-occipital-cortex", x: 80.0, y: 52.7 },
    { id: "cerebellar-hemisphere", x: 79.0, y: 70.9 },
    { id: "auditory-cortex", x: 49.9, y: 56.4 },
  ],
  // "Midsagittal" tab (internal key "medial") — medial-surface render.
  // Labels & numbering follow the MEDIAL VIEW atlas plate (28).
  medial: [
    { id: "paracentral-lobule", x: 49.9, y: 21.9 },
    { id: "cingulate-sulcus", x: 37.9, y: 29.8 },
    { id: "cingulate-gyrus", x: 39.9, y: 35.1 },
    { id: "corpus-callosum", x: 42.9, y: 40.4 },
    { id: "septum-pellucidum", x: 40, y: 43 },
    { id: "fornix", x: 39.9, y: 46.5 },
    { id: "thalamus", x: 47.9, y: 47.4 },
    { id: "interthalamic-adhesion", x: 46, y: 47 },
    { id: "hypothalamus", x: 41.9, y: 51.8 },
    { id: "optic-chiasm", x: 33.9, y: 54.4 },
    { id: "pituitary", x: 36, y: 60 },
    { id: "mammillary-bodies", x: 43.9, y: 53.5 },
    { id: "pons", x: 48.9, y: 61.4 },
    { id: "medulla", x: 47.9, y: 69.3 },
    { id: "fourth-ventricle", x: 55, y: 61 },
    { id: "cerebellum", x: 65, y: 62 },
    { id: "cerebellar-hemisphere", x: 73, y: 60 },
    { id: "calcarine-sulcus", x: 73.9, y: 46.5 },
    { id: "cuneus", x: 75.9, y: 39.5 },
    { id: "lingual-gyrus", x: 71.9, y: 51.8 },
    { id: "parieto-occipital-sulcus", x: 69.9, y: 32.5 },
    { id: "precuneus", x: 63.9, y: 30.7 },
    { id: "superior-frontal-gyrus", x: 22, y: 17 },
    { id: "medial-frontal-gyrus", x: 32, y: 16 },
    { id: "sulcus-rostralis", x: 24, y: 42 },
    { id: "genu-corpus-callosum", x: 33, y: 42 },
    { id: "rostrum-corpus-callosum", x: 33, y: 47 },
    { id: "anterior-commissure", x: 37, y: 48 },
  ],
  // "Sagittal" tab (internal key "midsagittal") — deep midline-cut render.
  // Labels & numbering follow the sagittal atlas plate (21).
  midsagittal: [
    { id: "frontal-lobe", x: 20, y: 25 },
    { id: "parietal-lobe", x: 60, y: 22 },
    { id: "occipital-lobe", x: 80, y: 40 },
    { id: "corpus-callosum", x: 42, y: 39 },
    { id: "cingulate-gyrus", x: 40, y: 33.6 },
    { id: "septum-pellucidum", x: 38, y: 42 },
    { id: "thalamus", x: 47, y: 46.2 },
    { id: "hypothalamus", x: 41, y: 51.7 },
    { id: "optic-chiasm", x: 34, y: 54.4 },
    { id: "pituitary", x: 33, y: 60 },
    { id: "mammillary-bodies", x: 42, y: 54.4 },
    { id: "pons", x: 49, y: 61.6 },
    { id: "medulla", x: 48, y: 70.7 },
    { id: "cerebellum", x: 66, y: 59.8 },
    { id: "fourth-ventricle", x: 55, y: 62 },
    { id: "cerebral-aqueduct", x: 51, y: 55 },
    { id: "pineal-gland", x: 56, y: 48 },
    { id: "fornix", x: 40, y: 45.3 },
    { id: "anterior-commissure", x: 37, y: 47 },
    { id: "lateral-ventricles", x: 44, y: 36 },
    { id: "subcallosal-area", x: 33, y: 48 },
  ],
  // Coronal section — subcortical nuclei, capsules & ventricles.
  coronal: [
    { id: "corpus-callosum", x: 50.0, y: 27.8 },
    { id: "caudate", x: 45.2, y: 35.9 },
    { id: "putamen", x: 38.4, y: 45.0 },
    { id: "external-capsule", x: 35.5, y: 46.0 },
    { id: "claustrum", x: 34.6, y: 48.0 },
    { id: "insular-cortex", x: 33.6, y: 50.0 },
    { id: "lateral-ventricles", x: 51.9, y: 32.9 },
    { id: "internal-capsule", x: 46.1, y: 45.0 },
    { id: "globus-pallidus", x: 43.2, y: 47.0 },
    { id: "thalamus", x: 48.1, y: 52.0 },
    { id: "third-ventricle", x: 50.0, y: 50.0 },
  ],
  // Dorsal (superior) view — front at top. Labels follow the dorsal plate (11).
  dorsal: [
    { id: "frontal-pole", x: 46, y: 8 },
    { id: "superior-frontal-gyrus", x: 40, y: 20 },
    { id: "middle-frontal-gyrus", x: 30, y: 25 },
    { id: "precentral-gyrus", x: 42, y: 42 },
    { id: "central-sulcus", x: 45, y: 46 },
    { id: "postcentral-gyrus", x: 44, y: 50 },
    { id: "superior-parietal-lobule", x: 56, y: 62 },
    { id: "intraparietal-sulcus", x: 60, y: 34 },
    { id: "parieto-occipital-sulcus", x: 57, y: 76 },
    { id: "occipital-lobe", x: 44, y: 86 },
    { id: "longitudinal-fissure", x: 50, y: 30 },
  ],
  // Ventral (inferior) view — front at top. Labels follow the ventral plate (13).
  ventral: [
    { id: "olfactory-bulb", x: 47, y: 18 },
    { id: "olfactory-tract", x: 47, y: 24 },
    { id: "optic-nerve", x: 45, y: 30 },
    { id: "optic-chiasm", x: 49, y: 33 },
    { id: "optic-tract", x: 55, y: 36 },
    { id: "pituitary", x: 50, y: 39 },
    { id: "mammillary-bodies", x: 49, y: 44 },
    { id: "pons", x: 49, y: 52 },
    { id: "medulla", x: 49, y: 62 },
    { id: "cerebellum", x: 47, y: 80 },
    { id: "temporal-lobe", x: 30, y: 42 },
    { id: "frontal-lobe", x: 66, y: 20 },
    { id: "orbital-gyri", x: 30, y: 24 },
  ],
  // Cranial Nerves view (internal key "ventralNerves") — brainstem roots.
  // Labels & numbering follow the cranial-nerve plate (I–XII).
  ventralNerves: [
    { id: "olfactory-nerve", x: 46, y: 22 },
    { id: "optic-nerve", x: 45, y: 35 },
    { id: "oculomotor-nerve", x: 46, y: 47 },
    { id: "trochlear-nerve", x: 40, y: 51 },
    { id: "trigeminal-nerve", x: 35, y: 56 },
    { id: "abducens-nerve", x: 48, y: 59 },
    { id: "facial-nerve", x: 39, y: 60 },
    { id: "vestibulocochlear-nerve", x: 32, y: 62 },
    { id: "glossopharyngeal-nerve", x: 40, y: 65 },
    { id: "vagus-nerve", x: 35, y: 69 },
    { id: "accessory-nerve", x: 39, y: 73 },
    { id: "hypoglossal-nerve", x: 48, y: 67 },
  ],
};

// Shown in the detail pane for view modes that don't use the numbered key
// (the 3D model and the quiz) when nothing is selected yet.
function EmptyDetail() {
  return (
    <div
      className="rounded-2xl border p-6 h-full flex flex-col items-center justify-center text-center"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.surface}, ${PALETTE.bg})`,
        borderColor: `${PALETTE.steel}99`,
      }}
      data-testid="empty-detail"
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
        Click any label around the brain to open its full detail here. Switch
        views above, or search by name or symptom.
      </p>
    </div>
  );
}

// Interactive numbered key shown beside the brain. Each row is a numbered,
// color-coded (by anatomical TYPE) entry whose number matches a marker on the
// diagram. Hovering a row lights up its marker on the brain (and vice-versa);
// clicking opens the structure's detail. An inline legend explains the type
// colors. Scales cleanly to ~40 entries — the brain stays uncluttered.
function NumberedKey({
  activeView,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: {
  activeView: ViewKey;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const hotspots = HOTSPOTS[activeView] ?? [];
  const view = BRAIN_VIEWS[activeView];
  const listRef = useRef<HTMLOListElement>(null);

  // Keep the active/hovered row visible as the user moves across the diagram.
  useEffect(() => {
    const id = hoveredId ?? selectedId;
    if (!id || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-row-id="${CSS.escape(id)}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [hoveredId, selectedId]);

  return (
    <div
      className="rounded-2xl border h-full flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.surfaceElev}, ${PALETTE.surface})`,
        borderColor: `${PALETTE.steel}99`,
      }}
      data-testid="brain-key"
    >
      {/* Header — view name, count, and inline type legend */}
      <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: `${PALETTE.steel}66` }}>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-white">{view.viewName} — Key</h3>
          <span className="text-[11px]" style={{ color: `${PALETTE.mist}99` }}>
            {hotspots.length} structures
          </span>
        </div>
      </div>

      {/* Scrollable numbered list */}
      <ol
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto px-2 py-2"
        style={{ scrollbarWidth: "thin" }}
        data-testid="brain-key-list"
      >
        {hotspots.map((h, i) => {
          const s = STRUCTURE_INDEX[h.id];
          if (!s) return null;
          const n = i + 1;
          const active = selectedId === h.id;
          const hot = hoveredId === h.id;
          const emphasized = active || hot;
          return (
            <li key={h.id}>
              <button
                type="button"
                data-row-id={s.id}
                onClick={() => onSelect(s.id)}
                onMouseEnter={() => onHover(s.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(s.id)}
                onBlur={() => onHover(null)}
                className="w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors"
                style={{
                  background: emphasized ? `${GLOW}1f` : "transparent",
                  boxShadow: active ? `inset 0 0 0 1px ${GLOW}aa` : "none",
                }}
                aria-pressed={active}
                data-testid={`key-row-${s.id}`}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center rounded-full font-bold"
                  style={{
                    width: 20,
                    height: 20,
                    fontSize: 10,
                    background: GLOW,
                    color: PALETTE.bg,
                    boxShadow: emphasized ? `0 0 10px 1px ${GLOW}` : "none",
                  }}
                >
                  {n}
                </span>
                <span
                  className="text-[13px] leading-tight"
                  style={{ color: emphasized ? "#fff" : PALETTE.mist }}
                >
                  {s.name}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Diagram pane. Shows the brain view image for the active region tab, or an
// elegant placeholder for groups whose view image hasn't been added yet.
// Clickable markers sit on top of the image for each visible structure.
function BrainDiagram({
  activeView,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: {
  activeView: ViewKey;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const view = BRAIN_VIEWS[activeView];
  const hotspots = HOTSPOTS[activeView] ?? [];

  return (
    <div
      className="relative h-full w-full flex items-center justify-center p-2 md:p-3"
      data-testid="brain-diagram"
    >
      {view.src ? (
        <div className="relative max-h-full max-w-full">
          <img
            src={view.src}
            alt={`${view.viewName} — ${view.caption}`}
            className="block max-h-full max-w-full object-contain select-none"
            draggable={false}
            style={{
              // Normalize every source image to the same clean grey 3D-model
              // look so views stay congruent in color regardless of whether the
              // source was a grey render or a warm anatomical photo. Any future
              // view (e.g. the coronal section) inherits this automatically.
              filter: `grayscale(1) contrast(1.05) brightness(1.03) drop-shadow(0 24px 60px ${PALETTE.bg}) drop-shadow(0 0 40px ${PALETTE.teal}55)`,
            }}
            data-testid={`brain-view-${activeView}`}
          />
          {/* Numbered markers — the number matches the side key; hovering or
              selecting one glows it and reveals the structure's name. */}
          {hotspots.map((h, i) => {
            const struct = STRUCTURE_INDEX[h.id];
            if (!struct) return null;
            const n = i + 1;
            const active = selectedId === h.id;
            const hot = hoveredId === h.id;
            const emphasized = active || hot;
            const tipBelow = h.y < 18;
            return (
              <div
                key={h.id}
                className="absolute"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: emphasized ? 30 : 20,
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(struct.id);
                  }}
                  onMouseEnter={() => onHover(struct.id)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(struct.id)}
                  onBlur={() => onHover(null)}
                  className="flex items-center justify-center rounded-md font-bold outline-none transition-all duration-150"
                  style={{
                    width: emphasized ? 24 : 19,
                    height: emphasized ? 24 : 19,
                    fontSize: emphasized ? 12 : 10,
                    background: GLOW,
                    color: PALETTE.bg,
                    border: "1.5px solid #fff",
                    boxShadow: emphasized
                      ? `0 0 0 2px ${PALETTE.bg}aa, 0 0 16px 4px ${GLOW}`
                      : `0 0 0 2px ${PALETTE.bg}99, 0 0 6px 1px ${GLOW}aa`,
                  }}
                  aria-label={struct.name}
                  aria-pressed={active}
                  data-testid={`hotspot-${struct.id}`}
                  title={struct.name}
                >
                  {n}
                </button>
                {emphasized && (
                  <span
                    className="pointer-events-none absolute left-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold"
                    style={{
                      ...(tipBelow
                        ? { top: "calc(100% + 6px)" }
                        : { bottom: "calc(100% + 6px)" }),
                      transform: "translateX(-50%)",
                      background: `${PALETTE.surfaceElev}f2`,
                      color: "#fff",
                      border: `1px solid ${GLOW}cc`,
                      boxShadow: `0 6px 18px -6px ${PALETTE.bg}`,
                      zIndex: 40,
                    }}
                  >
                    {struct.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center text-center gap-3 px-6"
          data-testid={`brain-view-placeholder-${activeView}`}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.surface}, ${PALETTE.surfaceElev})`,
              border: `1px solid ${PALETTE.steel}99`,
              boxShadow: `0 0 30px -8px ${PALETTE.teal}66`,
            }}
          >
            <Brain className="w-7 h-7" style={{ color: PALETTE.surf }} />
          </div>
          <p className="text-sm font-semibold text-white">{view.viewName} coming soon</p>
          <p className="text-xs max-w-xs" style={{ color: `${PALETTE.mist}99` }}>
            This view will show the {view.caption.toLowerCase()}. For now, pick a
            structure from the key to open its detail.
          </p>
        </div>
      )}

    </div>
  );
}

// =============================================================================
// Labeled atlas diagram (desktop) — every visible structure gets a TEXT LABEL
// parked AROUND the brain (left & right columns plus slim top & bottom rows),
// joined to its precise anatomical anchor (x, y — % of the rendered image box)
// by a thin leader line whose far end tucks under the opaque chip. Each label is
// assigned to one of the four edges by the anchor's direction from the image
// centre, so a crowded view spreads across all sides instead of stacking down
// one. Columns de-overlap vertically, rows de-overlap horizontally. Hover /
// selection lights a single uniform cerulean glow — no per-structure colour.
// =============================================================================
const SIDE_GUTTER = 100; // px reserved on the left & right for vertical label columns
const GLOW = PALETTE.surf; // single uniform cerulean glow for every label / marker

type LabelEdge = "left" | "right" | "top" | "bottom";
type LabelLayoutItem = {
  id: string;
  name: string;
  ax: number; // anchor x (px, relative to wrap)
  ay: number; // anchor y (px)
  edge: LabelEdge;
  lx: number; // resolved label-centre x (px)
  ly: number; // resolved label-centre y (px)
  w: number; // estimated label width (px)
  h: number; // estimated label height (px)
};

function LabeledBrainDiagram({
  activeView,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: {
  activeView: ViewKey;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const view = BRAIN_VIEWS[activeView];
  const hotspots = HOTSPOTS[activeView] ?? [];
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgBoxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<
    { l: number; t: number; w: number; h: number; wrapW: number; wrapH: number } | null
  >(null);
  // Real measured label sizes (filled by the hidden measurement layer below).
  // `sideH` = wrapped height inside a fixed-width side column; `rowW`/`rowH` =
  // natural size as a single-line top/bottom row label.
  const [sizes, setSizes] = useState<
    Record<string, { sideH: number; rowW: number; rowH: number }>
  >({});
  const measureLayerRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const imgBox = imgBoxRef.current;
    if (!wrap || !imgBox) return;
    const wr = wrap.getBoundingClientRect();
    const ir = imgBox.getBoundingClientRect();
    if (ir.width === 0 || ir.height === 0) return;
    setBox({
      l: ir.left - wr.left,
      t: ir.top - wr.top,
      w: ir.width,
      h: ir.height,
      wrapW: wr.width,
      wrapH: wr.height,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const wrap = wrapRef.current;
    const imgBox = imgBoxRef.current;
    if (!wrap || !imgBox) return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(imgBox);
    return () => ro.disconnect();
  }, [measure, activeView]);

  // Measure each label's REAL rendered size from a hidden layer that mirrors the
  // exact font/width treatment of the live labels. Side columns use a fixed
  // width so only the wrapped height varies; top/bottom rows size to content.
  // Feeding these into the layout replaces the old character-count estimates so
  // dense views space precisely (no estimator drift).
  useLayoutEffect(() => {
    const runMeasure = () => {
      const layer = measureLayerRef.current;
      if (!layer) return;
      const next: Record<string, { sideH: number; rowW: number; rowH: number }> = {};
      layer.querySelectorAll<HTMLElement>("[data-measure-id]").forEach((el) => {
        const id = el.getAttribute("data-measure-id");
        const kind = el.getAttribute("data-measure-kind");
        if (!id) return;
        const r = el.getBoundingClientRect();
        const cur = next[id] ?? { sideH: 0, rowW: 0, rowH: 0 };
        if (kind === "side") cur.sideH = Math.ceil(r.height);
        else {
          cur.rowW = Math.ceil(r.width);
          cur.rowH = Math.ceil(r.height);
        }
        next[id] = cur;
      });
      setSizes((prev) => {
        const keys = Object.keys(next);
        let same = keys.length === Object.keys(prev).length;
        if (same) {
          for (const k of keys) {
            const a = next[k];
            const b = prev[k];
            if (!b || a.sideH !== b.sideH || a.rowW !== b.rowW || a.rowH !== b.rowH) {
              same = false;
              break;
            }
          }
        }
        return same ? prev : next;
      });
    };
    runMeasure();
    // Re-measure once webfonts settle so late font swaps can't leave stale sizes.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) runMeasure();
    });
    return () => {
      cancelled = true;
    };
  }, [activeView]);

  // Auto-layout: assign each label to one of the four edges by the anchor's
  // direction from the image centre, then de-overlap (columns vertically, rows
  // horizontally) so nothing collides.
  const layout = useMemo<LabelLayoutItem[]>(() => {
    if (!box) return [];
    const cx0 = box.l + box.w / 2;
    const cy0 = box.t + box.h / 2;
    // Size estimates. Side-column labels wrap to up to 3 lines within the
    // gutter; top/bottom labels stay on one line.
    const colTextW = SIDE_GUTTER - 18;
    const charW = 5.85;
    const lineH = 13;
    // Prefer the REAL measured size; fall back to a character-count estimate
    // until the hidden measurement layer has reported (first paint only).
    const sideSize = (id: string, name: string) => {
      const m = sizes[id];
      if (m && m.sideH) return { w: SIDE_GUTTER - 14, h: m.sideH + 4 };
      const full = name.length * charW;
      const lines = Math.min(3, Math.max(1, Math.ceil(full / colTextW)));
      return { w: Math.min(full, colTextW), h: lines * lineH + 6 };
    };
    const rowSize = (id: string, name: string) => {
      const m = sizes[id];
      if (m && m.rowW) return { w: m.rowW, h: m.rowH };
      return { w: Math.min(170, name.length * charW + 6), h: 18 };
    };

    const items: LabelLayoutItem[] = [];
    for (const h of hotspots) {
      const s = STRUCTURE_INDEX[h.id];
      if (!s) continue;
      const ax = box.l + (h.x / 100) * box.w;
      const ay = box.t + (h.y / 100) * box.h;
      const deg = (Math.atan2(ay - cy0, ax - cx0) * 180) / Math.PI;
      let edge: LabelEdge;
      // Wider top/bottom wedges spread labels around the image rather than
      // stacking most of them in side columns. Anchor coordinates are unchanged.
      if (deg >= -42 && deg < 42) edge = "right";
      else if (deg >= 42 && deg < 138) edge = "bottom";
      else if (deg >= -138 && deg < -42) edge = "top";
      else edge = "left";
      const sz = edge === "top" || edge === "bottom" ? rowSize(s.id, s.name) : sideSize(s.id, s.name);
      items.push({ id: s.id, name: s.name, ax, ay, edge, lx: ax, ly: ay, w: sz.w, h: sz.h });
    }

    // Top/bottom are slim rows with limited width — keep only the labels that
    // fit (preferring those sitting most directly above/below the brain) and
    // spill the rest into the roomier side columns.
    const rowLeft = 24;
    const rowRight = box.wrapW - 24;
    const rowAvail = Math.max(0, rowRight - rowLeft);
    const rowGap = 14;
    for (const edge of ["top", "bottom"] as const) {
      const row = items.filter((i) => i.edge === edge);
      const needed = () =>
        row.reduce((sum, it) => sum + it.w, 0) + rowGap * Math.max(0, row.length - 1);
      while (row.length > 0 && needed() > rowAvail) {
        let idx = 0;
        let far = -1;
        for (let k = 0; k < row.length; k++) {
          const d = Math.abs(row[k].ax - cx0);
          if (d > far) {
            far = d;
            idx = k;
          }
        }
        const it = row[idx];
        it.edge = it.ax < cx0 ? "left" : "right";
        const sz = sideSize(it.id, it.name);
        it.w = sz.w;
        it.h = sz.h;
        row.splice(idx, 1);
      }
    }

    // Balance the side labels across both columns. Clearly-sided anchors stay
    // put; centrally-anchored ones (e.g. the brainstem cranial nerves) are
    // dealt to whichever column is currently shorter, so a clustered view
    // spreads across both sides instead of stacking down one.
    const gap = 7;
    const band = box.w * 0.16;
    let leftH = 0;
    let rightH = 0;
    const sideItems = items.filter((i) => i.edge === "left" || i.edge === "right");
    for (const it of sideItems) {
      if (Math.abs(it.ax - cx0) >= band) {
        if (it.ax < cx0) {
          it.edge = "left";
          leftH += it.h + gap;
        } else {
          it.edge = "right";
          rightH += it.h + gap;
        }
      }
    }
    const central = sideItems
      .filter((i) => Math.abs(i.ax - cx0) < band)
      .sort((a, b) => a.ay - b.ay);
    for (const it of central) {
      if (leftH <= rightH) {
        it.edge = "left";
        leftH += it.h + gap;
      } else {
        it.edge = "right";
        rightH += it.h + gap;
      }
    }

    // Vertical columns (left / right): x pinned to the gutter centre, y =
    // clamped anchor y, then nudged apart top→bottom (pulled back up on
    // overflow).
    const colTop = 14;
    // Reserve the bottom strip for the view caption so columns never collide with it.
    const colBottom = box.wrapH - 46;
    for (const edge of ["left", "right"] as const) {
      const arr = items.filter((i) => i.edge === edge).sort((a, b) => a.ay - b.ay);
      const colX = edge === "left" ? box.l - SIDE_GUTTER / 2 + 2 : box.l + box.w + SIDE_GUTTER / 2 - 2;
      for (const it of arr) {
        it.lx = colX;
        it.ly = Math.min(Math.max(it.ay, colTop + it.h / 2), colBottom - it.h / 2);
      }
      for (let i = 1; i < arr.length; i++) {
        const minY = arr[i - 1].ly + arr[i - 1].h / 2 + gap + arr[i].h / 2;
        if (arr[i].ly < minY) arr[i].ly = minY;
      }
      const last = arr[arr.length - 1];
      if (last && last.ly + last.h / 2 > colBottom) {
        last.ly = colBottom - last.h / 2;
        for (let i = arr.length - 2; i >= 0; i--) {
          const maxY = arr[i + 1].ly - arr[i + 1].h / 2 - gap - arr[i].h / 2;
          if (arr[i].ly > maxY) arr[i].ly = Math.max(maxY, colTop + arr[i].h / 2);
        }
      }
    }

    // Horizontal rows (top / bottom): y pinned to the slim gutter, x = clamped
    // anchor x, then nudged apart left→right.
    for (const edge of ["top", "bottom"] as const) {
      const arr = items.filter((i) => i.edge === edge).sort((a, b) => a.ax - b.ax);
      for (const it of arr) {
        it.ly = edge === "top" ? 16 + it.h / 2 : box.wrapH - 40 - it.h / 2;
        it.lx = Math.min(Math.max(it.ax, rowLeft + it.w / 2), rowRight - it.w / 2);
      }
      for (let i = 1; i < arr.length; i++) {
        const minX = arr[i - 1].lx + arr[i - 1].w / 2 + rowGap + arr[i].w / 2;
        if (arr[i].lx < minX) arr[i].lx = minX;
      }
      const last = arr[arr.length - 1];
      if (last && last.lx + last.w / 2 > rowRight) {
        last.lx = rowRight - last.w / 2;
        for (let i = arr.length - 2; i >= 0; i--) {
          const maxX = arr[i + 1].lx - arr[i + 1].w / 2 - rowGap - arr[i].w / 2;
          if (arr[i].lx > maxX) arr[i].lx = Math.max(maxX, rowLeft + arr[i].w / 2);
        }
      }
    }
    return items;
  }, [box, hotspots, sizes]);

  return (
    <div ref={wrapRef} className="relative h-full w-full" data-testid="brain-diagram">
      {/* Hidden measurement layer — mirrors the live labels' font + width so we
          can read each label's true rendered size before positioning. Never
          visible; excluded from a11y and pointer events. */}
      <div
        ref={measureLayerRef}
        aria-hidden
        className="pointer-events-none"
        style={{ position: "absolute", left: -99999, top: 0, visibility: "hidden" }}
      >
        {hotspots.map((h) => {
          const s = STRUCTURE_INDEX[h.id];
          if (!s) return null;
          return (
            <Fragment key={h.id}>
              <div
                data-measure-id={s.id}
                data-measure-kind="side"
                className="box-border px-0.5 text-[11px] font-semibold leading-tight"
                style={{ width: SIDE_GUTTER - 14 }}
              >
                {s.name}
              </div>
              <div
                data-measure-id={s.id}
                data-measure-kind="row"
                className="box-border inline-block px-0.5 text-[11px] font-semibold leading-tight"
                style={{ maxWidth: 180 }}
              >
                {s.name}
              </div>
            </Fragment>
          );
        })}
      </div>
      {view.src ? (
        <>
          {/* Centered image, with gutters reserved for the label columns */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ paddingLeft: SIDE_GUTTER, paddingRight: SIDE_GUTTER, paddingTop: 8, paddingBottom: 24 }}
          >
            <div ref={imgBoxRef} className="relative max-h-full max-w-full">
              <img
                src={view.src}
                alt={`${view.viewName} — ${view.caption}`}
                className="block max-h-full max-w-full object-contain select-none"
                draggable={false}
                onLoad={measure}
                style={{
                  filter: `grayscale(1) contrast(1.05) brightness(1.03) drop-shadow(0 24px 60px ${PALETTE.bg}) drop-shadow(0 0 40px ${PALETTE.teal}55)`,
                }}
                data-testid={`brain-view-${activeView}`}
              />
            </div>
          </div>

          {/* Leader lines + anchor dots */}
          {box && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width="100%"
              height="100%"
              style={{ zIndex: 10 }}
            >
              {layout.map((it) => {
                const active = selectedId === it.id;
                const emphasized = active || hoveredId === it.id;
                const dim = selectedId !== null && !active;
                // Attach the leader to the inner edge of the (box-less) text so
                // it clearly points from structure → its own label.
                const boxHalf = (SIDE_GUTTER - 14) / 2;
                let ex = it.lx;
                let ey = it.ly;
                if (it.edge === "left") ex = it.lx + boxHalf;
                else if (it.edge === "right") ex = it.lx - boxHalf;
                else if (it.edge === "top") ey = it.ly + it.h / 2;
                else ey = it.ly - it.h / 2;
                return (
                  <g key={it.id} opacity={dim ? 0.22 : 1}>
                    {/* Straight leader from the anatomical anchor to the inner
                        edge of the text label. */}
                    <line
                      x1={it.ax}
                      y1={it.ay}
                      x2={ex}
                      y2={ey}
                      stroke={GLOW}
                      strokeWidth={emphasized ? 1.8 : 1}
                      strokeOpacity={emphasized ? 1 : 0.4}
                      style={emphasized ? { filter: `drop-shadow(0 0 5px ${GLOW})` } : undefined}
                    />
                    <circle
                      cx={it.ax}
                      cy={it.ay}
                      r={emphasized ? 4.5 : 2.6}
                      fill={emphasized ? GLOW : `${GLOW}cc`}
                      stroke={PALETTE.bg}
                      strokeWidth={1}
                      style={emphasized ? { filter: `drop-shadow(0 0 7px ${GLOW})` } : undefined}
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {/* Clickable text labels parked around the brain — no boxes, just
              glowing text with a dark halo so they stay legible over the
              artwork. */}
          {box &&
            layout.map((it) => {
              const active = selectedId === it.id;
              const emphasized = active || hoveredId === it.id;
              const dim = selectedId !== null && !active;
              const horizontal = it.edge === "top" || it.edge === "bottom";
              const align: "left" | "right" | "center" =
                it.edge === "left" ? "right" : it.edge === "right" ? "left" : "center";
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(it.id);
                  }}
                  onMouseEnter={() => onHover(it.id)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(it.id)}
                  onBlur={() => onHover(null)}
                  className="absolute px-0.5 text-[11px] font-semibold leading-tight outline-none transition-all hover:brightness-125 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-white/80"
                  style={{
                    left: it.lx,
                    top: it.ly,
                    transform: "translate(-50%, -50%)",
                    width: horizontal ? "auto" : SIDE_GUTTER - 14,
                    maxWidth: horizontal ? 180 : SIDE_GUTTER - 14,
                    textAlign: align,
                    zIndex: emphasized ? 30 : 20,
                    opacity: dim ? 0.4 : 1,
                    background: "transparent",
                    border: "none",
                    color: emphasized ? "#ffffff" : PALETTE.mist,
                    textShadow: emphasized
                      ? `0 0 9px ${GLOW}, 0 0 16px ${GLOW}, 0 1px 2px ${PALETTE.bg}, 0 0 4px ${PALETTE.bg}`
                      : `0 0 4px ${PALETTE.bg}, 0 1px 3px ${PALETTE.bg}, 0 0 9px ${PALETTE.bg}, 0 0 9px ${PALETTE.bg}`,
                  }}
                  aria-pressed={active}
                  data-testid={`hotspot-${it.id}`}
                  title={it.name}
                >
                  {it.name}
                </button>
              );
            })}
        </>
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3 px-6"
          data-testid={`brain-view-placeholder-${activeView}`}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.surface}, ${PALETTE.surfaceElev})`,
              border: `1px solid ${PALETTE.steel}99`,
              boxShadow: `0 0 30px -8px ${PALETTE.teal}66`,
            }}
          >
            <Brain className="w-7 h-7" style={{ color: PALETTE.surf }} />
          </div>
          <p className="text-sm font-semibold text-white">{view.viewName} coming soon</p>
          <p className="text-xs max-w-xs" style={{ color: `${PALETTE.mist}99` }}>
            This view will show the {view.caption.toLowerCase()}. For now, search by
            name or symptom to open any structure's detail.
          </p>
        </div>
      )}

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
  const [activeView, setActiveView] = useState<ViewKey>("lateral");
  const [viewMode, setViewMode] = useState<ViewMode>("sections");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // The 3D model is the high-level orientation view: it shows ONLY the four
  // cortical lobes, each a clickable glow that opens its detail. All the finer
  // named anatomy lives in the labeled 2D atlas views.
  const view3dStructures = useMemo(
    () => BRAIN_STRUCTURES.filter((s) => s.category === "lobe"),
    [],
  );

  // Flat pool for the "label each part" quiz — every hotspot that sits on a real
  // view image, deduped by structure and grouped by the diagram it appears on
  // (so "find the part" distractors and "name the part" choices stay plausible).
  const quizItems = useMemo<QuizItem[]>(() => {
    const seen = new Set<string>();
    const out: QuizItem[] = [];
    for (const tab of VIEW_KEYS) {
      const view = BRAIN_VIEWS[tab];
      if (!view.src) continue;
      for (const h of HOTSPOTS[tab]) {
        if (seen.has(h.id)) continue;
        const s = STRUCTURE_INDEX[h.id];
        if (!s) continue;
        seen.add(h.id);
        out.push({
          id: s.id,
          name: s.name,
          shortName: s.shortName,
          viewKey: view.src,
          viewSrc: view.src,
          viewName: view.viewName,
          x: h.x,
          y: h.y,
          blurb: s.functions[0] ?? s.overview,
        });
      }
    }
    return out;
  }, []);

  // Quiz state lives here so the quiz can render SPLIT: the diagram in the brain
  // canvas (left) and the prompt + answers in the detail box (right).
  const quiz = useBrainQuiz(quizItems);

  // Start a fresh round each time the learner enters Quiz mode.
  const restartQuiz = quiz.restart;
  useEffect(() => {
    if (viewMode === "quiz") restartQuiz();
  }, [viewMode, restartQuiz]);

  // Init from media queries + URL hash
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mqMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    setIsMobile(mqMobile.matches);

    const initial = readFocusFromHash();
    if (initial) {
      setSelectedId(initial);
      const v = viewForStructure(initial);
      if (v) setActiveView(v);
    }

    const onHash = () => {
      const f = readFocusFromHash();
      setSelectedId(f);
      if (f) {
        const v = viewForStructure(f);
        if (v) setActiveView(v);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Selection handler — syncs the active region tab so the numbered key
  // highlights the picked structure, and writes the hash so the URL
  // remains shareable.
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setSearchOpen(false);
    writeFocusToHash(id);
    setShowMobileDetail(true);
    // Keep the user on the current tab when the structure already lives there
    // (marker click / key row on the active view); only snap views for picks that
    // aren't visible on the current diagram (e.g. global search).
    setActiveView((current) => viewForStructure(id, current) ?? current);
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
    <div className="flex h-[calc(100vh-57px)] min-h-0 flex-col overflow-hidden study-page-bg">
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
            <h1
              className="font-light uppercase truncate leading-none"
              style={{
                fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
                fontSize: "clamp(15px, 2.2vw, 19px)",
                letterSpacing: "0.22em",
                color: PALETTE.cloud,
                textShadow: `0 0 18px ${PALETTE.surf}55`,
              }}
            >
              Brain Lab
            </h1>
            <p className="text-xs hidden sm:block" style={{ color: `${PALETTE.mist}99` }}>
              Explore the brain. Understand the mind.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View toggle — interactive 3D brain vs. anatomical section images */}
          <div
            className="flex items-center p-0.5 rounded-xl border"
            style={{ background: `${PALETTE.surface}cc`, borderColor: `${PALETTE.steel}99` }}
            data-testid="brain-view-toggle"
          >
            {([
              { mode: "3d" as ViewMode, label: "3D", icon: Box },
              { mode: "sections" as ViewMode, label: "Sections", icon: Layers },
              { mode: "quiz" as ViewMode, label: "Quiz", icon: GraduationCap },
            ]).map(({ mode, label, icon: Icon }) => {
              const on = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all"
                  style={{
                    background: on ? `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})` : "transparent",
                    color: on ? PALETTE.bg : PALETTE.mist,
                  }}
                  data-testid={`button-view-${mode}`}
                  aria-pressed={on}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            className="px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-2 transition-all hover:-translate-y-0.5"
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
        <ViewTabs
          active={activeView}
          onPick={(v) => {
            setActiveView(v);
            setViewMode("sections");
            // Switching views resets the panel to the top / "pick a structure"
            // so the previous view's selection doesn't linger.
            setSelectedId(null);
            setHoveredId(null);
            writeFocusToHash(null);
            setShowMobileDetail(false);
          }}
        />
      </div>

      {/* Body — 2-pane: diagram canvas / detail */}
      <div
        className="grid min-h-0 min-w-0 flex-1 grid-cols-1 overflow-hidden gap-3 p-3 md:p-4"
        style={{
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) minmax(360px, 430px)",
          gridTemplateRows: "minmax(0, 1fr)",
        }}
      >
        {/* Center: brain diagram + numbered key below (mobile) */}
        <div className="flex flex-col gap-3 min-h-0 min-w-0 h-full overflow-hidden">
          <div
            className="relative rounded-2xl border overflow-hidden flex-1 min-h-0 h-full"
            style={{
              background: PALETTE.bg,
              borderColor: `${PALETTE.steel}99`,
              boxShadow: `0 20px 60px -30px ${PALETTE.teal}aa`,
            }}
            data-testid="brain-diagram-wrap"
          >
            {viewMode === "3d" ? (
              <Brain3DErrorBoundary onFallback={() => setViewMode("sections")}>
                <Suspense
                  fallback={
                    <div
                      className="h-full w-full flex flex-col items-center justify-center gap-3"
                      data-testid="brain-3d-loading"
                    >
                      <Brain
                        className="w-8 h-8 animate-pulse"
                        style={{ color: PALETTE.surf }}
                      />
                      <p className="text-xs" style={{ color: `${PALETTE.mist}99` }}>
                        Loading 3D brain…
                      </p>
                    </div>
                  }
                >
                  <Brain3DView
                    structures={view3dStructures}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    isMobile={isMobile}
                  />
                </Suspense>
              </Brain3DErrorBoundary>
            ) : viewMode === "quiz" ? (
              <BrainQuizDiagram controller={quiz} isMobile={isMobile} />
            ) : isMobile ? (
              <BrainDiagram
                activeView={activeView}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={handleSelect}
                onHover={setHoveredId}
              />
            ) : (
              <LabeledBrainDiagram
                activeView={activeView}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={handleSelect}
                onHover={setHoveredId}
              />
            )}

            {/* Search overlay */}
            {searchOpen && (
              <StructureSearch onSelect={handleSelect} onClose={() => setSearchOpen(false)} />
            )}
          </div>

          {/* Numbered key — mobile only, Sections mode only (sits below the
              brain). On desktop the key lives in the right pane. */}
          {isMobile && viewMode === "sections" && (
            <div className="flex-shrink-0" style={{ height: "40vh" }}>
              <NumberedKey
                activeView={activeView}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={handleSelect}
                onHover={setHoveredId}
              />
            </div>
          )}

          {/* Quiz panel — mobile only (sits below the brain; on desktop it lives
              in the right pane). */}
          {isMobile && viewMode === "quiz" && (
            <div className="flex-shrink-0" style={{ maxHeight: "46vh" }}>
              <BrainQuizPanel controller={quiz} onExit={() => setViewMode("sections")} />
            </div>
          )}
        </div>

        {/* Right: detail panel (desktop) */}
        {!isMobile && (
          <aside className="h-full min-h-0 max-h-full overflow-hidden">
            {viewMode === "quiz" ? (
              <BrainQuizPanel controller={quiz} onExit={() => setViewMode("sections")} />
            ) : selected ? (
              <StructureDetail key={selected.id} struct={selected} onClose={handleClose} />
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
