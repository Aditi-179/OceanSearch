"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { oceanState } from "@/lib/oceanState";

// Sleeker, more anatomically correct predator shape
function makePredatorGeometry(scale = 1): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Streamlined torpedo body
  shape.moveTo(0.9 * scale, 0);
  // Upper body arc
  shape.bezierCurveTo(0.7 * scale, 0.15 * scale, 0.2 * scale, 0.22 * scale, -0.2 * scale, 0.18 * scale);
  // Dorsal fin
  shape.lineTo(-0.25 * scale, 0.35 * scale);
  shape.lineTo(-0.35 * scale, 0.14 * scale);
  // Taper to tail base
  shape.bezierCurveTo(-0.5 * scale, 0.08 * scale, -0.65 * scale, 0.03 * scale, -0.7 * scale, 0);
  // Tail fork (crescent moon shape)
  shape.lineTo(-0.9 * scale, 0.22 * scale);
  shape.lineTo(-0.78 * scale, 0);
  shape.lineTo(-0.9 * scale, -0.22 * scale);
  shape.lineTo(-0.7 * scale, 0);
  // Lower body arc
  shape.bezierCurveTo(-0.65 * scale, -0.03 * scale, -0.5 * scale, -0.08 * scale, -0.35 * scale, -0.14 * scale);
  // Pelvic fin
  shape.lineTo(-0.3 * scale, -0.28 * scale);
  shape.lineTo(-0.2 * scale, -0.18 * scale);
  // Back to nose
  shape.bezierCurveTo(0.2 * scale, -0.22 * scale, 0.7 * scale, -0.15 * scale, 0.9 * scale, 0);

  const extrudeSettings = {
    depth: 0.1 * scale,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.04 * scale,
    bevelThickness: 0.06 * scale
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

const NUM_PREDATORS = 4;
const PREDATOR_SPEED = 1.2;

interface Predator {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  phase: number;
  size: number;
  quat: THREE.Quaternion;
}

export default function PredatorFish() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const geometry = useMemo(() => makePredatorGeometry(1.4), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#64748b",        // cool slate grey
    roughness: 0.3,
    metalness: 0.25,         // subtle metallic sheen like real shark skin
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
    fog: true,
  }), []);

  const predators = useMemo<Predator[]>(() =>
    Array.from({ length: NUM_PREDATORS }, (_, i) => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 35,
        -8 + Math.random() * 6,
        (Math.random() - 0.5) * 8 - 2
      ),
      vel: new THREE.Vector3(
        (Math.random() < 0.5 ? -1 : 1) * PREDATOR_SPEED,
        0,
        0
      ),
      phase: Math.random() * Math.PI * 2,
      size: 0.9 + Math.random() * 0.4,
      quat: new THREE.Quaternion(),
    })),
  []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const _forward = useMemo(() => new THREE.Vector3(), []);
  const _targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const _lookMat = useMemo(() => new THREE.Matrix4(), []);
  const _up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame((state, rawDelta) => {
    if (!meshRef.current) return;

    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;

    // Predators are mostly in the coral reef to twilight zone (0.05 to 0.65)
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

      // Smooth patrol — gentle sinusoidal path instead of hard back-and-forth
      p.pos.addScaledVector(p.vel, delta);

      // Gradual turn at boundaries (no instant velocity flip)
      if (p.pos.x > 20) {
        p.vel.x -= 0.02 * (p.pos.x - 20);
      } else if (p.pos.x < -20) {
        p.vel.x += 0.02 * (-20 - p.pos.x) * -1;
      }

      // Gentle sine wave Y movement — smooth, menacing undulation
      const verticalDrift = Math.sin(t * 0.3 + p.phase) * 0.008;
      p.pos.y += verticalDrift;
      p.vel.y = p.vel.y * 0.95 + verticalDrift;

      // Slight Z drift for depth
      p.pos.z += Math.sin(t * 0.15 + p.phase * 2) * 0.003;

      // Clamp speed
      const speed = p.vel.length();
      if (speed > PREDATOR_SPEED * 1.2) {
        p.vel.multiplyScalar(PREDATOR_SPEED * 1.2 / speed);
      } else if (speed < PREDATOR_SPEED * 0.5 && speed > 0.001) {
        p.vel.multiplyScalar(PREDATOR_SPEED * 0.5 / speed);
      }

      // ── Smooth orientation via quaternion slerp ──
      dummy.position.copy(p.pos);
      dummy.scale.setScalar(p.size);

      if (p.vel.lengthSq() > 0.01) {
        _forward.copy(p.pos).add(p.vel);
        _lookMat.lookAt(p.pos, _forward, _up);
        _targetQuat.setFromRotationMatrix(_lookMat);
        // Very slow turning for menacing, deliberate movement
        p.quat.slerp(_targetQuat, 0.03);
      }

      dummy.quaternion.copy(p.quat);

      // Slow, powerful tail sway
      const wagFreq = 2.5;
      const wagAmp = 0.06;
      dummy.rotateY(Math.sin(t * wagFreq + p.phase) * wagAmp);
      // Subtle roll
      dummy.rotateZ(Math.sin(t * wagFreq * 0.4 + p.phase) * 0.02);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, NUM_PREDATORS]} />
  );
}
