"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Environment, Lightformer } from "@react-three/drei";
import { useRef, useMemo, useEffect, useCallback } from "react";
import * as THREE from "three";

// ─── Global State (module-level for zero-latency reads in useFrame) ─────────
let g_scroll = 0;        // 0 → 1 scroll progress
let g_mouseX = 0;        // NDC -1 → 1
let g_mouseY = 0;        // NDC -1 → 1
let g_healed = false;
let g_sonarPulse = 0;    // 0 → 1, decays to 0
let g_lastWowTime = -9999; // seconds elapsed since wow event

if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    g_scroll = Math.max(0, Math.min(1, window.scrollY / (maxScroll || 1)));
  }, { passive: true });

  window.addEventListener("mousemove", (e) => {
    g_mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    g_mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  window.addEventListener("click", () => {
    g_sonarPulse = 1;
  });

  window.addEventListener("ocean-heal", () => {
    g_healed = true;
  });
}

// ─── Depth helpers ───────────────────────────────────────────────────────────
function depthLerp(start: number, end: number, tStart: number, tEnd: number): number {
  return THREE.MathUtils.clamp(
    THREE.MathUtils.mapLinear(g_scroll, tStart, tEnd, start, end),
    Math.min(start, end),
    Math.max(start, end)
  );
}

// ─── BACKGROUND & FOG ────────────────────────────────────────────────────────
const DEPTH_COLORS = [
  { t: 0.00, hex: "#1a6fa8" },   // Surface – bright ocean blue
  { t: 0.10, hex: "#0e558a" },   // Shallows
  { t: 0.25, hex: "#073d6e" },   // Shallow reef
  { t: 0.40, hex: "#042b52" },   // Coral forest
  { t: 0.55, hex: "#021b35" },   // Twilight zone
  { t: 0.70, hex: "#010d1c" },   // Midnight zone
  { t: 0.85, hex: "#020508" },   // Abyss
  { t: 1.00, hex: "#000000" },   // Hadal
];
const HEALED_COLOR = "#00b4ff";

function getDepthColor(t: number): THREE.Color {
  let i = 0;
  while (i < DEPTH_COLORS.length - 2 && DEPTH_COLORS[i + 1].t < t) i++;
  const a = DEPTH_COLORS[i];
  const b = DEPTH_COLORS[i + 1];
  const f = (t - a.t) / (b.t - a.t);
  return new THREE.Color(a.hex).lerp(new THREE.Color(b.hex), f);
}

function SceneBackground() {
  const { scene } = useThree();
  const currentColor = useMemo(() => new THREE.Color(DEPTH_COLORS[0].hex), []);

  useFrame(() => {
    const target = g_healed
      ? new THREE.Color(HEALED_COLOR)
      : getDepthColor(g_scroll);
    currentColor.lerp(target, g_healed ? 0.015 : 0.05);
    scene.background = currentColor;
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.copy(currentColor);
      const baseDensity = THREE.MathUtils.lerp(0.02, 0.15, g_scroll);
      (scene.fog as THREE.FogExp2).density = g_healed
        ? THREE.MathUtils.lerp((scene.fog as THREE.FogExp2).density, 0.015, 0.02)
        : baseDensity;
    }
  });
  return null;
}

// ─── CAUSTIC LIGHT RAYS ─────────────────────────────────────────────────────
function CausticRays() {
  const groupRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.DirectionalLight>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Sway light rig like underwater
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    groupRef.current.rotation.z = Math.sin(t * 0.1 + 1) * 0.05;
    // Caustic intensity fades with depth
    const intensity = depthLerp(3.5, 0.0, 0, 0.5);
    if (lightRef.current) {
      lightRef.current.intensity = intensity;
      // Caustic color warms near surface
      lightRef.current.color.setHex(
        g_scroll < 0.15 ? 0x7fd4ff : g_scroll < 0.3 ? 0x43a8d4 : 0x1a6fa8
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 8, 0]}>
      <directionalLight
        ref={lightRef}
        position={[3, 10, 2]}
        intensity={3.5}
        color="#7fd4ff"
        castShadow={false}
      />
      <ambientLight
        intensity={THREE.MathUtils.lerp(0.4, 0.05, g_scroll)}
        color="#1a4060"
      />
    </group>
  );
}

// ─── BIOLUMINESCENT GLOW ORBS ────────────────────────────────────────────────
function BioOrbs() {
  const count = 18;
  const orbRefs = useRef<THREE.Mesh[]>([]);
  const data = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6 - 3
      ),
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
      size: 0.08 + Math.random() * 0.18,
      color: new THREE.Color().setHSL(0.5 + Math.random() * 0.12, 1, 0.6),
    })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Appear in twilight zone and below
    const visibility = depthLerp(0, 1, 0.45, 0.65);
    orbRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = data[i];
      // Float upward slowly, loop
      mesh.position.y = d.pos.y + Math.sin(t * d.speed + d.phase) * 1.2;
      mesh.position.x = d.pos.x + Math.sin(t * 0.3 + d.phase) * 0.5;
      // Pulse brightness
      const pulse = 0.5 + 0.5 * Math.sin(t * 2 * d.speed + d.phase);
      (mesh.material as THREE.MeshBasicMaterial).opacity = visibility * pulse * 0.85;
      mesh.scale.setScalar(d.size * (1 + pulse * 0.3));
    });
  });

  return (
    <group>
      {data.map((d, i) => (
        <mesh
          key={i}
          position={d.pos.toArray()}
          ref={(el) => { if (el) orbRefs.current[i] = el; }}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={d.color}
            transparent
            opacity={0}
            fog
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── MARINE SNOW PARTICLES ───────────────────────────────────────────────────
function MarineSnow() {
  const count = 600;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: "#ffffff",
    size: 0.04,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    fog: true,
  }), []);

  const pointsRef = useRef<THREE.Points>(null!);
  const vel = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.003,
      y: -(0.003 + Math.random() * 0.01),
    })), []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += vel[i].x;
      pos[i * 3 + 1] += vel[i].y;
      if (pos[i * 3 + 1] < -10) pos[i * 3 + 1] = 10;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    // Fade in from mid-ocean, dense in abyss
    const targetOpacity = g_healed
      ? THREE.MathUtils.lerp(mat.opacity, 0, 0.05)
      : depthLerp(0, 0.7, 0.35, 0.75);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);
  });

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

// ─── BUBBLE STREAM ───────────────────────────────────────────────────────────
function BubbleStream() {
  const count = 80;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: "#c8eeff",
    size: 0.08,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    fog: true,
  }), []);

  const pointsRef = useRef<THREE.Points>(null!);
  const vel = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.005,
      y: 0.01 + Math.random() * 0.02,
    })), []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += vel[i].x;
      pos[i * 3 + 1] += vel[i].y;
      if (pos[i * 3 + 1] > 12) pos[i * 3 + 1] = -12;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    // Bubbles abundant near surface, fade deep
    const targetOpacity = depthLerp(0.6, 0.05, 0, 0.5);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);
    // Healing: reverse — bubbles surge upward brightly
    if (g_healed) mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.9, 0.01);
  });

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

// ─── FISH (individual fish with body + tail + fin) ───────────────────────────
interface FishData {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  phase: number;
  size: number;
  color: THREE.Color;
}

// Build a proper fish shape as a custom BufferGeometry
function makeFishGeometry(scale = 1): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Body: pointed nose → oval → tapered tail neck
  shape.moveTo(0.5 * scale, 0);
  shape.bezierCurveTo(0.4 * scale, 0.18 * scale, -0.2 * scale, 0.22 * scale, -0.4 * scale, 0.08 * scale);
  shape.lineTo(-0.5 * scale, 0);
  shape.bezierCurveTo(-0.2 * scale, -0.22 * scale, 0.4 * scale, -0.18 * scale, 0.5 * scale, 0);
  const geo = new THREE.ShapeGeometry(shape, 10);
  return geo;
}

function makeTailGeometry(scale = 1): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(-0.3 * scale, 0.22 * scale);
  shape.lineTo(-0.12 * scale, 0);
  shape.lineTo(-0.3 * scale, -0.22 * scale);
  shape.lineTo(0, 0);
  return new THREE.ShapeGeometry(shape, 4);
}

function makeDorsalFinGeometry(scale = 1): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.05 * scale, 0);
  shape.lineTo(0.15 * scale, 0.22 * scale);
  shape.lineTo(0.28 * scale, 0.02 * scale);
  shape.lineTo(-0.05 * scale, 0);
  return new THREE.ShapeGeometry(shape, 4);
}

const FISH_COLORS = [
  "#00d4ff", // cyan tang
  "#ff7e2e", // clownfish orange
  "#72f5c6", // green wrasse
  "#ffd166", // yellow tang
  "#a29bfe", // purple damsel
  "#fd79a8", // pink anthias
];

function FishFlock() {
  const { viewport } = useThree();
  const fishCount = 26;

  // One group ref per fish (body + tail + fin are children)
  const groupRefs = useRef<THREE.Group[]>([]);
  const tailRefs = useRef<THREE.Mesh[]>([]);
  const bodyMats = useRef<THREE.MeshBasicMaterial[]>([]);

  const data = useMemo<FishData[]>(() =>
    Array.from({ length: fishCount }, (_, i) => {
      const size = 0.18 + Math.random() * 0.22;
      return {
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 24,
          (Math.random() - 0.5) * 11,
          (Math.random() - 0.5) * 3 - 1
        ),
        vel: new THREE.Vector3(
          (Math.random() < 0.5 ? -1 : 1) * (0.7 + Math.random() * 1.4),
          (Math.random() - 0.5) * 0.4,
          0
        ),
        phase: Math.random() * Math.PI * 2,
        size,
        color: new THREE.Color(FISH_COLORS[i % FISH_COLORS.length]),
      };
    }), []);

  // Pre-build geometries (one size each, scaled via mesh.scale)
  const bodyGeo  = useMemo(() => makeFishGeometry(1), []);
  const tailGeo  = useMemo(() => makeTailGeometry(1), []);
  const dorsalGeo = useMemo(() => makeDorsalFinGeometry(1), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const zoneVis = 1 - THREE.MathUtils.clamp(g_scroll * 4 - 0.5, 0, 1);
    const mX = (g_mouseX * viewport.width) / 2;
    const mY = (g_mouseY * viewport.height) / 2;

    groupRefs.current.forEach((grp, i) => {
      if (!grp) return;
      const d = data[i];

      // Cursor flee
      const dx = grp.position.x - mX;
      const dy = grp.position.y - mY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3.5 && dist > 0.001) {
        d.vel.x += (dx / dist) * 0.18;
        d.vel.y += (dy / dist) * 0.10;
      }

      // Speed clamp & y-drift restore
      d.vel.x = THREE.MathUtils.clamp(d.vel.x, -3.5, 3.5);
      d.vel.y = THREE.MathUtils.lerp(d.vel.y, 0, 0.025);

      d.pos.x += d.vel.x * delta;
      d.pos.y += d.vel.y * delta;

      // Wrap horizontally, clamp vertically
      if (d.pos.x > 15) d.pos.x = -15;
      if (d.pos.x < -15) d.pos.x = 15;
      d.pos.y = THREE.MathUtils.clamp(d.pos.y, -7, 7);

      grp.position.copy(d.pos);
      grp.scale.setScalar(d.size);
      // Flip to face swim direction
      grp.scale.x = d.vel.x < 0 ? -d.size : d.size;

      // Body sway
      grp.rotation.z = Math.sin(t * 5 + d.phase) * 0.08;

      // Tail wag — separate child mesh
      if (tailRefs.current[i]) {
        tailRefs.current[i].rotation.y = Math.sin(t * 8 + d.phase) * 0.35;
      }

      // Fade by depth
      if (bodyMats.current[i]) {
        bodyMats.current[i].opacity = THREE.MathUtils.lerp(
          bodyMats.current[i].opacity,
          zoneVis * 0.82,
          0.08
        );
      }
    });
  });

  return (
    <group>
      {data.map((d, i) => (
        <group
          key={i}
          ref={(el) => { if (el) groupRefs.current[i] = el; }}
          position={d.pos.toArray()}
        >
          {/* Body */}
          <mesh geometry={bodyGeo}>
            <meshBasicMaterial
              ref={(mat) => { if (mat) bodyMats.current[i] = mat as THREE.MeshBasicMaterial; }}
              color={d.color}
              transparent
              opacity={0}
              fog
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Dorsal fin (top) */}
          <mesh geometry={dorsalGeo} position={[0.05, 0.18, 0.01]}>
            <meshBasicMaterial
              color={d.color}
              transparent
              opacity={0.6}
              fog
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Tail fin */}
          <mesh
            geometry={tailGeo}
            position={[-0.48, 0, 0.02]}
            ref={(el) => { if (el) tailRefs.current[i] = el; }}
          >
            <meshBasicMaterial
              color={d.color}
              transparent
              opacity={0.75}
              fog
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Eye */}
          <mesh position={[0.28, 0.06, 0.03]}>
            <circleGeometry args={[0.04, 8]} />
            <meshBasicMaterial color="#000814" fog={false} />
          </mesh>
          <mesh position={[0.29, 0.065, 0.04]}>
            <circleGeometry args={[0.018, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} fog={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── DEEP-SEA JELLYFISH ──────────────────────────────────────────────────────
// Each jellyfish = group with bell (dome) + tentacle lines
function JellyfishInstance({ pos, phase, speed, size, hue }: {
  pos: THREE.Vector3; phase: number; speed: number; size: number; hue: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const bellRef  = useRef<THREE.Mesh>(null!);
  const tentacleRefs = useRef<THREE.Mesh[]>([]);

  const bellColor = useMemo(() => new THREE.Color().setHSL(hue, 1, 0.72), [hue]);
  const tentColor = useMemo(() => new THREE.Color().setHSL(hue, 1, 0.55), [hue]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const visibility = depthLerp(0, 1, 0.40, 0.60);

    if (!groupRef.current) return;

    // Float upward, drift sideways
    pos.y += 0.006 * speed;
    if (pos.y > 10) pos.y = -10;
    pos.x += Math.sin(t * 0.12 + phase) * 0.004;
    groupRef.current.position.copy(pos);

    // Bell pulse
    const pulse = 0.75 + 0.25 * Math.sin(t * speed * 2.5 + phase);
    if (bellRef.current) {
      bellRef.current.scale.set(size * pulse, size * 0.85, size * pulse);
      const op = visibility * (0.35 + 0.35 * Math.sin(t * speed * 2 + phase));
      (bellRef.current.material as THREE.MeshBasicMaterial).opacity = op;
    }

    // Tentacles sway
    tentacleRefs.current.forEach((t_mesh, ti) => {
      if (!t_mesh) return;
      (t_mesh.material as THREE.MeshBasicMaterial).opacity =
        visibility * (0.25 + 0.2 * Math.sin(t * speed + phase + ti));
      t_mesh.rotation.z = Math.sin(t * 0.8 + phase + ti * 0.7) * 0.25;
    });
  });

  // Build 6 tentacles evenly spread
  const tentacleCount = 6;
  const tentaclePositions = useMemo(() =>
    Array.from({ length: tentacleCount }, (_, i) => {
      const angle = (i / tentacleCount) * Math.PI * 2 - Math.PI;
      return {
        x: Math.sin(angle) * 0.55,
        z: Math.cos(angle) * 0.55,
      };
    }), []);

  return (
    <group ref={groupRef} position={pos.toArray()}>
      {/* Bell (dome half-sphere) */}
      <mesh ref={bellRef}>
        <sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshBasicMaterial
          color={bellColor}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          fog
        />
      </mesh>
      {/* Oral arms / tentacles hanging below */}
      {tentaclePositions.map((tp, ti) => (
        <mesh
          key={ti}
          position={[tp.x * size, -size * 0.6, tp.z * size]}
          ref={(el) => { if (el) tentacleRefs.current[ti] = el; }}
        >
          {/* Thin elongated capsule for tentacle */}
          <capsuleGeometry args={[0.04, size * 1.6, 2, 4]} />
          <meshBasicMaterial
            color={tentColor}
            transparent
            opacity={0}
            fog
          />
        </mesh>
      ))}
    </group>
  );
}

function Jellyfish() {
  const count = 7;
  const data = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 3 - 4
      ),
      phase: (i / count) * Math.PI * 2,
      speed: 0.22 + Math.random() * 0.28,
      size: 0.35 + Math.random() * 0.45,
      hue: 0.68 + Math.random() * 0.16,
    })), []);

  return (
    <group>
      {data.map((d, i) => (
        <JellyfishInstance key={i} {...d} />
      ))}
    </group>
  );
}

// ─── WHALE SILHOUETTE (rare wow moment) ─────────────────────────────────────
function WhaleSilhouette() {
  const ref = useRef<THREE.Mesh>(null!);
  const stateRef = useRef({ x: 25, active: false, nextAt: 40 });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = stateRef.current;

    // Trigger in deep zones, every ~60-90s
    const inDeepZone = g_scroll > 0.55;
    if (!s.active && t > s.nextAt && inDeepZone) {
      s.active = true;
      s.x = 26;
    }

    if (s.active && ref.current) {
      s.x -= delta * 1.8;
      ref.current.position.x = s.x;
      ref.current.position.y = THREE.MathUtils.lerp(
        ref.current.position.y, -2 + Math.sin(t * 0.3) * 0.5, 0.02
      );
      ref.current.position.z = -6;

      // Fade in / out
      const distFromCenter = Math.abs(s.x);
      const fadedOpacity = THREE.MathUtils.clamp(1 - (distFromCenter - 10) / 8, 0, 1);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = fadedOpacity * 0.18 * depthLerp(0, 1, 0.55, 0.7);

      if (s.x < -30) {
        s.active = false;
        s.nextAt = t + 55 + Math.random() * 40;
      }
    } else if (!s.active && ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0;
    }
  });

  return (
    <mesh ref={ref} position={[30, -2, -6]}>
      {/* Large elongated shape for whale body */}
      <capsuleGeometry args={[1.2, 6, 6, 12]} />
      <meshBasicMaterial color="#000a14" transparent opacity={0} fog />
    </mesh>
  );
}

// ─── SONAR RING (click-triggered) ────────────────────────────────────────────
function SonarRings() {
  const rings = useRef<{ ref: THREE.Mesh; t: number }[]>([]);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const MAX = 3;

  useFrame((state, delta) => {
    if (g_sonarPulse > 0) {
      // Find an available ring slot
      const slot = rings.current.findIndex(r => r.t > 1.5);
      const idx = slot >= 0 ? slot : (rings.current.length < MAX ? rings.current.length : -1);
      if (idx >= 0 && meshRefs.current[idx]) {
        rings.current[idx] = { ref: meshRefs.current[idx], t: 0 };
      }
      g_sonarPulse = 0;
    }

    rings.current.forEach((ring) => {
      if (!ring || ring.t > 1.5) return;
      ring.t += delta;
      const scale = THREE.MathUtils.lerp(0.1, 8, Math.min(ring.t / 1.2, 1));
      const opacity = THREE.MathUtils.lerp(0.8, 0, ring.t / 1.2);
      ring.ref.scale.setScalar(scale);
      (ring.ref.material as THREE.MeshBasicMaterial).opacity = opacity;
    });
  });

  return (
    <group position={[0, 0, -1]}>
      {Array.from({ length: MAX }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
          scale={0.01}
        >
          <ringGeometry args={[0.9, 1, 32]} />
          <meshBasicMaterial color="#43F7FF" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// ─── GOD RAYS (surface only) ─────────────────────────────────────────────────
function GodRays() {
  const raysRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!raysRef.current) return;
    const t = state.clock.elapsedTime;
    // Fade out as we dive
    const visibility = depthLerp(1, 0, 0, 0.30);
    raysRef.current.children.forEach((child, i) => {
      (child as THREE.Mesh & { material: THREE.MeshBasicMaterial }).material.opacity =
        visibility * (0.03 + 0.02 * Math.sin(t * 0.4 + i));
      child.rotation.z = Math.sin(t * 0.08 + i * 0.4) * 0.04;
    });
  });

  // 8 god ray planes fanning out from above
  const rays = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * 0.6 - 0.3,
      width: 0.5 + Math.random() * 1,
    })), []);

  return (
    <group ref={raysRef} position={[0, 12, -3]}>
      {rays.map((r, i) => (
        <mesh key={i} rotation={[0, 0, r.angle]} position={[r.angle * 8, -8, 0]}>
          <planeGeometry args={[r.width, 22]} />
          <meshBasicMaterial
            color="#aaddff"
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── HYDROTHERMAL VENT (abyss) ───────────────────────────────────────────────
function HydrothermalVent() {
  const particleCount = 120;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 1] = Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: "#ff5a1a",
    size: 0.12,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    fog: true,
  }), []);

  const ref = useRef<THREE.Points>(null!);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pos = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] -= delta * (1 + Math.random() * 2);
      pos[i * 3] += (Math.random() - 0.5) * 0.02;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 6;
        pos[i * 3] = (Math.random() - 0.5) * 0.8;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    // Only visible in abyss
    const visibility = depthLerp(0, 1, 0.80, 0.95);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, visibility * 0.7, 0.03);
  });

  return <points ref={ref} geometry={geo} material={mat} position={[-8, -6, -5]} />;
}

// ─── AI DRONE ───────────────────────────────────────────────────────────────
function AIDrone() {
  const droneRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    if (!droneRef.current) return;
    const t = state.clock.elapsedTime;
    // Drone visible in mid-abyss ranges
    const vis = depthLerp(0, 1, 0.45, 0.65);

    // Hover pattern
    droneRef.current.position.x = Math.sin(t * 0.4) * 5 + Math.cos(t * 0.2) * 3;
    droneRef.current.position.y = Math.cos(t * 0.3) * 2 + Math.sin(t * 0.7) * 1;
    droneRef.current.position.z = -3;
    droneRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;

    droneRef.current.children.forEach((child) => {
      if ((child as THREE.Mesh).material) {
        ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = vis * 0.8;
      }
    });

    if (lightRef.current) {
      lightRef.current.intensity = vis * (1.5 + 0.5 * Math.sin(t * 3));
    }
  });

  return (
    <group ref={droneRef}>
      {/* Drone body */}
      <mesh>
        <boxGeometry args={[0.4, 0.15, 0.4]} />
        <meshBasicMaterial color="#c8eeff" transparent opacity={0} fog />
      </mesh>
      {/* Drone arms */}
      {[[-0.3, 0, -0.3], [0.3, 0, -0.3], [-0.3, 0, 0.3], [0.3, 0, 0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#43F7FF" transparent opacity={0} fog />
        </mesh>
      ))}
      {/* Search light beam */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <coneGeometry args={[0.6, 2, 8, 1, true]} />
        <meshBasicMaterial color="#43F7FF" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} fog />
      </mesh>
      <pointLight ref={lightRef} color="#43F7FF" intensity={0} distance={8} decay={2} />
    </group>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────
export default function OceanCanvas() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -50 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        frameloop="always"
      >
        {/* Depth-evolving background and fog */}
        <color attach="background" args={["#1a6fa8"]} />
        <fogExp2 attach="fog" args={["#1a6fa8", 0.025]} />
        <SceneBackground />

        {/* Lighting */}
        <CausticRays />

        {/* Surface effects */}
        <GodRays />
        <BubbleStream />

        {/* Mid-water life */}
        <FishFlock />
        <Jellyfish />
        <BioOrbs />

        {/* Deep effects */}
        <MarineSnow />
        <HydrothermalVent />

        {/* Creatures */}
        <WhaleSilhouette />

        {/* AI companion */}
        <AIDrone />

        {/* Interactions */}
        <SonarRings />
      </Canvas>
    </div>
  );
}
