"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { oceanState, depthLerp } from "@/lib/oceanState";

interface Boid {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  phase: number;
  size: number;
  // Smoothed orientation quaternion to prevent snapping
  quat: THREE.Quaternion;
}

// Boids parameters
const NUM_BOIDS = 150;
const MAX_SPEED = 2.5;
const MIN_SPEED = 0.4;
const MAX_FORCE = 0.018;
const NEIGHBOR_DIST = 4;
const DESIRED_SEPARATION = 1.8;

function makeFishGeometry(scale = 1): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Nose
  shape.moveTo(0.5 * scale, 0);
  // Top curve — rounder, more organic
  shape.bezierCurveTo(0.35 * scale, 0.12 * scale, 0.15 * scale, 0.2 * scale, 0, 0.2 * scale);
  // Dorsal fin
  shape.lineTo(-0.08 * scale, 0.35 * scale);
  shape.lineTo(-0.15 * scale, 0.18 * scale);
  // Curve to tail base
  shape.bezierCurveTo(-0.28 * scale, 0.12 * scale, -0.38 * scale, 0.04 * scale, -0.42 * scale, 0);
  // Tail fork
  shape.lineTo(-0.58 * scale, 0.2 * scale);
  shape.lineTo(-0.5 * scale, 0);
  shape.lineTo(-0.58 * scale, -0.2 * scale);
  shape.lineTo(-0.42 * scale, 0);
  // Bottom belly curve
  shape.bezierCurveTo(-0.38 * scale, -0.04 * scale, -0.28 * scale, -0.12 * scale, -0.15 * scale, -0.18 * scale);
  // Pelvic fin
  shape.lineTo(-0.08 * scale, -0.3 * scale);
  shape.lineTo(0, -0.2 * scale);
  // Curve back to nose
  shape.bezierCurveTo(0.15 * scale, -0.2 * scale, 0.35 * scale, -0.12 * scale, 0.5 * scale, 0);

  const extrudeSettings = {
    depth: 0.08 * scale,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.025 * scale,
    bevelThickness: 0.04 * scale
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

const FISH_COLORS = [
  "#00c8ff", // electric blue tang
  "#ff6b2e", // clownfish orange
  "#ffd166", // yellow tang
  "#39e88c", // parrotfish green
  "#d68fff", // purple chromis
];

export default function BoidsSwarm() {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Shared geometry and material
  const geometry = useMemo(() => makeFishGeometry(0.45), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.35,
    metalness: 0.15,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
    fog: true,
  }), []);

  const boids = useMemo<Boid[]>(() =>
    Array.from({ length: NUM_BOIDS }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8 + 6
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * MAX_SPEED,
        (Math.random() - 0.5) * MAX_SPEED * 0.4,
        (Math.random() - 0.5) * MAX_SPEED * 0.2
      ),
      phase: Math.random() * Math.PI * 2,
      size: 0.7 + Math.random() * 0.6,
      quat: new THREE.Quaternion(),
    })),
  []);

  // Assign colors to instances once
  const colorArray = useMemo(() => {
    const arr = new Float32Array(NUM_BOIDS * 3);
    const color = new THREE.Color();
    for (let i = 0; i < NUM_BOIDS; i++) {
      color.set(FISH_COLORS[i % FISH_COLORS.length]);
      // Slight random variation per fish for realism
      color.offsetHSL(
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.08
      );
      color.toArray(arr, i * 3);
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-allocate reusable vectors (zero GC pressure in the hot loop)
  const _sep = useMemo(() => new THREE.Vector3(), []);
  const _ali = useMemo(() => new THREE.Vector3(), []);
  const _coh = useMemo(() => new THREE.Vector3(), []);
  const _diff = useMemo(() => new THREE.Vector3(), []);
  const _cursor = useMemo(() => new THREE.Vector3(), []);
  const _cursorAvoid = useMemo(() => new THREE.Vector3(), []);
  const _forward = useMemo(() => new THREE.Vector3(), []);
  const _targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const _lookMat = useMemo(() => new THREE.Matrix4(), []);
  const _up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Throttle scanner updates
  const scanTimer = useRef(0);

  useFrame((state, rawDelta) => {
    if (!meshRef.current) return;

    // Clamp delta to prevent teleportation on tab-switch or long frames
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;

    // Visibility based on depth
    let visibility = 1.0;
    if (oceanState.scroll > 0.15) {
      visibility = THREE.MathUtils.mapLinear(oceanState.scroll, 0.15, 0.5, 1, 0);
    }
    visibility = THREE.MathUtils.clamp(visibility, 0, 1);

    if (visibility <= 0.05) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    material.opacity = visibility;

    const mX = (oceanState.mouseX * viewport.width) / 2;
    const mY = (oceanState.mouseY * viewport.height) / 2;
    _cursor.set(mX, mY, 0);

    for (let i = 0; i < NUM_BOIDS; i++) {
      const b = boids[i];
      _sep.set(0, 0, 0);
      _ali.set(0, 0, 0);
      _coh.set(0, 0, 0);
      let count = 0;

      for (let j = 0; j < NUM_BOIDS; j++) {
        if (i === j) continue;
        const other = boids[j];
        const dist = b.pos.distanceTo(other.pos);

        if (dist > 0 && dist < NEIGHBOR_DIST) {
          if (dist < DESIRED_SEPARATION) {
            _diff.copy(b.pos).sub(other.pos).normalize().divideScalar(dist);
            _sep.add(_diff);
          }
          _ali.add(other.vel);
          _coh.add(other.pos);
          count++;
        }
      }

      if (count > 0) {
        _sep.divideScalar(count).normalize().multiplyScalar(MAX_SPEED).sub(b.vel).clampLength(0, MAX_FORCE * 1.5);
        _ali.divideScalar(count).normalize().multiplyScalar(MAX_SPEED).sub(b.vel).clampLength(0, MAX_FORCE);
        _coh.divideScalar(count).sub(b.pos).normalize().multiplyScalar(MAX_SPEED).sub(b.vel).clampLength(0, MAX_FORCE);
      }

      // Cursor avoidance
      const cDist = b.pos.distanceTo(_cursor);
      _cursorAvoid.set(0, 0, 0);
      if (cDist < 5) {
        _cursorAvoid.copy(b.pos).sub(_cursor).normalize().multiplyScalar(MAX_SPEED).sub(b.vel).clampLength(0, MAX_FORCE * 3);
      }

      b.vel.add(_sep.multiplyScalar(1.5));
      b.vel.add(_ali.multiplyScalar(1.0));
      b.vel.add(_coh.multiplyScalar(1.0));
      b.vel.add(_cursorAvoid.multiplyScalar(2.0));

      // Soft boundary steering (gradual force, not hard snapping)
      const boundForce = 0.015;
      if (b.pos.x > 16) b.vel.x -= boundForce * (b.pos.x - 16);
      if (b.pos.x < -16) b.vel.x += boundForce * (-16 - b.pos.x) * -1;
      if (b.pos.y > 8) b.vel.y -= boundForce * (b.pos.y - 8);
      if (b.pos.y < -8) b.vel.y += boundForce * (-8 - b.pos.y) * -1;
      if (b.pos.z > 10) b.vel.z -= boundForce * (b.pos.z - 10);
      if (b.pos.z < 2) b.vel.z += boundForce * (2 - b.pos.z);

      // Dampen vertical movement — fish swim mostly horizontal
      b.vel.y *= 0.97;
      b.vel.z *= 0.99;

      // Enforce min/max speed so fish never completely stop or teleport
      const speed = b.vel.length();
      if (speed > MAX_SPEED) {
        b.vel.multiplyScalar(MAX_SPEED / speed);
      } else if (speed < MIN_SPEED && speed > 0.001) {
        b.vel.multiplyScalar(MIN_SPEED / speed);
      }

      b.pos.addScaledVector(b.vel, delta);

      // ── Smooth orientation via quaternion slerp (no snapping) ──
      dummy.position.copy(b.pos);
      dummy.scale.setScalar(b.size);

      if (b.vel.lengthSq() > 0.01) {
        _forward.copy(b.pos).add(b.vel);
        _lookMat.lookAt(b.pos, _forward, _up);
        _targetQuat.setFromRotationMatrix(_lookMat);
        // Smooth slerp — lower = smoother turning
        b.quat.slerp(_targetQuat, 0.06);
      }

      dummy.quaternion.copy(b.quat);

      // Realistic swimming undulation — gentle S-curve body wag
      const wagFreq = 5 + speed * 1.5; // faster fish wag faster
      const wagAmp = 0.08 + speed * 0.02;
      dummy.rotateY(Math.sin(t * wagFreq + b.phase) * wagAmp);
      // Slight roll into turns for realism
      dummy.rotateZ(Math.sin(t * wagFreq * 0.5 + b.phase) * 0.03);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // AI Scanning Logic (Throttle to 5Hz)
      if (t - scanTimer.current > 0.2) {
        const screenPos = b.pos.clone().project(state.camera);
        if (Math.abs(screenPos.x) < 0.05 && Math.abs(screenPos.y) < 0.05 && screenPos.z < 1) {
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
