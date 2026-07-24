"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { oceanState } from "@/lib/oceanState";

// Larger geometry for sharks/barracuda
function makePredatorGeometry(scale = 1): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Sleeker, longer body
  shape.moveTo(0.8 * scale, 0);
  shape.bezierCurveTo(0.6 * scale, 0.2 * scale, -0.4 * scale, 0.25 * scale, -0.7 * scale, 0.1 * scale);
  shape.lineTo(-0.9 * scale, 0);
  shape.bezierCurveTo(-0.4 * scale, -0.25 * scale, 0.6 * scale, -0.2 * scale, 0.8 * scale, 0);
  return new THREE.ShapeGeometry(shape, 12);
}

const NUM_PREDATORS = 4;
const PREDATOR_SPEED = 1.5;

export default function PredatorFish() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  
  const geometry = useMemo(() => makePredatorGeometry(1.2), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#576574", // shark grey
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
    fog: true,
  }), []);

  const predators = useMemo(() => 
    Array.from({ length: NUM_PREDATORS }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        -10 + Math.random() * 5,
        (Math.random() - 0.5) * 10 - 2
      ),
      vel: new THREE.Vector3(
        (Math.random() < 0.5 ? -1 : 1) * PREDATOR_SPEED,
        0,
        0
      ),
      phase: Math.random() * Math.PI * 2,
    })), 
  []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Predators are mostly in the coral reef to twilight zone (0.15 to 0.6)
    const s = oceanState.scroll;
    let visibility = 0;
    if (s > 0.05 && s < 0.65) {
      if (s < 0.15) visibility = (s - 0.05) / 0.1;
      else if (s > 0.5) visibility = 1 - (s - 0.5) / 0.15;
      else visibility = 1;
    }

    if (visibility <= 0) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    material.opacity = visibility * 0.85;

    for (let i = 0; i < NUM_PREDATORS; i++) {
      const p = predators[i];
      
      // Patrol back and forth
      p.pos.add(p.vel.clone().multiplyScalar(delta));

      if (p.pos.x > 22) {
        p.vel.x = -PREDATOR_SPEED;
      } else if (p.pos.x < -22) {
        p.vel.x = PREDATOR_SPEED;
      }

      // Sine wave vertical movement
      p.pos.y += Math.sin(t * 0.5 + p.phase) * 0.01;

      // Update instance matrix
      dummy.position.copy(p.pos);
      const isMovingLeft = p.vel.x < 0;
      dummy.scale.set(isMovingLeft ? -1 : 1, 1, 1);
      
      // Slow, menacing tail sway
      dummy.rotation.set(0, 0, (p.vel.y * 0.1) * (isMovingLeft ? -1 : 1));
      dummy.rotation.z += Math.sin(t * 2 + p.phase) * 0.05;
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, NUM_PREDATORS]} />
  );
}
