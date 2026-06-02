import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";
import type { BrainStructure } from "../../data/brain-structures";
import brainGlbUrl from "@/assets/models/brain.glb?url";

// =============================================================================
// Brain3DView — an interactive, rotatable/zoomable WHITE 3D brain.
//
// The brain.glb shell is normalized (Box3-fit) and re-skinned with a clean
// near-white physical material so it reads like a real anatomical model
// rather than the source's pink tissue. Clickable markers sit at each
// structure's anatomical position; clicking one opens the shared
// StructureDetail panel via `onSelect`. Markers and the brain live in the
// SAME transform group so the dots always track the right region no matter
// how the user rotates or zooms.
//
// To make the dots read as *pinned to the surface* instead of floating in
// front, each marker fades every frame based on whether it currently faces
// the camera: front-facing dots stay bright and clickable, dots that rotate
// to the far side recede to faint + click-through, and deep central
// structures (which have no real front/back face) stay readable. Selecting a
// marker dims the rest so the chosen region stands out.
// =============================================================================

const BRAIN_GLB_URL = brainGlbUrl;
useGLTF.preload(BRAIN_GLB_URL);

// Anatomical-space extent the structure positions were authored against.
// The GLB is scaled to match so marker coords line up with the mesh.
const TARGET_SIZE = 3.4;

function FittedBrain() {
  const { scene } = useGLTF(BRAIN_GLB_URL);

  const fitted = useMemo(() => {
    const obj = scene.clone(true);
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = TARGET_SIZE / maxDim;

    // Clean near-white skin with a faint cool cast so it sits in the
    // cerulean scene without going grey or pink.
    const skin = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#EAF3F6"),
      roughness: 0.55,
      metalness: 0.04,
      clearcoat: 0.5,
      clearcoatRoughness: 0.35,
      sheen: 0.4,
      sheenColor: new THREE.Color("#CFE9F2"),
    });

    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = skin;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    const wrapper = new THREE.Group();
    wrapper.add(obj);
    obj.position.sub(center);
    wrapper.scale.setScalar(s);
    return wrapper;
  }, [scene]);

  return <primitive object={fitted} />;
}

function Marker({
  struct,
  selected,
  anySelected,
  onSelect,
}: {
  struct: BrainStructure;
  selected: boolean;
  anySelected: boolean;
  onSelect: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;
  const pos = struct.position;

  // Pre-allocated scratch vectors so the per-frame facing math allocates
  // nothing — this runs for every marker on every frame.
  const tmp = useMemo(
    () => ({
      cam: new THREE.Vector3(),
      p: new THREE.Vector3(),
      n: new THREE.Vector3(),
      toCam: new THREE.Vector3(),
    }),
    [],
  );

  // Fade markers that have rotated to the far side so the dots read as pinned
  // to the surface. Styles are mutated directly (not via React state) to avoid
  // a re-render storm at 60fps.
  useFrame((state) => {
    const g = groupRef.current;
    const btn = btnRef.current;
    const dot = dotRef.current;
    if (!g || !btn || !g.parent) return;

    // A hovered/selected marker is always fully lit and interactive.
    if (active) {
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
      if (dot) dot.style.transform = "scale(1.3)";
      return;
    }

    const p = tmp.p.set(pos[0], pos[1], pos[2]);
    const depth = p.length();

    let facing: number;
    if (depth < 0.4) {
      // Deep/central structure — no meaningful front/back face; keep readable.
      facing = 0.45;
    } else {
      // Camera in the brain group's local space, then compare the marker's
      // outward normal (its direction from the brain center) with the
      // direction to the camera. > 0 means it faces the viewer.
      const camLocal = tmp.cam.copy(state.camera.position);
      g.parent.worldToLocal(camLocal);
      const n = tmp.n.copy(p).normalize();
      const toCam = tmp.toCam.copy(camLocal).sub(p).normalize();
      facing = n.dot(toCam);
    }

    const t = THREE.MathUtils.clamp((facing + 0.25) / 1.25, 0, 1);
    let opacity = 0.1 + 0.9 * t;
    if (anySelected) opacity *= 0.45; // spotlight the selected region
    btn.style.opacity = opacity.toFixed(3);
    btn.style.pointerEvents = facing > 0 ? "auto" : "none";
    if (dot) dot.style.transform = `scale(${(0.65 + 0.35 * t).toFixed(3)})`;
  });

  return (
    <group position={pos} ref={groupRef}>
      <Html center distanceFactor={8} zIndexRange={[40, 0]}>
        <button
          ref={btnRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(struct.id);
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          aria-label={struct.name}
          style={{
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            willChange: "opacity",
          }}
          data-testid={`brain3d-marker-${struct.id}`}
        >
          <span
            ref={dotRef}
            style={{
              width: 13,
              height: 13,
              borderRadius: "9999px",
              background: struct.color,
              border: `2px solid ${PALETTE.cloud}`,
              boxShadow: active
                ? `0 0 0 4px ${struct.color}55, 0 0 16px ${struct.color}`
                : `0 0 8px ${struct.color}aa`,
              transition: "background 160ms ease, box-shadow 160ms ease",
              flexShrink: 0,
            }}
          />
          {active && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: PALETTE.cloud,
                background: `${PALETTE.bg}d9`,
                border: `1px solid ${PALETTE.steel}`,
                borderRadius: 9999,
                padding: "2px 8px",
                backdropFilter: "blur(6px)",
              }}
            >
              {struct.shortName || struct.name}
            </span>
          )}
        </button>
      </Html>
    </group>
  );
}

function Spin({ children, enabled }: { children: React.ReactNode; enabled: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && enabled) ref.current.rotation.y += dt * 0.12;
  });
  return <group ref={ref}>{children}</group>;
}

function Scene({
  structures,
  selectedId,
  onSelect,
  onInteract,
  autoSpin,
}: {
  structures: BrainStructure[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onInteract: () => void;
  autoSpin: boolean;
}) {
  return (
    <>
      <color attach="background" args={[PALETTE.bg]} />
      <fog attach="fog" args={[PALETTE.bg, 8, 18]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={0.9} color={PALETTE.cloud} />
      <directionalLight position={[-5, 3, -2]} intensity={0.5} color={PALETTE.surf} />
      <directionalLight position={[0, 1, -6]} intensity={0.85} color={PALETTE.surf} />
      <pointLight position={[0, -3, 4]} intensity={0.5} color={PALETTE.teal} />

      <Spin enabled={autoSpin && selectedId === null}>
        <group rotation={[0, -0.3, 0]} position={[0, 0.1, 0]}>
          <Suspense fallback={null}>
            <FittedBrain />
          </Suspense>
          {structures.map((s) => (
            <Marker
              key={s.id}
              struct={s}
              selected={selectedId === s.id}
              anySelected={selectedId !== null}
              onSelect={onSelect}
            />
          ))}
        </group>
      </Spin>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2.8}
        maxDistance={8}
        rotateSpeed={0.7}
        zoomSpeed={0.7}
        target={[0, 0, 0]}
        onStart={onInteract}
      />
    </>
  );
}

function hasWebGL(): boolean {
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

export default function Brain3DView({
  structures,
  selectedId,
  onSelect,
  isMobile = false,
}: {
  structures: BrainStructure[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isMobile?: boolean;
}) {
  // Detect WebGL lazily on first render (before <Canvas> mounts) so an
  // unsupported device shows the fallback instead of crashing the canvas.
  const [webglOk] = useState(() =>
    typeof window === "undefined" ? true : hasWebGL(),
  );
  const [userInteracted, setUserInteracted] = useState(false);

  if (!webglOk) {
    return (
      <div
        className="h-full w-full flex flex-col items-center justify-center text-center gap-3 px-6"
        data-testid="brain3d-webgl-fallback"
      >
        <p className="text-sm font-semibold text-white">3D view unavailable</p>
        <p className="text-xs max-w-xs" style={{ color: `${PALETTE.mist}99` }}>
          Your browser or device doesn't support WebGL. Switch to the Sections
          view to keep exploring the brain.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full"
      data-testid="brain-3d-view"
      onPointerDown={() => setUserInteracted(true)}
    >
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene
          structures={structures}
          selectedId={selectedId}
          onSelect={onSelect}
          onInteract={() => setUserInteracted(true)}
          autoSpin={!userInteracted}
        />
      </Canvas>

      {/* Hint overlay */}
      <div
        className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 px-4 pointer-events-none"
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: `${PALETTE.surface}cc`, color: PALETTE.surf }}
        >
          3D Brain
        </span>
        <span className="text-[11px]" style={{ color: `${PALETTE.mist}88` }}>
          Drag to rotate · scroll to zoom · tap a marker
        </span>
      </div>
    </div>
  );
}
