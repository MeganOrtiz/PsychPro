import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";
import type { BrainStructure } from "../../data/brain-structures";
import brainGlbUrl from "@/assets/models/brain.glb?url";

// =============================================================================
// Brain3DView — an interactive, rotatable/zoomable WHITE 3D brain.
//
// The brain.glb shell is normalized (Box3-fit) and re-skinned with a clean
// near-white physical material so it reads like a real anatomical model
// rather than the source's pink tissue. Floating clickable markers sit at
// each structure's anatomical position; clicking one opens the shared
// StructureDetail panel via `onSelect`. Markers and the brain live in the
// SAME transform group so the dots always track the right region no matter
// how the user rotates or zooms.
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
  onSelect,
}: {
  struct: BrainStructure;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;
  const pos = struct.position;

  return (
    <group position={pos}>
      <Html center distanceFactor={8} zIndexRange={[20, 0]}>
        <button
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
          }}
          data-testid={`brain3d-marker-${struct.id}`}
        >
          <span
            style={{
              width: active ? 16 : 12,
              height: active ? 16 : 12,
              borderRadius: "9999px",
              background: struct.color,
              border: `2px solid ${PALETTE.cloud}`,
              boxShadow: active
                ? `0 0 0 4px ${struct.color}55, 0 0 16px ${struct.color}`
                : `0 0 8px ${struct.color}aa`,
              transition: "all 160ms ease",
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
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

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
