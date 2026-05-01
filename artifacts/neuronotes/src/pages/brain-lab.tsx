import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "wouter";
import {
  Brain,
  ArrowRight,
  X,
  Activity,
  Eye,
  Headphones,
  MessageSquare,
  Sparkles,
  Layers,
  RotateCcw,
  Hand,
  AlertCircle,
} from "lucide-react";

const PALETTE = {
  bg: "#061826",
  surface: "#0c2538",
  surfaceElev: "#11324d",
  steel: "#1C4E75",
  teal: "#2FA0C6",
  surf: "#58C9F3",
  mist: "#BDE5FF",
};

type RegionId =
  | "frontal"
  | "parietal"
  | "temporal-l"
  | "temporal-r"
  | "occipital"
  | "cerebellum"
  | "brainstem"
  | "limbic";

interface RegionInfo {
  id: RegionId;
  name: string;
  shortName: string;
  icon: React.ElementType;
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  displacement: number;
  segments: number;
  summary: string;
  keyFunctions: string[];
  clinical: string[];
  topicHints: string[];
}

const REGIONS: RegionInfo[] = [
  {
    id: "frontal",
    name: "Frontal Lobe",
    shortName: "Frontal",
    icon: Activity,
    color: "#58C9F3",
    position: [0, 0.45, 1.05],
    scale: [1.5, 1.15, 1.25],
    displacement: 0.18,
    segments: 5,
    summary:
      "The largest lobe of the cortex — seat of executive function, planning, voluntary movement, and personality.",
    keyFunctions: [
      "Executive function & planning",
      "Voluntary motor control (precentral gyrus)",
      "Expressive language (Broca's area)",
      "Personality, judgment, impulse control",
      "Working memory",
    ],
    clinical: [
      "Disinhibition / personality change after injury",
      "Expressive aphasia",
      "Contralateral motor weakness",
      "Executive dysfunction in dementias",
    ],
    topicHints: ["Neuropsychology Overview", "Language Processing & Aphasia"],
  },
  {
    id: "parietal",
    name: "Parietal Lobe",
    shortName: "Parietal",
    icon: Hand,
    color: "#BDE5FF",
    position: [0, 0.85, -0.4],
    scale: [1.55, 1.0, 1.25],
    displacement: 0.16,
    segments: 5,
    summary:
      "Integrates sensory information — touch, proprioception, spatial awareness, and number processing.",
    keyFunctions: [
      "Somatosensory processing (postcentral gyrus)",
      "Spatial awareness & navigation",
      "Numerical & arithmetic processing",
      "Body schema integration",
      "Attention to contralateral space",
    ],
    clinical: [
      "Hemispatial neglect (often right parietal)",
      "Apraxia",
      "Agnosia (failure to recognize objects)",
      "Gerstmann syndrome",
    ],
    topicHints: ["Apraxia & Agnosia", "Sensory Pathways"],
  },
  {
    id: "temporal-l",
    name: "Left Temporal Lobe",
    shortName: "Temporal (L)",
    icon: MessageSquare,
    color: "#2FA0C6",
    position: [-1.25, 0.0, 0.15],
    scale: [0.9, 0.85, 1.4],
    rotation: [0, 0, -0.15],
    displacement: 0.14,
    segments: 5,
    summary:
      "Auditory processing and — in most people — receptive language. Hippocampus sits medially for episodic memory.",
    keyFunctions: [
      "Receptive language (Wernicke's area)",
      "Auditory processing",
      "Verbal memory encoding",
      "Hippocampal episodic memory",
    ],
    clinical: [
      "Receptive aphasia",
      "Anterograde amnesia after bilateral hippocampal injury",
      "Temporal-lobe seizures",
      "Verbal memory deficits",
    ],
    topicHints: ["Language Processing & Aphasia", "Limbic System & Motivation"],
  },
  {
    id: "temporal-r",
    name: "Right Temporal Lobe",
    shortName: "Temporal (R)",
    icon: Headphones,
    color: "#2FA0C6",
    position: [1.25, 0.0, 0.15],
    scale: [0.9, 0.85, 1.4],
    rotation: [0, 0, 0.15],
    displacement: 0.14,
    segments: 5,
    summary:
      "Non-verbal auditory and visual recognition — faces, prosody, music, and visual memory.",
    keyFunctions: [
      "Face recognition (fusiform area)",
      "Prosody & music processing",
      "Non-verbal memory",
      "Visual scene recognition",
    ],
    clinical: [
      "Prosopagnosia",
      "Loss of musical perception (amusia)",
      "Visual memory deficits",
    ],
    topicHints: ["Sensory Pathways", "Limbic System & Motivation"],
  },
  {
    id: "occipital",
    name: "Occipital Lobe",
    shortName: "Occipital",
    icon: Eye,
    color: "#58C9F3",
    position: [0, 0.55, -1.4],
    scale: [1.2, 1.0, 0.85],
    displacement: 0.13,
    segments: 5,
    summary:
      "Primary visual cortex and visual association areas. All conscious vision routes through here.",
    keyFunctions: [
      "Primary visual processing (V1)",
      "Visual feature detection (motion, color, form)",
      "Visual association & object recognition",
    ],
    clinical: [
      "Cortical blindness",
      "Visual field cuts (homonymous hemianopia)",
      "Visual agnosia",
      "Anton syndrome",
    ],
    topicHints: ["Sensory Pathways", "Vascular System of the Brain"],
  },
  {
    id: "cerebellum",
    name: "Cerebellum",
    shortName: "Cerebellum",
    icon: RotateCcw,
    color: "#1C4E75",
    position: [0, -0.65, -1.0],
    scale: [1.35, 0.7, 0.9],
    displacement: 0.06,
    segments: 6,
    summary:
      "Coordinates voluntary movement, balance, posture, and contributes to motor learning and cognition.",
    keyFunctions: [
      "Motor coordination & timing",
      "Balance & postural control",
      "Motor learning",
      "Cognitive & affective regulation",
    ],
    clinical: [
      "Ataxia (gait, limb)",
      "Dysmetria & intention tremor",
      "Cerebellar cognitive-affective syndrome",
      "Nystagmus",
    ],
    topicHints: ["Neuropsychology Overview", "Sensory Pathways"],
  },
  {
    id: "brainstem",
    name: "Brain Stem",
    shortName: "Brain Stem",
    icon: AlertCircle,
    color: "#BDE5FF",
    position: [0, -1.35, -0.15],
    scale: [0.45, 0.95, 0.45],
    displacement: 0.05,
    segments: 4,
    summary:
      "Midbrain, pons, and medulla — origin of most cranial nerves and home to vital autonomic centers.",
    keyFunctions: [
      "Cardiorespiratory regulation",
      "Sleep–wake cycle (reticular activating system)",
      "Most cranial nerve nuclei",
      "Conduit for ascending & descending tracts",
    ],
    clinical: [
      "Locked-in syndrome",
      "Cranial nerve palsies",
      "Coma & disorders of consciousness",
      "Crossed motor/sensory deficits",
    ],
    topicHints: ["Cranial Nerves", "Sleep & Circadian Rhythms"],
  },
  {
    id: "limbic",
    name: "Limbic System",
    shortName: "Limbic",
    icon: Sparkles,
    color: "#58C9F3",
    position: [0, -0.05, -0.05],
    scale: [0.7, 0.55, 0.95],
    displacement: 0.08,
    segments: 5,
    summary:
      "Deep structures — hippocampus, amygdala, hypothalamus, cingulate — driving emotion, memory, and motivation.",
    keyFunctions: [
      "Episodic memory encoding (hippocampus)",
      "Emotional salience (amygdala)",
      "Homeostasis & drive (hypothalamus)",
      "Reward & motivation (nucleus accumbens)",
    ],
    clinical: [
      "Anterograde amnesia",
      "Anxiety & fear-conditioning disorders",
      "Mood dysregulation",
      "Addiction circuitry",
    ],
    topicHints: ["Limbic System & Motivation", "Neurotransmitters & Synaptic Transmission"],
  },
];

function noise(x: number, y: number, z: number, seed = 0) {
  const a = Math.sin(x * 1.7 + y * 2.3 + z * 0.9 + seed);
  const b = Math.sin(y * 3.1 - z * 1.7 + seed * 1.3);
  const c = Math.sin(z * 2.4 + x * 1.1 + seed * 2.1);
  const d = Math.sin((x + y) * 4.2 - z * 0.7 + seed * 0.5);
  return (a + b + c + d) / 4;
}

function useDisplacedGeometry(
  segments: number,
  displacement: number,
  seed: number,
  scale: [number, number, number],
) {
  return useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1, segments);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = noise(v.x * 2, v.y * 2, v.z * 2, seed);
      const offset = 1 + n * displacement;
      v.multiplyScalar(offset);
      v.x *= scale[0];
      v.y *= scale[1];
      v.z *= scale[2];
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, displacement, seed, scale[0], scale[1], scale[2]]);
}

interface BrainRegionProps {
  region: RegionInfo;
  selectedId: RegionId | null;
  hoveredId: RegionId | null;
  onSelect: (id: RegionId) => void;
  onHover: (id: RegionId | null) => void;
  index: number;
  lite: boolean;
}

function BrainRegion({
  region,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  index,
  lite,
}: BrainRegionProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial>(null);
  const segments = lite ? Math.max(2, region.segments - 2) : region.segments;
  const geometry = useDisplacedGeometry(
    segments,
    region.displacement,
    index * 7.31,
    region.scale,
  );

  const isSelected = selectedId === region.id;
  const isHovered = hoveredId === region.id;
  const anySelected = selectedId !== null;
  const dimmed = anySelected && !isSelected;

  useFrame((_, dt) => {
    if (!matRef.current) return;
    const target = isSelected ? 0.85 : isHovered ? 0.55 : dimmed ? 0.25 : 0.7;
    matRef.current.opacity += (target - matRef.current.opacity) * Math.min(1, dt * 6);
    const emissiveTarget = isSelected ? 0.6 : isHovered ? 0.3 : 0.05;
    matRef.current.emissiveIntensity +=
      (emissiveTarget - matRef.current.emissiveIntensity) * Math.min(1, dt * 6);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={region.position}
      rotation={region.rotation ?? [0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(region.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(region.id);
      }}
      castShadow
      receiveShadow
    >
      {lite ? (
        <meshStandardMaterial
          ref={matRef as React.RefObject<THREE.MeshStandardMaterial>}
          color={region.color}
          emissive={region.color}
          emissiveIntensity={0.05}
          roughness={0.55}
          metalness={0.05}
          transparent
          opacity={0.75}
        />
      ) : (
        <meshPhysicalMaterial
          ref={matRef as React.RefObject<THREE.MeshPhysicalMaterial>}
          color={region.color}
          emissive={region.color}
          emissiveIntensity={0.05}
          roughness={0.45}
          metalness={0.1}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
          transmission={0.15}
          thickness={1}
          transparent
          opacity={0.7}
        />
      )}
    </mesh>
  );
}

function GentleSpin({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current || !enabled) return;
    ref.current.rotation.y += dt * 0.12;
  });
  return <group ref={ref}>{children}</group>;
}

function BrainScene({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  autoSpin,
  lite,
}: {
  selectedId: RegionId | null;
  hoveredId: RegionId | null;
  onSelect: (id: RegionId) => void;
  onHover: (id: RegionId | null) => void;
  autoSpin: boolean;
  lite: boolean;
}) {
  return (
    <>
      <color attach="background" args={[PALETTE.bg]} />
      <fog attach="fog" args={[PALETTE.bg, 6, 14]} />
      <ambientLight intensity={lite ? 0.7 : 0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color={PALETTE.mist} />
      <directionalLight position={[-5, 3, -2]} intensity={0.5} color={PALETTE.surf} />
      <pointLight position={[0, -3, 4]} intensity={0.6} color={PALETTE.teal} />
      {!lite && (
        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>
      )}
      <GentleSpin enabled={autoSpin && selectedId === null}>
        <group rotation={[0, -0.3, 0]} position={[0, 0.1, 0]}>
          {REGIONS.map((r, i) => (
            <BrainRegion
              key={r.id}
              region={r}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={onSelect}
              onHover={onHover}
              index={i}
              lite={lite}
            />
          ))}
        </group>
      </GentleSpin>
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3.5}
        maxDistance={9}
        autoRotate={false}
        rotateSpeed={0.7}
        zoomSpeed={0.6}
      />
    </>
  );
}

function RegionPill({
  region,
  active,
  onClick,
}: {
  region: RegionInfo;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = region.icon;
  return (
    <button
      onClick={onClick}
      data-testid={`region-pill-${region.id}`}
      aria-pressed={active}
      aria-label={`Open ${region.name} details`}
      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cyan-300"
      style={
        active
          ? {
              background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
              borderColor: PALETTE.surf,
              color: PALETTE.bg,
              boxShadow: `0 8px 24px -10px ${PALETTE.teal}`,
            }
          : {
              background: `${PALETTE.surface}cc`,
              borderColor: `${PALETTE.steel}99`,
              color: PALETTE.mist,
            }
      }
    >
      <Icon className="w-3.5 h-3.5" />
      {region.shortName}
    </button>
  );
}

function RegionDetail({
  region,
  onClose,
}: {
  region: RegionInfo;
  onClose: () => void;
}) {
  const Icon = region.icon;
  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col h-full"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.surfaceElev}, ${PALETTE.surface})`,
        borderColor: `${PALETTE.surf}55`,
        boxShadow: `0 30px 80px -30px ${PALETTE.teal}aa`,
      }}
      data-testid="region-detail"
    >
      <div
        className="px-5 py-4 flex items-start justify-between gap-3 border-b"
        style={{ borderColor: `${PALETTE.steel}66` }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${region.color}, ${PALETTE.surf})`,
              color: PALETTE.bg,
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{region.name}</h3>
            <p className="text-xs" style={{ color: `${PALETTE.mist}99` }}>
              Anatomical region
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close region detail"
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: PALETTE.mist }}
          data-testid="button-close-detail"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 py-4 overflow-y-auto flex-1 space-y-5">
        <p className="text-sm leading-relaxed" style={{ color: PALETTE.mist }}>
          {region.summary}
        </p>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: PALETTE.surf }}>
            Key functions
          </h4>
          <ul className="space-y-1.5">
            {region.keyFunctions.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm" style={{ color: `${PALETTE.mist}dd` }}>
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: PALETTE.surf }}
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: PALETTE.surf }}>
            Common clinical findings
          </h4>
          <ul className="space-y-1.5">
            {region.clinical.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm" style={{ color: `${PALETTE.mist}dd` }}>
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: PALETTE.mist }}
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: PALETTE.surf }}>
            Related study topics
          </h4>
          <div className="flex flex-wrap gap-2">
            {region.topicHints.map((t) => (
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
      </div>

      <div className="px-5 py-4 border-t" style={{ borderColor: `${PALETTE.steel}66` }}>
        <Link href="/topics">
          <a
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl h-11 font-semibold transition-all"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
              color: PALETTE.bg,
              boxShadow: `0 10px 30px -10px ${PALETTE.teal}cc`,
            }}
            data-testid="button-explore-topics"
          >
            Explore matching topics <ArrowRight className="w-4 h-4" />
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
        <Brain className="w-7 h-7" style={{ color: PALETTE.surf }} />
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">
        Click any region of the brain
      </h3>
      <p className="text-sm leading-relaxed max-w-xs" style={{ color: `${PALETTE.mist}99` }}>
        Drag to rotate. Scroll to zoom. Each region opens its functions, clinical findings,
        and matching study topics.
      </p>
    </div>
  );
}

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function WebGLFallback() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
      style={{ background: PALETTE.bg, color: PALETTE.mist }}
      data-testid="webgl-fallback"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${PALETTE.teal}33, ${PALETTE.surf}22)`,
          border: `1px solid ${PALETTE.surf}44`,
        }}
      >
        <Brain className="w-7 h-7" style={{ color: PALETTE.surf }} />
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">
        3D view not available
      </h3>
      <p className="text-sm leading-relaxed max-w-sm mb-4" style={{ color: `${PALETTE.mist}99` }}>
        Your browser or device doesn't support WebGL. You can still browse every region
        using the buttons above — each one opens the same study panel.
      </p>
    </div>
  );
}

export default function BrainLabPage() {
  const [selectedId, setSelectedId] = useState<RegionId | null>(null);
  const [hoveredId, setHoveredId] = useState<RegionId | null>(null);
  const [autoSpin, setAutoSpin] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) setAutoSpin(false);
    const mqMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    setIsMobile(mqMobile.matches);
    setWebglOk(detectWebGL());
  }, []);

  const selected = useMemo(
    () => REGIONS.find((r) => r.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <div
      className="h-full overflow-hidden"
      style={{ background: PALETTE.bg, color: PALETTE.mist }}
      data-testid="brain-lab-page"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 md:px-8 pt-6 pb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-2 text-[11px] font-medium border"
              style={{
                background: `${PALETTE.steel}55`,
                borderColor: `${PALETTE.surf}55`,
                color: PALETTE.mist,
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: PALETTE.surf }} />
              Interactive 3D
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Brain Lab
            </h1>
            <p className="text-sm mt-1" style={{ color: `${PALETTE.mist}99` }}>
              Rotate, zoom, and click any region to study its functions and clinical correlates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoSpin((s) => !s)}
              disabled={reduceMotion}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40"
              style={{
                background: `${PALETTE.surface}cc`,
                borderColor: `${PALETTE.steel}99`,
                color: PALETTE.mist,
              }}
              data-testid="button-toggle-spin"
            >
              {autoSpin ? "Pause spin" : "Auto-spin"}
            </button>
            <button
              onClick={() => setSelectedId(null)}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{
                background: `${PALETTE.surface}cc`,
                borderColor: `${PALETTE.steel}99`,
                color: PALETTE.mist,
              }}
              data-testid="button-reset-view"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Region quick-pills */}
        <div
          className="px-4 md:px-8 pb-4 flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {REGIONS.map((r) => (
            <RegionPill
              key={r.id}
              region={r}
              active={selectedId === r.id}
              onClick={() => setSelectedId(r.id)}
            />
          ))}
        </div>

        {/* Main split */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 px-4 md:px-8 pb-4">
          {/* Canvas */}
          <div
            className="relative rounded-2xl overflow-hidden border"
            style={{
              borderColor: `${PALETTE.steel}99`,
              minHeight: 360,
            }}
            role="region"
            aria-label="Interactive 3D brain. Use the region buttons above for keyboard navigation."
          >
            {webglOk ? (
              <Canvas
                dpr={isMobile ? [1, 1.5] : [1, 2]}
                camera={{ position: [0, 0.4, 6], fov: 42 }}
                gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
                data-testid="brain-canvas"
              >
                <Suspense fallback={null}>
                  <BrainScene
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onSelect={setSelectedId}
                    onHover={setHoveredId}
                    autoSpin={autoSpin && !reduceMotion}
                    lite={isMobile}
                  />
                </Suspense>
              </Canvas>
            ) : (
              <WebGLFallback />
            )}

            {/* Hover label */}
            {hoveredId && hoveredId !== selectedId && (
              <div
                className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-md pointer-events-none"
                style={{
                  background: `${PALETTE.bg}cc`,
                  borderColor: `${PALETTE.surf}55`,
                  color: PALETTE.mist,
                }}
              >
                {REGIONS.find((r) => r.id === hoveredId)?.name}
              </div>
            )}

            {/* Hint */}
            <div
              className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] pointer-events-none"
              style={{ color: `${PALETTE.mist}99` }}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                Drag to rotate · scroll to zoom · click a region
              </span>
              <span className="hidden sm:inline">8 regions</span>
            </div>
          </div>

          {/* Side panel */}
          <div className="min-h-[360px] lg:min-h-0">
            {selected ? (
              <RegionDetail region={selected} onClose={() => setSelectedId(null)} />
            ) : (
              <EmptyDetail />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
