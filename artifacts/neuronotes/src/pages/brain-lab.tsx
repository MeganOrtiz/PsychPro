import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense, Component, type ReactNode } from "react";
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
  CATEGORY_META,
  type BrainStructure,
  type PartCategory,
  type DetailBlock,
} from "../data/brain-structures";
import brainLateral from "@/assets/brain-views/lateral.webp";
import brainMedial from "@/assets/brain-views/medial.webp";
import brainMidsagittal from "@/assets/brain-views/midsagittal.webp";
import brainCoronal from "@/assets/brain-views/coronal.webp";
import brainDorsal from "@/assets/brain-views/dorsal.webp";
import brainVentral from "@/assets/brain-views/ventral.webp";
import brainVentralNerves from "@/assets/brain-views/ventral-nerves.webp";
import BrainQuiz, { type QuizItem } from "@/components/brain/brain-quiz";

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
            className="mt-1 text-xs font-semibold px-3 py-1.5 rounded-full"
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
  medial: { label: "Medial", icon: Layers },
  midsagittal: { label: "Midsagittal", icon: Activity },
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

        {tab === "anatomy" && detail?.anatomy && (
          <RichBlocks blocks={detail.anatomy} accent={struct.color} />
        )}

        {tab === "functions" &&
          (detail?.functions ? (
            <RichBlocks blocks={detail.functions} accent={PALETTE.surf} />
          ) : (
            <DetailSection title="Key Functions" items={struct.functions} bullet={PALETTE.surf} />
          ))}

        {tab === "connections" && (
          <>
            {detail?.connections && <RichBlocks blocks={detail.connections} accent={struct.color} />}
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
            <RichBlocks blocks={detail.clinical} accent={struct.color} />
          ) : (
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
          ))}

        {tab === "assessment" && detail?.assessment && (
          <RichBlocks blocks={detail.assessment} accent={struct.color} />
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
    viewName: "Medial view",
    caption: "The medial surface of the hemisphere",
  },
  midsagittal: {
    src: brainMidsagittal,
    viewName: "Midsagittal view",
    caption: "Cut down the midline — deep medial structures",
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
  // Lateral view (brain faces left) — cortical surface
  lateral: [
    // Top — sensorimotor strip (labels above the vertex)
    { id: "precentral-gyrus", x: 44, y: 15, lx: 32, ly: 3, side: "left" },
    { id: "central-sulcus", x: 46, y: 13, lx: 44, ly: 9, side: "right" },
    { id: "postcentral-gyrus", x: 50, y: 15, lx: 62, ly: 3, side: "right" },
    // Left margin — frontal gyri, Broca's pars subdivisions, temporal gyri
    { id: "superior-frontal-gyrus", x: 34, y: 15, lx: 18, ly: 6, side: "left" },
    { id: "middle-frontal-gyrus", x: 29, y: 25, lx: 16, ly: 14, side: "left" },
    { id: "inferior-frontal-gyrus", x: 25, y: 38, lx: 14, ly: 22, side: "left" },
    { id: "pars-opercularis", x: 32, y: 44, lx: 14, ly: 30, side: "left" },
    { id: "pars-triangularis", x: 27, y: 46, lx: 13, ly: 38, side: "left" },
    { id: "pars-orbitalis", x: 21, y: 48, lx: 12, ly: 46, side: "left" },
    { id: "broca-area", x: 30, y: 51, lx: 13, ly: 54, side: "left" },
    { id: "lateral-sulcus", x: 40, y: 51, lx: 12, ly: 61, side: "left" },
    { id: "temporal-pole", x: 17, y: 61, lx: 10, ly: 68, side: "left" },
    { id: "superior-temporal-gyrus", x: 41, y: 60, lx: 12, ly: 75, side: "left" },
    { id: "superior-temporal-sulcus", x: 44, y: 63, lx: 13, ly: 82, side: "left" },
    { id: "middle-temporal-gyrus", x: 45, y: 66, lx: 15, ly: 89, side: "left" },
    { id: "inferior-temporal-gyrus", x: 48, y: 71, lx: 17, ly: 96, side: "left" },
    // Right margin — parietal lobules/gyri, occipital, cerebellum
    { id: "intraparietal-sulcus", x: 59, y: 24, lx: 82, ly: 12, side: "right" },
    { id: "superior-parietal-lobule", x: 60, y: 20, lx: 84, ly: 20, side: "right" },
    { id: "supramarginal-gyrus", x: 63, y: 36, lx: 86, ly: 28, side: "right" },
    { id: "angular-gyrus", x: 68, y: 44, lx: 88, ly: 36, side: "right" },
    { id: "inferior-parietal-lobule", x: 66, y: 40, lx: 88, ly: 44, side: "right" },
    { id: "wernicke-area", x: 61, y: 52, lx: 86, ly: 52, side: "right" },
    { id: "occipital-pole", x: 86, y: 46, lx: 91, ly: 60, side: "right" },
    { id: "lateral-occipital-cortex", x: 80, y: 53, lx: 90, ly: 68, side: "right" },
    { id: "cerebellar-hemisphere", x: 79, y: 73, lx: 88, ly: 76, side: "right" },
    // Bottom — auditory cortex tucked in the Sylvian fissure
    { id: "auditory-cortex", x: 50, y: 57, lx: 42, ly: 90, side: "left" },
  ],
  // Medial surface (brain faces left) — cortical medial regions plus the midline
  // white-matter/limbic landmarks and the brainstem/cerebellum.
  medial: [
    // Left margin — frontal, cingulate, midline white matter, brainstem
    { id: "frontal-lobe", x: 22, y: 24, lx: 10, ly: 8, side: "left" },
    { id: "cingulate-sulcus", x: 38, y: 27, lx: 9, ly: 15, side: "left" },
    { id: "cingulate-gyrus", x: 40, y: 33, lx: 9, ly: 22, side: "left" },
    { id: "corpus-callosum", x: 43, y: 39, lx: 8, ly: 29, side: "left" },
    { id: "prefrontal-cortex", x: 15, y: 44, lx: 7, ly: 36, side: "left" },
    { id: "fornix", x: 40, y: 46, lx: 8, ly: 43, side: "left" },
    { id: "thalamus", x: 48, y: 47, lx: 9, ly: 50, side: "left" },
    { id: "hypothalamus", x: 42, y: 52, lx: 8, ly: 57, side: "left" },
    { id: "optic-chiasm", x: 34, y: 55, lx: 7, ly: 64, side: "left" },
    { id: "mammillary-bodies", x: 44, y: 54, lx: 8, ly: 71, side: "left" },
    { id: "midbrain", x: 50, y: 56, lx: 10, ly: 78, side: "left" },
    { id: "pons", x: 49, y: 63, lx: 10, ly: 85, side: "left" },
    { id: "medulla", x: 48, y: 72, lx: 11, ly: 92, side: "left" },
    // Right margin — paracentral, parietal, precuneus, occipital, cerebellum
    { id: "paracentral-lobule", x: 50, y: 18, lx: 58, ly: 8, side: "right" },
    { id: "parietal-lobe", x: 62, y: 20, lx: 80, ly: 14, side: "right" },
    { id: "posterior-cingulate", x: 56, y: 31, lx: 84, ly: 24, side: "right" },
    { id: "precuneus", x: 64, y: 28, lx: 86, ly: 34, side: "right" },
    { id: "parieto-occipital-sulcus", x: 70, y: 30, lx: 88, ly: 44, side: "right" },
    { id: "cuneus", x: 76, y: 38, lx: 90, ly: 54, side: "right" },
    { id: "occipital-lobe", x: 82, y: 40, lx: 91, ly: 64, side: "right" },
    { id: "calcarine-sulcus", x: 74, y: 46, lx: 88, ly: 72, side: "right" },
    { id: "lingual-gyrus", x: 72, y: 52, lx: 86, ly: 80, side: "right" },
    { id: "cerebellum", x: 67, y: 62, lx: 86, ly: 88, side: "right" },
  ],
  // Midsagittal view (brain faces left) — deep medial structures spanning the
  // limbic system, brainstem/cerebellum, and midline white-matter tracts.
  midsagittal: [
    // Left margin — midline limbic / brainstem column
    { id: "cingulate-gyrus", x: 40, y: 32, lx: 8, ly: 10, side: "left" },
    { id: "corpus-callosum", x: 42, y: 38, lx: 7, ly: 18, side: "left" },
    { id: "fornix", x: 40, y: 45, lx: 7, ly: 26, side: "left" },
    { id: "thalamus", x: 47, y: 46, lx: 8, ly: 34, side: "left" },
    { id: "hypothalamus", x: 41, y: 52, lx: 8, ly: 42, side: "left" },
    { id: "optic-chiasm", x: 34, y: 55, lx: 7, ly: 50, side: "left" },
    { id: "mammillary-bodies", x: 42, y: 55, lx: 8, ly: 58, side: "left" },
    { id: "midbrain", x: 50, y: 54, lx: 9, ly: 66, side: "left" },
    { id: "pons", x: 49, y: 63, lx: 10, ly: 74, side: "left" },
    { id: "medulla", x: 48, y: 73, lx: 11, ly: 82, side: "left" },
    // Right margin — medial parietal/occipital + deep midline glands
    { id: "paracentral-lobule", x: 50, y: 20, lx: 58, ly: 8, side: "right" },
    { id: "posterior-cingulate", x: 55, y: 32, lx: 84, ly: 18, side: "right" },
    { id: "precuneus", x: 62, y: 30, lx: 86, ly: 28, side: "right" },
    { id: "parieto-occipital-sulcus", x: 68, y: 32, lx: 88, ly: 38, side: "right" },
    { id: "cuneus", x: 74, y: 40, lx: 90, ly: 48, side: "right" },
    { id: "calcarine-sulcus", x: 72, y: 47, lx: 88, ly: 58, side: "right" },
    { id: "pineal-gland", x: 56, y: 47, lx: 86, ly: 66, side: "right" },
    { id: "locus-coeruleus", x: 51, y: 60, lx: 86, ly: 74, side: "right" },
    { id: "cerebellum", x: 66, y: 61, lx: 86, ly: 84, side: "right" },
  ],
  // Coronal section — subcortical nuclei, capsules & ventricles
  coronal: [
    // Left side of the slice
    { id: "corpus-callosum", x: 50, y: 28, lx: 14, ly: 12, side: "left" },
    { id: "caudate", x: 45, y: 36, lx: 12, ly: 22, side: "left" },
    { id: "putamen", x: 38, y: 45, lx: 10, ly: 32, side: "left" },
    { id: "external-capsule", x: 35, y: 46, lx: 9, ly: 42, side: "left" },
    { id: "claustrum", x: 34, y: 48, lx: 9, ly: 52, side: "left" },
    { id: "insular-cortex", x: 33, y: 50, lx: 9, ly: 62, side: "left" },
    // Right side of the slice
    { id: "lateral-ventricles", x: 52, y: 33, lx: 84, ly: 16, side: "right" },
    { id: "internal-capsule", x: 46, y: 45, lx: 86, ly: 28, side: "right" },
    { id: "globus-pallidus", x: 43, y: 47, lx: 86, ly: 40, side: "right" },
    { id: "thalamus", x: 48, y: 52, lx: 86, ly: 52, side: "right" },
    { id: "third-ventricle", x: 50, y: 50, lx: 86, ly: 64, side: "right" },
  ],
  // Dorsal (superior) view — front at top, occipital at bottom. Left hemisphere
  // labels on the left, right hemisphere + midline on the right.
  dorsal: [
    { id: "frontal-pole", x: 42, y: 8, lx: 12, ly: 6, side: "left" },
    { id: "prefrontal-cortex", x: 38, y: 15, lx: 11, ly: 17, side: "left" },
    { id: "frontal-lobe", x: 36, y: 25, lx: 10, ly: 28, side: "left" },
    { id: "superior-frontal-gyrus", x: 42, y: 32, lx: 10, ly: 39, side: "left" },
    { id: "precentral-gyrus", x: 40, y: 43, lx: 10, ly: 50, side: "left" },
    { id: "postcentral-gyrus", x: 42, y: 53, lx: 10, ly: 61, side: "left" },
    { id: "intraparietal-sulcus", x: 37, y: 60, lx: 10, ly: 72, side: "left" },
    { id: "parietal-lobe", x: 39, y: 68, lx: 10, ly: 83, side: "left" },
    { id: "occipital-lobe", x: 42, y: 86, lx: 12, ly: 93, side: "left" },
    { id: "longitudinal-fissure", x: 50, y: 30, lx: 72, ly: 12, side: "right" },
    { id: "central-sulcus", x: 44, y: 47, lx: 88, ly: 30, side: "right" },
    { id: "motor-cortex", x: 58, y: 42, lx: 88, ly: 46, side: "right" },
    { id: "somatosensory-cortex", x: 58, y: 52, lx: 88, ly: 60, side: "right" },
    { id: "superior-parietal-lobule", x: 58, y: 64, lx: 88, ly: 76, side: "right" },
  ],
  // Ventral (inferior) surface — front at top, cerebellum at bottom.
  ventral: [
    { id: "gyrus-rectus", x: 45, y: 16, lx: 14, ly: 8, side: "left" },
    { id: "temporal-pole", x: 33, y: 26, lx: 10, ly: 20, side: "left" },
    { id: "olfactory-bulb", x: 46, y: 22, lx: 12, ly: 32, side: "left" },
    { id: "temporal-lobe", x: 27, y: 40, lx: 8, ly: 44, side: "left" },
    { id: "parahippocampal-gyrus", x: 38, y: 46, lx: 9, ly: 56, side: "left" },
    { id: "fusiform-gyrus", x: 35, y: 52, lx: 9, ly: 68, side: "left" },
    { id: "uncus", x: 42, y: 42, lx: 10, ly: 80, side: "left" },
    { id: "orbitofrontal-cortex", x: 53, y: 14, lx: 86, ly: 10, side: "right" },
    { id: "optic-chiasm", x: 49, y: 34, lx: 86, ly: 24, side: "right" },
    { id: "pituitary", x: 50, y: 38, lx: 86, ly: 30, side: "right" },
    { id: "mammillary-bodies", x: 49, y: 41, lx: 86, ly: 36, side: "right" },
    { id: "midbrain", x: 49, y: 48, lx: 86, ly: 48, side: "right" },
    { id: "pons", x: 49, y: 56, lx: 86, ly: 60, side: "right" },
    { id: "medulla", x: 49, y: 63, lx: 86, ly: 72, side: "right" },
    { id: "cerebellum", x: 46, y: 82, lx: 86, ly: 84, side: "right" },
  ],
  // Ventral (inferior) surface showing the cranial-nerve roots.
  ventralNerves: [
    { id: "gyrus-rectus", x: 46, y: 16, lx: 12, ly: 8, side: "left" },
    { id: "olfactory-bulb", x: 45, y: 24, lx: 11, ly: 22, side: "left" },
    { id: "temporal-pole", x: 33, y: 30, lx: 9, ly: 36, side: "left" },
    { id: "temporal-lobe", x: 28, y: 46, lx: 8, ly: 50, side: "left" },
    { id: "orbitofrontal-cortex", x: 40, y: 20, lx: 8, ly: 64, side: "left" },
    { id: "frontal-lobe", x: 52, y: 13, lx: 86, ly: 10, side: "right" },
    { id: "optic-chiasm", x: 50, y: 36, lx: 86, ly: 24, side: "right" },
    { id: "mammillary-bodies", x: 49, y: 43, lx: 86, ly: 36, side: "right" },
    { id: "midbrain", x: 49, y: 50, lx: 86, ly: 48, side: "right" },
    { id: "pons", x: 49, y: 58, lx: 86, ly: 60, side: "right" },
    { id: "medulla", x: 49, y: 67, lx: 86, ly: 72, side: "right" },
    { id: "cerebellum", x: 41, y: 78, lx: 86, ly: 84, side: "right" },
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
        Tap a glowing region on the model, switch to Sections for the full
        labeled atlas, or search by name or symptom.
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

  const categories = useMemo(() => {
    const present = new Set<PartCategory>();
    for (const h of hotspots) {
      const s = STRUCTURE_INDEX[h.id];
      if (s) present.add(s.category);
    }
    return (Object.keys(CATEGORY_META) as PartCategory[]).filter((c) => present.has(c));
  }, [hotspots]);

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
        {categories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {categories.map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1 text-[10px]"
                style={{ color: `${PALETTE.mist}cc` }}
              >
                <span
                  className="inline-block rounded-sm"
                  style={{
                    width: 8,
                    height: 8,
                    background: CATEGORY_META[cat].color,
                    boxShadow: `0 0 5px ${CATEGORY_META[cat].color}aa`,
                  }}
                />
                {CATEGORY_META[cat].label}
              </span>
            ))}
          </div>
        )}
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
                className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors"
                style={{
                  background: emphasized ? `${s.color}1f` : "transparent",
                  boxShadow: active ? `inset 0 0 0 1px ${s.color}aa` : "none",
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
                    background: s.color,
                    color: PALETTE.bg,
                    boxShadow: emphasized ? `0 0 10px 1px ${s.color}` : "none",
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
      className="relative h-full w-full flex items-center justify-center p-4 md:p-6"
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
                  className="flex items-center justify-center rounded-full font-bold outline-none transition-all duration-150"
                  style={{
                    width: emphasized ? 24 : 19,
                    height: emphasized ? 24 : 19,
                    fontSize: emphasized ? 12 : 10,
                    background: struct.color,
                    color: PALETTE.bg,
                    border: "1.5px solid #fff",
                    boxShadow: emphasized
                      ? `0 0 0 2px ${PALETTE.bg}aa, 0 0 14px 3px ${struct.color}`
                      : `0 0 0 2px ${PALETTE.bg}99, 0 0 6px 1px ${struct.color}aa`,
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
                      border: `1px solid ${struct.color}cc`,
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

      {/* View caption */}
      <div
        className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 px-4 text-center"
        style={{ pointerEvents: "none" }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: `${PALETTE.surface}cc`, color: PALETTE.surf }}
        >
          {view.viewName}
        </span>
        <span className="text-[11px]" style={{ color: `${PALETTE.mist}88` }}>
          {view.caption}
        </span>
      </div>
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
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
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
        <ViewTabs
          active={activeView}
          onPick={(v) => {
            setActiveView(v);
            setViewMode("sections");
          }}
        />
      </div>

      {/* Body — 2-pane: diagram canvas / detail */}
      <div
        className="flex-1 min-h-0 min-w-0 w-full overflow-hidden grid gap-3 p-3 md:p-4"
        style={{
          gridTemplateColumns: isMobile ? "1fr" : "1fr minmax(340px, 420px)",
        }}
      >
        {/* Center: brain diagram + numbered key below (mobile) */}
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
              <BrainQuiz
                items={quizItems}
                isMobile={isMobile}
                onExit={() => setViewMode("sections")}
              />
            ) : (
              <BrainDiagram
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
        </div>

        {/* Right: detail panel (desktop) */}
        {!isMobile && (
          <aside className="overflow-hidden">
            {selected ? (
              <StructureDetail struct={selected} onClose={handleClose} />
            ) : viewMode === "sections" ? (
              <NumberedKey
                activeView={activeView}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={handleSelect}
                onHover={setHoveredId}
              />
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
