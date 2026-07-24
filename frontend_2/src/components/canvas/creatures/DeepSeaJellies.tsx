"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { oceanState, depthLerp } from "@/lib/oceanState";

// ─── DEEP-SEA JELLYFISH ──────────────────────────────────────────────────────
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

    if (visibility <= 0) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

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
      <mesh ref={bellRef}>
        <sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshBasicMaterial color={bellColor} transparent opacity={0} side={THREE.DoubleSide} fog />
      </mesh>
      {tentaclePositions.map((tp, ti) => (
        <mesh
          key={ti}
          position={[tp.x * size, -size * 0.6, tp.z * size]}
          ref={(el) => { if (el) tentacleRefs.current[ti] = el; }}
        >
          <capsuleGeometry args={[0.04, size * 1.6, 2, 4]} />
          <meshBasicMaterial color={tentColor} transparent opacity={0} fog />
        </mesh>
      ))}
    </group>
  );
}

export default function DeepSeaJellies() {
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
