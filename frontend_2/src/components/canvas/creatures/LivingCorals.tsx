"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { oceanState } from "@/lib/oceanState";

const NUM_CORALS = 150;

function makeCoralGeometry() {
  const geo = new THREE.CapsuleGeometry(0.15, 0.8, 4, 8);
  geo.translate(0, 0.4, 0); // anchor at base
  return geo;
}

export default function LivingCorals() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  
  const geometry = useMemo(() => makeCoralGeometry(), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide
  }), []);

  // Procedural Coral Placement
  const corals = useMemo(() => {
    return Array.from({ length: NUM_CORALS }, () => {
      // Clump them together for a reef look
      const radius = Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius - 4;
      
      const height = 0.5 + Math.random() * 1.5;
      const tiltX = (Math.random() - 0.5) * 0.5;
      const tiltZ = (Math.random() - 0.5) * 0.5;
      
      const healthyColor = new THREE.Color().setHSL(Math.random() * 0.15 + 0.9, 0.8, 0.5); // pinks/oranges
      
      return { x, y: -2, z, height, tiltX, tiltZ, healthyColor };
    });
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const bleachedColor = useMemo(() => new THREE.Color(0xdddddd), []);
  const colorArray = useMemo(() => new Float32Array(NUM_CORALS * 3), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Only render corals in the Shallows & Coral Forest (scroll 0.15 to 0.5)
    if (oceanState.scroll < 0.1 || oceanState.scroll > 0.6) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    // Calculate bleaching factor (0 = healthy, 1 = dead)
    let bleaching = 0;
    if (oceanState.scenario !== "cleanup" && oceanState.scenario !== "optimistic") {
      bleaching = Math.max(0, (oceanState.timelineYear - 2025) / 25);
      if (oceanState.scenario === "worst_case") bleaching = Math.min(1, bleaching * 1.5);
    }
    if (oceanState.healed) bleaching = 0;

    for (let i = 0; i < NUM_CORALS; i++) {
      const c = corals[i];
      
      // Animate polyps/waving in current
      const wave = Math.sin(t * 2 + c.x * 2) * 0.05 * (1 - bleaching); 
      
      dummy.position.set(c.x, c.y, c.z);
      dummy.rotation.set(c.tiltX + wave, 0, c.tiltZ + wave);
      dummy.scale.setScalar(c.height);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Color mixing (Healthy -> Bleached)
      tempColor.copy(c.healthyColor).lerp(bleachedColor, bleaching);
      tempColor.toArray(colorArray, i * 3);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, NUM_CORALS]}>
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}
