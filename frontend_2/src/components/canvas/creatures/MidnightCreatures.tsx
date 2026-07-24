"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { oceanState, depthLerp } from "@/lib/oceanState";

export default function MidnightCreatures() {
  const count = 18;
  const groupRef = useRef<THREE.Group>(null!);

  const data = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15 - 5,
        (Math.random() - 0.5) * 6 - 3
      ),
      phase: (i / count) * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.15,
      hue: 0.55 + Math.random() * 0.1, // teal / cyan
    })), []);

  const meshRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Midnight zone is around 0.6 to 0.9
    const visibility = depthLerp(0, 1, 0.65, 0.85);

    if (visibility <= 0) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    data.forEach((d, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      // Slow drifting
      d.pos.x += Math.sin(t * d.speed + d.phase) * 0.005;
      d.pos.y += Math.cos(t * d.speed * 0.8 + d.phase) * 0.003;
      mesh.position.copy(d.pos);

      // Flashing lure
      const isFlashing = Math.sin(t * 1.5 + d.phase) > 0.8;
      const targetOpacity = isFlashing ? visibility * 0.9 : visibility * 0.1;
      
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
    });
  });

  return (
    <group ref={groupRef}>
      {data.map((d, i) => (
        <mesh
          key={i}
          position={d.pos.toArray()}
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
        >
          {/* Lure glow */}
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(d.hue, 1, 0.6)}
            transparent
            opacity={0}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}
