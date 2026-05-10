import { Suspense, useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "wouter";
// GLB imported as a Vite asset so the URL is base-aware in dev + prod.
// Files in /public are served from "/" in Vite dev (not the artifact's
// base path), which previously caused the GLB request to 200-with-HTML
// (SPA fallback) and silently fail to parse.
import brainGlbUrl from "@/assets/models/brain.glb?url";
import {
  Brain,
  ArrowRight,
  X,
  Search,
  Layers,
  Eye,
  ChevronRight,
  BookOpen,
  Sparkles,
  Target,
  RotateCcw,
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

const PALETTE = {
  bg: "#061826",
  surface: "#0c2538",
  surfaceElev: "#11324d",
  steel: "#1C4E75",
  teal: "#2FA0C6",
  surf: "#58C9F3",
  mist: "#BDE5FF",
};

// "exploded" was removed — pulling structures apart broke anatomical
// readability and made the brain look insane. We keep rotation (via
// OrbitControls) and the cutaway view, and rely on per-region hover
// glow for exploration instead of dismantling the geometry.
type ViewMode = "external" | "cutaway";

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

// ──────────────────────────── procedural geometry ────────────────────────────

function noise(x: number, y: number, z: number, seed = 0) {
  const a = Math.sin(x * 1.7 + y * 2.3 + z * 0.9 + seed);
  const b = Math.sin(y * 3.1 - z * 1.7 + seed * 1.3);
  const c = Math.sin(z * 2.4 + x * 1.1 + seed * 2.1);
  const d = Math.sin((x + y) * 4.2 - z * 0.7 + seed * 0.5);
  const e = Math.sin(x * 8.0 + y * 6.0 + seed * 3.7) * 0.4;
  const f = Math.sin(y * 9.0 - z * 7.0 + seed * 4.3) * 0.4;
  return (a + b + c + d + e + f) / 5.6;
}

function useStructureGeometry(
  struct: BrainStructure,
  lite: boolean,
  seed: number,
): THREE.BufferGeometry {
  return useMemo(() => {
    const segments = lite ? Math.max(2, struct.segments - 2) : struct.segments;
    let geom: THREE.BufferGeometry;

    switch (struct.shape) {
      case "arch":
        geom = new THREE.TorusGeometry(0.9, 0.18, 8, Math.max(20, segments * 6), Math.PI);
        geom.rotateY(Math.PI / 2);
        break;
      case "crescent":
        geom = new THREE.TorusGeometry(
          0.85,
          0.32,
          6,
          Math.max(18, segments * 5),
          Math.PI * 0.65,
        );
        geom.rotateZ(Math.PI / 2);
        break;
      case "tube":
        geom = new THREE.CylinderGeometry(0.5, 0.5, 1.6, Math.max(10, segments * 3));
        break;
      case "lobe":
      case "ellipsoid":
      default:
        geom = new THREE.IcosahedronGeometry(1, segments);
    }

    // Displace + scale
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = noise(v.x * 2, v.y * 2, v.z * 2, seed);
      const offset = 1 + n * struct.displacement;
      v.multiplyScalar(offset);
      v.x *= struct.scale[0];
      v.y *= struct.scale[1];
      v.z *= struct.scale[2];
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }, [struct.shape, struct.segments, struct.displacement, struct.scale, lite, seed]);
}

// ──────────────────────────── 3D mesh ────────────────────────────

interface MeshProps {
  struct: BrainStructure;
  mirror: boolean;
  seed: number;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  viewMode: ViewMode;
  lite: boolean;
}

function StructureMesh({
  struct,
  mirror,
  seed,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  viewMode,
  lite,
}: MeshProps) {
  const matRef = useRef<THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial>(null);
  const geometry = useStructureGeometry(struct, lite, seed);

  const isSelected = selectedId === struct.id;
  const isHovered = hoveredId === struct.id;
  const anySelected = selectedId !== null;

  // Cursor cleanup safety — if mesh unmounts while hovered, reset cursor
  useEffect(() => {
    return () => {
      if (isHovered) document.body.style.cursor = "";
    };
  }, [isHovered]);

  // Visibility logic by view mode + layer.
  // External view: cortex + brainstem + cerebellum visible (anatomy you'd see
  // looking at a real brain from outside). Subcortical/deep/ventricles hidden.
  const isCortex = struct.layer === "cortex";
  const isVentricle = struct.layer === "ventricle";

  let baseOpacity = 0.7;
  let visible = true;

  // The GLB brain shell is the visual cortex/brainstem/cerebellum.
  // We hide procedural blobs for those structures except when selected
  // (then they re-appear as a glowing accent overlay on top of the shell).
  const shellCovers =
    isCortex ||
    struct.system === "brainstem" ||
    struct.system === "cerebellum";

  if (viewMode === "external") {
    if (shellCovers) {
      // The GLB shell already shows this region — hide the blob unless picked.
      visible = false;
      baseOpacity = 0.0;
    } else {
      // subcortical/deep/ventricles — hidden behind cortex shell
      visible = false;
    }
  } else {
    // cutaway
    if (shellCovers) {
      // Hide cortex blobs; the shell itself fades to reveal interior.
      visible = false;
    } else if (isVentricle) baseOpacity = 0.35;
    else baseOpacity = 0.92;
  }

  // Always show the selected structure regardless of view mode
  if (isSelected) {
    visible = true;
    baseOpacity = 0.95;
  }

  const dimmed = anySelected && !isSelected;

  // Position: mirror flips across X
  const pos: [number, number, number] = mirror
    ? [-struct.position[0], struct.position[1], struct.position[2]]
    : struct.position;

  const rot: [number, number, number] = struct.rotation
    ? mirror
      ? [struct.rotation[0], -struct.rotation[1], -struct.rotation[2]]
      : struct.rotation
    : [0, 0, 0];

  useFrame((_, dt) => {
    if (!matRef.current) return;
    const target = isSelected
      ? 0.95
      : isHovered
        ? Math.min(0.85, baseOpacity + 0.2)
        : dimmed
          ? baseOpacity * 0.4
          : baseOpacity;
    matRef.current.opacity += (target - matRef.current.opacity) * Math.min(1, dt * 6);
    const emissiveTarget = isSelected ? 0.7 : isHovered ? 0.35 : 0.05;
    matRef.current.emissiveIntensity +=
      (emissiveTarget - matRef.current.emissiveIntensity) * Math.min(1, dt * 6);
  });

  if (!visible) return null;

  return (
    <mesh
      geometry={geometry}
      position={pos}
      rotation={rot}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(struct.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(struct.id);
      }}
      castShadow
      receiveShadow
    >
      {lite ? (
        <meshStandardMaterial
          ref={matRef as React.RefObject<THREE.MeshStandardMaterial>}
          color={struct.color}
          emissive={struct.color}
          emissiveIntensity={0.05}
          roughness={0.55}
          metalness={0.05}
          transparent
          opacity={baseOpacity}
          depthWrite={baseOpacity > 0.5}
        />
      ) : (
        <meshPhysicalMaterial
          ref={matRef as React.RefObject<THREE.MeshPhysicalMaterial>}
          color={struct.color}
          emissive={struct.color}
          emissiveIntensity={0.05}
          roughness={0.42}
          metalness={0.1}
          clearcoat={0.55}
          clearcoatRoughness={0.3}
          transmission={isVentricle ? 0.4 : 0.1}
          thickness={1}
          transparent
          opacity={baseOpacity}
          depthWrite={baseOpacity > 0.5}
        />
      )}
    </mesh>
  );
}

function StructureGroup(props: Omit<MeshProps, "mirror" | "seed"> & { index: number }) {
  return (
    <>
      <StructureMesh {...props} mirror={false} seed={props.index * 7.31} />
      {props.struct.paired && (
        <StructureMesh {...props} mirror={true} seed={props.index * 7.31 + 100} />
      )}
    </>
  );
}

// ──────────────────────────── brain shell (GLB) ────────────────────────────

const BRAIN_GLB_URL = brainGlbUrl;
useGLTF.preload(BRAIN_GLB_URL);

function BrainShell({
  viewMode,
  selectedId,
  onSelect,
}: {
  viewMode: ViewMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { scene } = useGLTF(BRAIN_GLB_URL);
  const matRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Build a fitted, cerulean-tinted clone once. Box3-based normalization
  // means swapping the GLB later "just works" without manual tuning.
  const fitted = useMemo(() => {
    const obj = scene.clone(true);
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 3.4; // matches the procedural structure extents
    const s = targetSize / maxDim;

    const wrapper = new THREE.Group();
    wrapper.add(obj);
    obj.position.sub(center);
    wrapper.scale.setScalar(s);

    // Wireframe-first "scientific viz" treatment — the surface itself is
    // a dark, near-transparent fill so the white edge tracery (added below)
    // becomes the dominant read. Per-region accents and the hover glow on
    // the procedural structures still pop through this dim shell.
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0A2230"),
      emissive: new THREE.Color("#1A3D52"),
      emissiveIntensity: 0.18,
      roughness: 0.6,
      metalness: 0.05,
      clearcoat: 0.2,
      clearcoatRoughness: 0.5,
      transmission: 0.0,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    matRef.current = mat;

    // White edge overlay — EdgesGeometry only emits lines where neighboring
    // faces meet at a sharp enough angle, so the brain's sulci/gyri appear
    // as crisp white tracery on top of the dim shell. Wrapped in try/catch
    // so a single bad sub-mesh can't crash the whole BrainShell render.
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#FFFFFF"),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    obj.traverse((child) => {
      const m = child as THREE.Mesh;
      if (m.isMesh) {
        m.material = mat;
        m.castShadow = true;
        m.receiveShadow = true;
        try {
          if (m.geometry) {
            const edges = new THREE.EdgesGeometry(m.geometry, 18);
            const lines = new THREE.LineSegments(edges, edgeMat);
            lines.renderOrder = 1;
            m.add(lines);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("BrainShell: edges overlay failed for sub-mesh", err);
        }
      }
    });
    return wrapper;
  }, [scene]);

  // Treat the shell as a single clickable surface that maps clicks to
  // whatever cortical region is closest to the click point in world space.
  const handlePointerDown = useCallback(
    (e: any) => {
      e.stopPropagation();
      const p = e.point as THREE.Vector3;
      // Find the cortex/brainstem/cerebellum structure whose anatomical
      // position is closest to the click point.
      let best: { id: string; d: number } | null = null;
      for (const s of BRAIN_STRUCTURES) {
        if (
          s.layer !== "cortex" &&
          s.system !== "brainstem" &&
          s.system !== "cerebellum"
        )
          continue;
        // Mirror-aware: compare against both sides for paired structures.
        const candidates: [number, number, number][] = s.paired
          ? [s.position, [-s.position[0], s.position[1], s.position[2]]]
          : [s.position];
        for (const c of candidates) {
          const dx = p.x - c[0];
          const dy = p.y - c[1];
          const dz = p.z - c[2];
          const d = dx * dx + dy * dy + dz * dz;
          if (best === null || d < best.d) best = { id: s.id, d };
        }
      }
      if (best) onSelect(best.id);
    },
    [onSelect],
  );

  // Animate the wireframe shell by view mode + selection state.
  // External: dim translucent fill so the white edges read as wireframe.
  // Cutaway: even more transparent so interior structures dominate.
  // Selecting a structure pulls the shell back further so the accent reads.
  useFrame((_, dt) => {
    if (!matRef.current) return;
    const targetOpacity =
      viewMode === "cutaway" ? 0.08 : selectedId ? 0.12 : 0.18;
    matRef.current.opacity +=
      (targetOpacity - matRef.current.opacity) * Math.min(1, dt * 5);
    // Always transparent in wireframe mode — depth-write off so the inner
    // accents are never occluded.
    matRef.current.transparent = true;
    matRef.current.depthWrite = false;
    matRef.current.needsUpdate = true;
    const targetEmissive =
      viewMode === "cutaway" ? 0.1 : selectedId ? 0.14 : 0.18;
    matRef.current.emissiveIntensity +=
      (targetEmissive - matRef.current.emissiveIntensity) * Math.min(1, dt * 5);
    if (groupRef.current) {
      groupRef.current.visible = true;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={fitted}
        onPointerDown={handlePointerDown}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      />
    </group>
  );
}

// ──────────────────────────── scene ────────────────────────────

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
    ref.current.rotation.y += dt * 0.1;
  });
  return <group ref={ref}>{children}</group>;
}

function BrainScene({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  autoSpin,
  viewMode,
  lite,
}: {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  autoSpin: boolean;
  viewMode: ViewMode;
  lite: boolean;
}) {
  return (
    <>
      <color attach="background" args={[PALETTE.bg]} />
      <fog attach="fog" args={[PALETTE.bg, 7, 16]} />
      <ambientLight intensity={lite ? 0.55 : 0.35} />
      <directionalLight position={[4, 6, 5]} intensity={0.85} color={PALETTE.mist} />
      <directionalLight position={[-5, 3, -2]} intensity={0.45} color={PALETTE.surf} />
      {/* Rim light from behind for that scientific-viz halo */}
      <directionalLight position={[0, 1, -6]} intensity={0.9} color={PALETTE.surf} />
      <pointLight position={[0, -3, 4]} intensity={0.55} color={PALETTE.teal} />
      {!lite && (
        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>
      )}
      <GentleSpin enabled={autoSpin && selectedId === null}>
        <group rotation={[0, -0.3, 0]} position={[0, 0.1, 0]}>
          <Suspense fallback={null}>
            <BrainShell
              viewMode={viewMode}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </Suspense>
          {BRAIN_STRUCTURES.map((s, i) => (
            <StructureGroup
              key={s.id}
              struct={s}
              index={i}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={onSelect}
              onHover={onHover}
              viewMode={viewMode}
              lite={lite}
            />
          ))}
        </group>
      </GentleSpin>
      {/* Pan disabled + tighter zoom range so the brain literally cannot
          leave the framed area no matter what the user does. The previous
          maxDistance of 12 let the brain shrink to a tiny dot in the
          middle of a vast empty canvas; 7 keeps it readable at min-zoom. */}
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2.6}
        maxDistance={7}
        autoRotate={false}
        rotateSpeed={0.7}
        zoomSpeed={0.7}
        target={[0, 0, 0]}
      />
    </>
  );
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

// ──────────────────────────── UI: view-mode toggle ────────────────────────────

function ViewModeToggle({
  mode,
  setMode,
}: {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}) {
  const items: { value: ViewMode; label: string; Icon: React.ElementType }[] = [
    { value: "external", label: "External", Icon: Eye },
    { value: "cutaway", label: "Cutaway", Icon: Layers },
  ];
  return (
    <div
      className="inline-flex rounded-xl p-1 border"
      style={{
        background: `${PALETTE.surface}cc`,
        borderColor: `${PALETTE.steel}99`,
      }}
      role="group"
      aria-label="View mode"
    >
      {items.map(({ value, label, Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            onClick={() => setMode(value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            style={{
              background: active
                ? `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`
                : "transparent",
              color: active ? PALETTE.bg : PALETTE.mist,
            }}
            aria-pressed={active}
            data-testid={`view-mode-${value}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      })}
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
  const items: { value: TabGroup | "all"; label: string; Icon: React.ElementType }[] = [
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

// Horizontal chip strip — replaces the old sidebar's vertical structure list.
// Shows the structures inside the active tab group so users can pick by name
// without ever opening the search modal.
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

// Compact S/A/P/I orientation gizmo — bottom-left of the canvas, gives the
// viewer an anatomical compass without occupying real estate.
function OrientationGizmo() {
  return (
    <div
      className="absolute bottom-3 left-3 w-20 h-20 rounded-2xl flex items-center justify-center pointer-events-none"
      style={{
        background: `${PALETTE.surface}aa`,
        border: `1px solid ${PALETTE.steel}99`,
        backdropFilter: "blur(6px)",
      }}
      aria-hidden
      data-testid="orientation-gizmo"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Brain className="w-7 h-7" style={{ color: `${PALETTE.surf}aa` }} />
        <span
          className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold"
          style={{ color: PALETTE.mist }}
        >
          S
        </span>
        <span
          className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold"
          style={{ color: PALETTE.mist }}
        >
          I
        </span>
        <span
          className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-bold"
          style={{ color: PALETTE.mist }}
        >
          A
        </span>
        <span
          className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-bold"
          style={{ color: PALETTE.mist }}
        >
          P
        </span>
      </div>
    </div>
  );
}

// (Legacy `_UnusedSystemFilter` removed — replaced by `TopTabs` + `GroupChips` above.)

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
        <Link href={`/study-lab?seed=${encodeURIComponent(struct.name)}`}>
          <a
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl h-10 text-sm font-semibold transition-all"
            style={{
              background: `linear-gradient(135deg, ${struct.color}, ${PALETTE.surf})`,
              color: PALETTE.bg,
              boxShadow: `0 8px 24px -10px ${struct.color}cc`,
            }}
            data-testid="button-study-this"
          >
            <Sparkles className="w-4 h-4" />
            Study this structure
          </a>
        </Link>
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
        Click any region of the brain, pick a region tab and chip below, or
        search by name or symptom. Each structure opens an overview, its
        primary functions, network connections, and the clinical conditions
        it's tied to.
      </p>
    </div>
  );
}

// ──────────────────────────── helpers ────────────────────────────

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
      <h3 className="text-base font-semibold text-white mb-1.5">3D view not available</h3>
      <p className="text-sm leading-relaxed max-w-sm" style={{ color: `${PALETTE.mist}99` }}>
        Your browser or device doesn't support WebGL. You can still browse every
        structure from the region tabs above and the chip strip below.
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("external");
  const [activeTab, setActiveTab] = useState<TabGroup | "all">("all");
  const [autoSpin, setAutoSpin] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Init from media queries + URL hash
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setAutoSpin(false);
    const mqMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    setIsMobile(mqMobile.matches);
    setWebglOk(detectWebGL());

    const initial = readFocusFromHash();
    if (initial) {
      setSelectedId(initial);
      const struct = STRUCTURE_INDEX[initial];
      if (struct && struct.layer !== "cortex") setViewMode("cutaway");
    }

    const onHash = () => {
      const f = readFocusFromHash();
      setSelectedId(f);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Selection handler — auto-switches view mode, syncs the active region
  // tab so the chip strip highlights the picked structure, and writes the
  // hash so the URL remains shareable.
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setSearchOpen(false);
    writeFocusToHash(id);
    setShowMobileDetail(true);
    const struct = STRUCTURE_INDEX[id];
    if (struct) {
      setActiveTab(tabForSystem(struct.system));
      if (struct.layer !== "cortex" && struct.layer !== "ventricle") {
        setViewMode((m) => (m === "external" ? "cutaway" : m));
      }
    }
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
          {!isMobile && <ViewModeToggle mode={viewMode} setMode={setViewMode} />}
          {selectedId && (
            <button
              onClick={handleClose}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5"
              style={{
                background: `${PALETTE.surface}cc`,
                borderColor: `${PALETTE.steel}99`,
                color: PALETTE.mist,
              }}
              data-testid="button-reset-focus"
              title="Clear selection"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs row — 5 region groups, replaces the old sidebar */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-2 flex items-center justify-center border-b"
        style={{
          borderColor: `${PALETTE.steel}66`,
          background: `linear-gradient(180deg, ${PALETTE.surface}66, transparent)`,
        }}
      >
        <TopTabs
          active={activeTab}
          setActive={(t) => {
            setActiveTab(t);
            // Subcortical / limbic / brainstem / white-matter live inside the
            // shell — switch to cutaway so they're visible without the user
            // having to discover the view mode toggle.
            if (t !== "all" && t !== "cortex" && viewMode === "external") {
              setViewMode("cutaway");
            }
          }}
        />
      </div>

      {/* Body — 2-pane: 3D canvas / detail.
          `min-w-0 overflow-hidden w-full` belt-and-suspenders so neither the
          grid container itself nor any descendant can exceed the viewport
          width and trigger a horizontal page scroll. */}
      <div
        className="flex-1 min-h-0 min-w-0 w-full overflow-hidden grid gap-3 p-3 md:p-4"
        style={{
          gridTemplateColumns: isMobile ? "1fr" : "1fr minmax(340px, 420px)",
        }}
      >
        {/* Center: 3D canvas + chip strip below.
            CRITICAL: `min-w-0` on this grid track. Without it, the
            horizontally-scrolling chip strip below would force the `1fr`
            grid column to expand past its allotted width, which pushed
            the entire canvas (and brain mesh) off to the right and clipped
            the chip strip's left edge. */}
        <div className="flex flex-col gap-3 min-h-0 min-w-0">
        <div
          className="relative rounded-2xl border overflow-hidden flex-1 min-h-0"
          style={{
            background: PALETTE.bg,
            borderColor: `${PALETTE.steel}99`,
            boxShadow: `0 20px 60px -30px ${PALETTE.teal}aa`,
          }}
          data-testid="brain-canvas-wrap"
        >
          {webglOk ? (
            <Canvas
              camera={{ position: [0, 0.5, 6], fov: 45 }}
              dpr={[1, isMobile ? 1.5 : 2]}
              shadows={!isMobile}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <BrainScene
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={handleSelect}
                onHover={setHoveredId}
                autoSpin={autoSpin}
                viewMode={viewMode}
                lite={isMobile}
              />
            </Canvas>
          ) : (
            <WebGLFallback />
          )}

          {/* Mobile view-mode toggle (overlay) */}
          {isMobile && webglOk && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <ViewModeToggle mode={viewMode} setMode={setViewMode} />
            </div>
          )}

          {/* Anatomical orientation compass */}
          {webglOk && !isMobile && <OrientationGizmo />}

          {/* Hover hint */}
          {hoveredId && !selectedId && (
            <div
              className="absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-medium pointer-events-none"
              style={{
                background: `${PALETTE.surfaceElev}ee`,
                color: PALETTE.mist,
                border: `1px solid ${STRUCTURE_INDEX[hoveredId]?.color}66`,
                boxShadow: `0 8px 24px -10px ${STRUCTURE_INDEX[hoveredId]?.color}aa`,
              }}
            >
              {STRUCTURE_INDEX[hoveredId]?.name}
            </div>
          )}

          {/* Search overlay */}
          {searchOpen && (
            <StructureSearch onSelect={handleSelect} onClose={() => setSearchOpen(false)} />
          )}

          {/* Model attribution (CC-BY-4.0 requires visible credit) */}
          {webglOk && (
            <div
              className="absolute bottom-2 right-3 text-[10px] pointer-events-auto"
              style={{ color: `${PALETTE.mist}55` }}
              data-testid="brain-model-attribution"
            >
              Brain model:{" "}
              <a
                href="https://sketchfab.com/3d-models/brain-cadd2bde67404c43b2359a6a3281d84a"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                "Brain"
              </a>{" "}
              by{" "}
              <a
                href="https://sketchfab.com/dgallichan"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                dgallichan
              </a>{" "}
              ·{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                CC BY 4.0
              </a>
            </div>
          )}
        </div>

          {/* Group chip strip — quick pick within the active tab.
              `min-w-0 overflow-hidden` here keeps the inner overflow-x-auto
              scroll container from inflating the parent column width. */}
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
