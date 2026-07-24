"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { oceanState, depthLerp } from "@/lib/oceanState";

// Ecosystem Components
import BoidsSwarm from "./creatures/BoidsSwarm";
import PredatorFish from "./creatures/PredatorFish";
import DeepSeaJellies from "./creatures/DeepSeaJellies";
import MidnightCreatures from "./creatures/MidnightCreatures";
import BenthicLife from "./creatures/BenthicLife";

// ─── BACKGROUND & FOG ────────────────────────────────────────────────────────
const DEPTH_COLORS = [
  { t: 0.00, hex: "#1a6fa8" },   // Surface – bright ocean blue
  { t: 0.12, hex: "#0e558a" },   // Shallows
  { t: 0.28, hex: "#073d6e" },   // Shallow reef
  { t: 0.45, hex: "#042b52" },   // Coral forest
  { t: 0.60, hex: "#021b35" },   // Twilight zone
  { t: 0.80, hex: "#010d1c" },   // Midnight zone
  { t: 0.95, hex: "#020508" },   // Abyss
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
    const target = oceanState.healed ? new THREE.Color(HEALED_COLOR) : getDepthColor(oceanState.scroll);
    currentColor.lerp(target, oceanState.healed ? 0.015 : 0.05);
    scene.background = currentColor;
    
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.copy(currentColor);
      const baseDensity = THREE.MathUtils.lerp(0.02, 0.15, oceanState.scroll);
      (scene.fog as THREE.FogExp2).density = oceanState.healed
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
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    groupRef.current.rotation.z = Math.sin(t * 0.1 + 1) * 0.05;
    
    const intensity = depthLerp(3.5, 0.0, 0, 0.5);
    if (lightRef.current) {
      lightRef.current.intensity = intensity;
      lightRef.current.color.setHex(oceanState.scroll < 0.15 ? 0x7fd4ff : oceanState.scroll < 0.3 ? 0x43a8d4 : 0x1a6fa8);
    }
  });

  return (
    <group ref={groupRef} position={[0, 8, 0]}>
      <directionalLight ref={lightRef} position={[3, 10, 2]} intensity={3.5} color="#7fd4ff" castShadow={false} />
      <ambientLight intensity={THREE.MathUtils.lerp(0.4, 0.05, oceanState.scroll)} color="#1a4060" />
    </group>
  );
}

// ─── AMBIENT PARTICLES (Snow & Bubbles) ──────────────────────────────────────
function AmbientParticles() {
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
    size: 0.06,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    fog: true,
  }), []);

  const pointsRef = useRef<THREE.Points>(null!);
  const vel = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 0.003,
    y: -(0.003 + Math.random() * 0.01),
  })), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const pos = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    
    // Switch between bubbles (up) and snow (down) based on depth
    const isSurface = oceanState.scroll < 0.2;
    const mX = (oceanState.mouseX * state.viewport.width) / 2;
    const mY = (oceanState.mouseY * state.viewport.height) / 2;
    
    for (let i = 0; i < count; i++) {
      // Global Ocean Current Drift (from oceanState)
      pos[i * 3] += vel[i].x + oceanState.currentVelocity.x;
      pos[i * 3 + 2] += oceanState.currentVelocity.z; // Drift in Z axis too
      
      // Keep within bounds horizontally
      if (pos[i * 3] > 20) pos[i * 3] = -20;
      if (pos[i * 3] < -20) pos[i * 3] = 20;
      if (pos[i * 3 + 2] > 10) pos[i * 3 + 2] = -10;
      if (pos[i * 3 + 2] < -10) pos[i * 3 + 2] = 10;
      
      if (isSurface || oceanState.healed) {
        pos[i * 3 + 1] += Math.abs(vel[i].y) * 2; // Bubbles go up
        if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -10;
      } else {
        pos[i * 3 + 1] += vel[i].y + oceanState.currentVelocity.y; // Snow goes down and drifts
        if (pos[i * 3 + 1] < -10) pos[i * 3 + 1] = 10;
        
        // Bioluminescence interaction: particles near mouse get pushed and glow
        if (oceanState.scroll > 0.4) {
          const dx = pos[i * 3] - mX;
          const dy = pos[i * 3 + 1] - mY;
          const distSq = dx*dx + dy*dy;
          if (distSq < 2) {
             pos[i * 3] += dx * 0.05;
             pos[i * 3 + 1] += dy * 0.05;
          }
        }
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    let targetOpacity = oceanState.healed ? THREE.MathUtils.lerp(mat.opacity, 0.4, 0.05) : depthLerp(0.3, 0.8, 0, 1);
    
    // General bioluminescence pulse in deep water
    if (oceanState.scroll > 0.5) {
      targetOpacity += Math.sin(state.clock.elapsedTime * 2) * 0.1;
      mat.color.setHex(0x43F7FF); // Cyan glow
    } else {
      mat.color.setHex(0xffffff); // Normal white
    }
    
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);
  });

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

// ─── AUTONOMOUS DRONE SWARM ──────────────────────────────────────────────────
function DroneSwarm() {
  const droneRefs = useRef<(THREE.Group | null)[]>([]);
  const swarm = useMemo(() => [
    { id: 1, type: "Coral Survey", offset: [0, 0, 0], color: "#43F7FF" },
    { id: 2, type: "Plastic Detection", offset: [-8, 2, -5], color: "#FFC107" },
    { id: 3, type: "Marine Mammal", offset: [6, -3, -8], color: "#00FF66" }
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const vis = depthLerp(0, 1, 0.5, 0.7);

    swarm.forEach((drone, i) => {
      const ref = droneRefs.current[i];
      if (!ref) return;

      ref.position.x = drone.offset[0] + Math.sin(t * 0.4 + i) * 4;
      ref.position.y = drone.offset[1] + Math.cos(t * 0.3 + i * 2) * 2;
      ref.position.z = drone.offset[2] - 3;
      
      // Look forward along path
      ref.rotation.z = Math.sin(t * 0.5 + i) * 0.1;
      ref.rotation.y = Math.cos(t * 0.2 + i) * 0.2;

      ref.children.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = vis * 0.8;
        }
      });
    });
  });

  return (
    <group>
      {swarm.map((drone, i) => (
        <group key={drone.id} ref={(el) => { droneRefs.current[i] = el; }}>
          <mesh>
            <boxGeometry args={[0.4, 0.15, 0.4]} />
            <meshBasicMaterial color="#c8eeff" transparent opacity={0} fog />
          </mesh>
          {[[-0.3, 0, -0.3], [0.3, 0, -0.3], [-0.3, 0, 0.3], [0.3, 0, 0.3]].map((pos, j) => (
            <mesh key={j} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshBasicMaterial color={drone.color} transparent opacity={0} fog />
            </mesh>
          ))}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <coneGeometry args={[0.6, 2, 8, 1, true]} />
            <meshBasicMaterial color={drone.color} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} fog />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── SONAR RING (click-triggered) ────────────────────────────────────────────
function SonarRings() {
  const rings = useRef<{ ref: THREE.Mesh; t: number }[]>([]);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const MAX = 3;

  useFrame((state, delta) => {
    // If a sonar pulse happened recently
    const timeSinceSonar = (performance.now() / 1000) - oceanState.lastSonarTime;
    
    if (timeSinceSonar > 0 && timeSinceSonar < 0.1) {
      const slot = rings.current.findIndex(r => r.t > 1.5);
      const idx = slot >= 0 ? slot : (rings.current.length < MAX ? rings.current.length : -1);
      if (idx >= 0 && meshRefs.current[idx]) {
        rings.current[idx] = { ref: meshRefs.current[idx], t: 0 };
      }
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
        <mesh key={i} ref={(el) => { if (el) meshRefs.current[i] = el; }} scale={0.01}>
          <ringGeometry args={[0.9, 1, 32]} />
          <meshBasicMaterial color="#43F7FF" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// ─── MAIN ENGINE ────────────────────────────────────────────────────────────
export default function EcosystemEngine() {
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
        <color attach="background" args={["#1a6fa8"]} />
        <fogExp2 attach="fog" args={["#1a6fa8", 0.025]} />
        <SceneBackground />
        
        {/* Environment & Lighting */}
        <CausticRays />
        <AmbientParticles />
        <SonarRings />
        <DroneSwarm />

        {/* Fauna & Flora */}
        <BoidsSwarm />
        <PredatorFish />
        <DeepSeaJellies />
        <MidnightCreatures />
        <BenthicLife />

      </Canvas>
    </div>
  );
}
