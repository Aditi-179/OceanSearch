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
const MAX_SPEED = 6;
const MAX_FORCE = 0.04;
const NEIGHBOR_DIST = 4;
const DESIRED_SEPARATION = 1.5;

function makeFishGeometry(scale = 1): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Nose
  shape.moveTo(0.5 * scale, 0);
  // Top curve to fin
  shape.bezierCurveTo(0.3 * scale, 0.15 * scale, 0.1 * scale, 0.25 * scale, 0, 0.25 * scale);
  // Top fin
  shape.lineTo(-0.1 * scale, 0.4 * scale);
  shape.lineTo(-0.15 * scale, 0.2 * scale);
  // Curve to tail base
  shape.bezierCurveTo(-0.3 * scale, 0.15 * scale, -0.4 * scale, 0.05 * scale, -0.45 * scale, 0);
  // Top tail fin
  shape.lineTo(-0.6 * scale, 0.25 * scale);
  shape.lineTo(-0.6 * scale, -0.25 * scale);
  // Bottom tail fin
  shape.lineTo(-0.45 * scale, 0);
  // Curve to bottom belly
  shape.bezierCurveTo(-0.4 * scale, -0.05 * scale, -0.3 * scale, -0.15 * scale, -0.15 * scale, -0.2 * scale);
  // Bottom fin
  shape.lineTo(-0.1 * scale, -0.35 * scale);
  shape.lineTo(0, -0.25 * scale);
  // Curve back to nose
  shape.bezierCurveTo(0.1 * scale, -0.25 * scale, 0.3 * scale, -0.15 * scale, 0.5 * scale, 0);

  const extrudeSettings = { 
    depth: 0.06 * scale, 
    bevelEnabled: true, 
    bevelSegments: 2, 
    steps: 1, 
    bevelSize: 0.02 * scale, 
    bevelThickness: 0.03 * scale 
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
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
  const geometry = useMemo(() => makeFishGeometry(0.5), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.4,
    metalness: 0.1,
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
        (Math.random() - 0.5) * 8 + 6 // Spawn closely to camera (Z between 2 and 10) so they aren't lost in fog
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
  
  // Throttle scanner updates
  const scanTimer = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Fish are always clearly visible now as requested
    const visibility = 1.0;

    if (visibility <= 0.05) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    material.opacity = visibility;

    const mX = (oceanState.mouseX * viewport.width) / 2;
    const mY = (oceanState.mouseY * viewport.height) / 2;
    const cursor = new THREE.Vector3(mX, mY, 0);
    
    // Sonar Repulsion Force
    const timeSinceSonar = (performance.now() / 1000) - oceanState.lastSonarTime;
    const sonarActive = timeSinceSonar > 0 && timeSinceSonar < 1.5;
    const sonarRadius = timeSinceSonar * 15; // Speed of sound wave expanding

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

      // Sonar avoid
      if (sonarActive) {
        const distToCenter = b.pos.length();
        if (Math.abs(distToCenter - sonarRadius) < 3) {
          const sonarAvoid = b.pos.clone().normalize().multiplyScalar(MAX_SPEED * 2);
          b.vel.add(sonarAvoid);
        }
      }

      // Boundary avoid (soften these so velocity doesn't snap)
      if (b.pos.x > 18) b.vel.x -= 0.02;
      if (b.pos.x < -18) b.vel.x += 0.02;
      if (b.pos.y > 10) b.vel.y -= 0.02;
      if (b.pos.y < -10) b.vel.y += 0.02;
      if (b.pos.z > 10) b.vel.z -= 0.02; // keep close
      if (b.pos.z < 2) b.vel.z += 0.02; // don't go too deep into the dark fog

      // Dampen vertical movement slightly to prefer horizontal swimming
      b.vel.y *= 0.98;

      b.vel.clampLength(0, MAX_SPEED);
      b.pos.add(b.vel.clone().multiplyScalar(delta));

      // Update instance matrix
      dummy.position.copy(b.pos);
      
      // Smoothly look in direction of travel (using Z axis)
      if (b.vel.lengthSq() > 0.001) {
        dummy.lookAt(b.pos.clone().add(b.vel));
      }
      
      // Soft wobble body to simulate active swimming
      dummy.rotateY(Math.sin(t * 8 + b.phase) * 0.06); // very gentle wag
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // AI Scanning Logic (Throttle to 5Hz to save performance)
      if (t - scanTimer.current > 0.2) {
        const screenPos = b.pos.clone().project(state.camera);
        // If a boid is very close to the center of the screen
        if (Math.abs(screenPos.x) < 0.05 && Math.abs(screenPos.y) < 0.05 && screenPos.z < 1) {
          // Convert NDC to pixel coordinates for the HUD
          const px = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
          const py = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;
          
          oceanState.scanTarget = {
            id: `fish-${i}`,
            name: "Blue Tang",
            scientificName: "Paracanthurus hepatus",
            confidence: (95 + Math.random() * 4).toFixed(2),
            status: "Least Concern",
            population: "Stable",
            depth: `${Math.floor(oceanState.scroll * 200)}m`,
            screenPos: { x: px, y: py }
          };
          
          // Track discovery
          if (!oceanState.discoveredSpecies.includes("Blue Tang")) {
            oceanState.discoveredSpecies.push("Blue Tang");
          }
          
          scanTimer.current = t;
        }
      }
    }
    
    // Clear scan target if nothing found
    if (t - scanTimer.current > 0.5) {
      oceanState.scanTarget = null;
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, NUM_BOIDS]}>
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}
