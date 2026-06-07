import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";
import type { BrainStructure } from "../../data/brain-structures";
import brainGlbUrl from "@/assets/models/brain.glb?url";

// =============================================================================
// Brain3DView — an interactive, rotatable/zoomable WHITE 3D brain.
//
// The brain.glb shell is normalized (Box3-fit) and re-skinned with a clean
// near-white physical material so it reads like a real anatomical model
// rather than the source's pink tissue. Instead of hard dots, each structure
// lights up as a soft CERULEAN GLOW PATCH on the brain surface — an invisible
// sphere provides the click/hover hit-area and the glow eases up to full when
// the region is hovered or selected. Clicking opens the shared StructureDetail
// panel via `onSelect`. Glows and the brain live in the SAME transform group
// so they always track the right region no matter how the user rotates/zooms.
//
// Each region also fades by whether it currently faces the camera: front and
// deep/central structures stay live (hoverable + clickable), regions rotated
// to the far side fade out and disable their hit-area. Deep structures glow
// through the surface (depth-test off) so interior regions still light up.
// =============================================================================

const BRAIN_GLB_URL = brainGlbUrl;
// The model ships meshopt-compressed (EXT_meshopt_compression + mesh
// quantization). drei decodes meshopt with the decoder bundled in three-stdlib
// (local, no network). We pass useDraco=false so drei never instantiates its
// DRACOLoader, which otherwise points at a gstatic CDN — a remote runtime fetch
// we deliberately avoid (it can white-screen the lab if the CDN is unreachable).
useGLTF.preload(BRAIN_GLB_URL, false, true);

// Anatomical-space extent the structure positions were authored against.
// The GLB is scaled to match so marker coords line up with the mesh.
const TARGET_SIZE = 3.4;

function FittedBrain() {
  const { scene } = useGLTF(BRAIN_GLB_URL, false, true);

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
    // The structure marker coords use +Z = anterior (front of brain), but this
    // GLB is exported with its anterior facing -Z, so without this the occipital
    // marker (z=-1.45) lands on the frontal lobe and every label reads
    // front/back-swapped. Rotate the mesh 180° about Y so its anterior aligns
    // with the marker coordinate space. (Markers are siblings, not children, so
    // this rotates the mesh relative to them.)
    wrapper.rotation.y = Math.PI;
    return wrapper;
  }, [scene]);

  return <primitive object={fitted} />;
}

// Soft radial "glow patch" texture: a white core fading to transparent. It's
// tinted cerulean by the sprite material's color and drawn with additive
// blending so each active structure reads as the brain luminously lighting up
// at that spot. Built once and shared by every marker.
let GLOW_TEXTURE: THREE.CanvasTexture | null = null;
function getGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  if (!GLOW_TEXTURE) {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.22, "rgba(255,255,255,0.8)");
    grad.addColorStop(0.55, "rgba(255,255,255,0.25)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    GLOW_TEXTURE = tex;
  }
  return GLOW_TEXTURE;
}

const GLOW_COLOR = new THREE.Color(PALETTE.surf); // bright cerulean primary glow

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
  const hitRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const matRef = useRef<THREE.SpriteMaterial>(null);
  const intensity = useRef(0);
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;
  const pos = struct.position;
  const glowTex = useMemo(() => getGlowTexture(), []);

  // Reset the shared cursor if this marker unmounts while still hovered (e.g.
  // tab switch), so it never gets stuck on the pointer style.
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") document.body.style.cursor = "auto";
    };
  }, []);

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
  // Cache the camera-facing result and the camera position it was computed for.
  // Facing only changes when either the camera moves (OrbitControls) or the
  // brain group's world transform moves (the Spin auto-rotate before the user
  // interacts). When neither has changed we skip the worldToLocal + normalize +
  // dot work entirely and reuse the last result. Reading parent.matrixWorld is
  // free (three keeps it updated, and the worldToLocal below already relies on
  // it). lastTf is a cheap weighted fingerprint of the parent's world matrix;
  // both refs are seeded with sentinels so the first frame always computes.
  const liveRef = useRef(true);
  const lastCam = useRef<THREE.Vector3>(
    new THREE.Vector3(Infinity, Infinity, Infinity),
  );
  const lastTf = useRef(Infinity);

  useFrame((state, dt) => {
    const g = groupRef.current;
    const hit = hitRef.current;
    const glow = glowRef.current;
    const mat = matRef.current;
    if (!g || !hit || !glow || !mat || !g.parent) return;

    const p = tmp.p.set(pos[0], pos[1], pos[2]);
    const depth = p.length();
    const deep = depth < 0.4;

    // Is this region facing the camera? Deep/central structures have no real
    // front/back face, so they stay live. Camera is taken into the brain
    // group's local space, then we compare the region's outward normal with the
    // direction to the camera. Only recomputed when the camera or the brain's
    // world transform has actually changed since the last evaluation.
    if (deep) {
      liveRef.current = true;
    } else {
      const e = g.parent.matrixWorld.elements;
      const tf =
        e[0] + e[2] * 1.7 + e[8] * 2.3 + e[10] * 3.1 +
        e[12] * 0.7 + e[13] * 0.9 + e[14] * 1.1;
      const camMoved =
        lastCam.current.distanceToSquared(state.camera.position) > 1e-9;
      const tfMoved = Math.abs(tf - lastTf.current) > 1e-9;
      if (camMoved || tfMoved) {
        lastCam.current.copy(state.camera.position);
        lastTf.current = tf;
        const camLocal = tmp.cam.copy(state.camera.position);
        g.parent.worldToLocal(camLocal);
        const n = tmp.n.copy(p).normalize();
        const toCam = tmp.toCam.copy(camLocal).sub(p).normalize();
        liveRef.current = n.dot(toCam) > 0;
      }
    }
    const live = liveRef.current;

    // Toggling the invisible hit-sphere's visibility also turns its raycast
    // on/off, so far-side regions can't be hovered/clicked through the brain.
    hit.visible = live || active;

    // Ease the glow toward its target so hover/select feels soft. Live regions
    // rest at a faint ambient shimmer so they're discoverable without the old
    // "dot soup"; the active region pulses gently at full strength.
    let target = 0;
    if (active) target = 1;
    else if (live) target = anySelected ? 0.06 : 0.18;
    intensity.current += (target - intensity.current) * Math.min(1, dt * 8);
    const i = intensity.current;

    const pulse = selected
      ? 1 + Math.sin(state.clock.elapsedTime * 3) * 0.07
      : 1;
    glow.scale.setScalar((0.7 + 0.7 * i) * pulse);
    mat.opacity = i;
    glow.visible = i > 0.01;
  });

  return (
    <group position={pos} ref={groupRef}>
      {/* Invisible hit-area: opacity 0 but raycastable while visible. */}
      <mesh
        ref={hitRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(struct.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          if (typeof document !== "undefined")
            document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          if (typeof document !== "undefined")
            document.body.style.cursor = "auto";
        }}
        data-testid={`brain3d-marker-${struct.id}`}
      >
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Cerulean glow patch — additive, depth-test off so deep structures
          still light up through the surface when chosen. */}
      <sprite ref={glowRef} scale={0.7}>
        <spriteMaterial
          ref={matRef}
          map={glowTex ?? undefined}
          color={GLOW_COLOR}
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {/* Label only while active, floated just above the glow. */}
      {active && (
        <Html
          center
          distanceFactor={8}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span
            style={{
              display: "inline-block",
              transform: "translateY(-26px)",
              fontSize: 11,
              fontWeight: 600,
              color: PALETTE.cloud,
              background: `${PALETTE.bg}d9`,
              border: `1px solid ${PALETTE.steel}`,
              borderRadius: 9999,
              padding: "2px 8px",
              backdropFilter: "blur(6px)",
              whiteSpace: "nowrap",
            }}
          >
            {struct.shortName || struct.name}
          </span>
        </Html>
      )}
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

      {/* Zoom is clamped to a gentle band so the brain can never be scrolled
          into an unreadable gyri close-up (the old min of 2.8 let the camera
          dive inside the cortex). Pan stays off so it always re-centres. */}
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={4.3}
        maxDistance={7.5}
        rotateSpeed={0.7}
        zoomSpeed={0.5}
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

// Shows progress while the heavy (~13MB) GLB downloads. Lives OUTSIDE the
// <Canvas> in the DOM (drei's useProgress is a plain store hook) so the user
// sees a clear "loading" state instead of an empty 3D area that looks broken
// while the model streams in.
function LoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
      data-testid="brain-3d-loading"
    >
      <div
        className="h-9 w-9 rounded-full border-2 animate-spin"
        style={{
          borderColor: `${PALETTE.surf}33`,
          borderTopColor: PALETTE.surf,
        }}
      />
      <p className="text-xs font-medium" style={{ color: `${PALETTE.mist}cc` }}>
        Loading 3D brain… {Math.round(progress)}%
      </p>
    </div>
  );
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

      <LoadingOverlay />

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
          Drag to rotate · scroll to zoom · tap a lobe
        </span>
      </div>
    </div>
  );
}
