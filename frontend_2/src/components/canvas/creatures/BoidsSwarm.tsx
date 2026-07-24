"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { oceanState, depthLerp } from "@/lib/oceanState";

interface Boid {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  phase: number;
}

// Boids parameters (made much more dynamic and alive)
const NUM_BOIDS = 180;
const MAX_SPEED = 7;
const MAX_FORCE = 0.15;
const NEIGHBOR_DIST = 4;
const DESIRED_SEPARATION = 1.5;

function makeFishGeometry(scale = 1): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0.5 * scale, 0);
  shape.bezierCurveTo(0.4 * scale, 0.18 * scale, -0.2 * scale, 0.22 * scale, -0.4 * scale, 0.08 * scale);
  shape.lineTo(-0.5 * scale, 0);
  shape.bezierCurveTo(-0.2 * scale, -0.22 * scale, 0.4 * scale, -0.18 * scale, 0.5 * scale, 0);
  
  // Make it 3D instead of 2D flat shape
  const extrudeSettings = { depth: 0.08 * scale, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center(); // Center the geometry for proper rotation
  return geo;
}

const FISH_COLORS = [
  "#00d4ff", // cyan tang
  "#ff7e2e", // clownfish orange
  "#ffd166", // yellow tang
];

export default function BoidsSwarm() {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  
  // Shared geometry and material
  const geometry = useMemo(() => makeFishGeometry(0.25), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#ffffff",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
    fog: true,
  }), []);

  const boids = useMemo<Boid[]>(() => 
    Array.from({ length: NUM_BOIDS }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8 - 2
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * MAX_SPEED,
        (Math.random() - 0.5) * MAX_SPEED,
        (Math.random() - 0.5) * MAX_SPEED
      ),
      phase: Math.random() * Math.PI * 2,
    })), 
  []);

  // We assign colors to instances once
  const colorArray = useMemo(() => {
    const arr = new Float32Array(NUM_BOIDS * 3);
    const color = new THREE.Color();
    for (let i = 0; i < NUM_BOIDS; i++) {
      color.set(FISH_COLORS[i % FISH_COLORS.length]);
      color.toArray(arr, i * 3);
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Boids are only visible in the top 20% of scroll
    const visibility = 1 - THREE.MathUtils.clamp(oceanState.scroll * 5, 0, 1);
    if (visibility <= 0) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    material.opacity = visibility * 0.9;

    const mX = (oceanState.mouseX * viewport.width) / 2;
    const mY = (oceanState.mouseY * viewport.height) / 2;
    const cursor = new THREE.Vector3(mX, mY, 0);

    for (let i = 0; i < NUM_BOIDS; i++) {
      const b = boids[i];
      const sep = new THREE.Vector3();
      const ali = new THREE.Vector3();
      const coh = new THREE.Vector3();
      let count = 0;

      for (let j = 0; j < NUM_BOIDS; j++) {
        if (i === j) continue;
        const other = boids[j];
        const dist = b.pos.distanceTo(other.pos);
        
        if (dist > 0 && dist < NEIGHBOR_DIST) {
          if (dist < DESIRED_SEPARATION) {
            const diff = b.pos.clone().sub(other.pos).normalize().divideScalar(dist);
            sep.add(diff);
          }
          ali.add(other.vel);
          coh.add(other.pos);
          count++;
        }
      }

      if (count > 0) {
        sep.divideScalar(count).normalize().multiplyScalar(MAX_SPEED).sub(b.vel).clampLength(0, MAX_FORCE * 1.5);
        ali.divideScalar(count).normalize().multiplyScalar(MAX_SPEED).sub(b.vel).clampLength(0, MAX_FORCE);
        coh.divideScalar(count).sub(b.pos).normalize().multiplyScalar(MAX_SPEED).sub(b.vel).clampLength(0, MAX_FORCE);
      }

      // Cursor avoid
      const cDist = b.pos.distanceTo(cursor);
      const cursorAvoid = new THREE.Vector3();
      if (cDist < 5) {
        cursorAvoid.copy(b.pos).sub(cursor).normalize().multiplyScalar(MAX_SPEED).sub(b.vel).clampLength(0, MAX_FORCE * 3);
      }

      b.vel.add(sep.multiplyScalar(1.5));
      b.vel.add(ali.multiplyScalar(1.0));
      b.vel.add(coh.multiplyScalar(1.0));
      b.vel.add(cursorAvoid.multiplyScalar(2.0));

      // Keep in bounds
      if (b.pos.x > 18) b.vel.x -= 0.1;
      if (b.pos.x < -18) b.vel.x += 0.1;
      if (b.pos.y > 10) b.vel.y -= 0.1;
      if (b.pos.y < -10) b.vel.y += 0.1;
      if (b.pos.z > 4) b.vel.z -= 0.1;
      if (b.pos.z < -8) b.vel.z += 0.1;

      b.vel.clampLength(0, MAX_SPEED);
      b.pos.add(b.vel.clone().multiplyScalar(delta));

      // Update instance matrix
      dummy.position.copy(b.pos);
      // Point fish in direction of travel. We flip x scale if moving left because our geometry points right.
      const isMovingLeft = b.vel.x < 0;
      dummy.scale.set(isMovingLeft ? -1 : 1, 1, 1);
      
      // Add slight z-rotation to simulate swimming up/down
      dummy.rotation.set(0, 0, (b.vel.y * 0.15) * (isMovingLeft ? -1 : 1));
      
      // Fast wobble body to simulate active swimming
      dummy.rotation.y += Math.sin(t * 15 + b.phase) * 0.15; // side to side wag
      dummy.rotation.z += Math.cos(t * 12 + b.phase) * 0.05; // slight roll
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, NUM_BOIDS]}>
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}
