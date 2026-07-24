"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { oceanState } from "@/lib/oceanState";

// Pre-compute basic low-poly shapes for corals
function makeBrainCoral() {
  return new THREE.DodecahedronGeometry(1, 1);
}

function makeStaghornCoral() {
  const g = new THREE.CylinderGeometry(0.1, 0.2, 2, 5);
  g.translate(0, 1, 0); // anchor at base
  return g;
}

function makeTableCoral() {
  const g = new THREE.CylinderGeometry(1.5, 0.2, 0.4, 8);
  g.translate(0, 0.2, 0);
  return g;
}

export default function CoralReef() {
  const brainCount = 60;
  const stagCount = 150;
  const tableCount = 40;

  const brainRef = useRef<THREE.InstancedMesh>(null!);
  const stagRef = useRef<THREE.InstancedMesh>(null!);
  const tableRef = useRef<THREE.InstancedMesh>(null!);

  const groupRef = useRef<THREE.Group>(null!);

  const mats = useMemo(() => {
    return {
      brain: new THREE.MeshBasicMaterial({ color: "#ff6b6b", fog: true }),
      stag: new THREE.MeshBasicMaterial({ color: "#feca57", fog: true }),
      table: new THREE.MeshBasicMaterial({ color: "#1dd1a1", fog: true }),
    };
  }, []);

  const geos = useMemo(() => {
    return {
      brain: makeBrainCoral(),
      stag: makeStaghornCoral(),
      table: makeTableCoral(),
    };
  }, []);

  // Initialize positions
  useMemo(() => {
    const dummy = new THREE.Object3D();
    
    // We do this in a setTimeout so refs are populated, or we just use a useEffect.
    // Actually, setting instance matrix needs to happen after mount.
  }, []);

  // We set matrices in an effect
  useMemo(() => {
    // Generate data
  }, []);

  // Better to generate matrices in useMemo and apply them in useEffect
  const { brainMatrices, stagMatrices, tableMatrices, stagPhases } = useMemo(() => {
    const b = [];
    const dummy = new THREE.Object3D();
    
    // Brain Corals (scattered clusters)
    for (let i = 0; i < brainCount; i++) {
      dummy.position.set((Math.random() - 0.5) * 40, -6 - Math.random() * 2, (Math.random() - 0.5) * 20);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = 0.5 + Math.random() * 1.5;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      b.push(dummy.matrix.clone());
    }

    const s = [];
    const sPhases = [];
    // Staghorn Corals (tall patches)
    for (let i = 0; i < stagCount; i++) {
      dummy.position.set((Math.random() - 0.5) * 45, -7 + Math.random() * 1.5, (Math.random() - 0.5) * 20);
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.4, 
        Math.random() * Math.PI * 2, 
        (Math.random() - 0.5) * 0.4
      );
      const scale = 0.5 + Math.random() * 1.2;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      s.push(dummy.matrix.clone());
      sPhases.push(Math.random() * Math.PI * 2);
    }

    const t = [];
    // Table Corals (flat shelves)
    for (let i = 0; i < tableCount; i++) {
      dummy.position.set((Math.random() - 0.5) * 40, -5 + Math.random() * 3, (Math.random() - 0.5) * 20);
      dummy.rotation.set((Math.random() - 0.5) * 0.2, Math.random() * Math.PI, (Math.random() - 0.5) * 0.2);
      const scale = 0.8 + Math.random() * 1.5;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      t.push(dummy.matrix.clone());
    }

    return { brainMatrices: b, stagMatrices: s, tableMatrices: t, stagPhases: sPhases };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize static matrices once on mount
  const initialized = useRef(false);
  useFrame((state) => {
    if (!groupRef.current) return;
    
    if (!initialized.current) {
      if (brainRef.current && tableRef.current && stagRef.current) {
        for (let i = 0; i < brainCount; i++) {
          brainRef.current.setMatrixAt(i, brainMatrices[i]);
        }
        for (let i = 0; i < tableCount; i++) {
          tableRef.current.setMatrixAt(i, tableMatrices[i]);
        }
        for (let i = 0; i < stagCount; i++) {
          stagRef.current.setMatrixAt(i, stagMatrices[i]);
        }
        brainRef.current.instanceMatrix.needsUpdate = true;
        tableRef.current.instanceMatrix.needsUpdate = true;
        stagRef.current.instanceMatrix.needsUpdate = true;
        initialized.current = true;
      }
    }

    // Corals are mostly in shallow reef (20-80m, which is scroll ~ 0.1 to 0.45)
    // Fade them in at 0.05, peak at 0.2, fade out by 0.5
    let visibility = 0;
    const s = oceanState.scroll;
    if (s > 0.02 && s < 0.55) {
      if (s < 0.15) visibility = (s - 0.02) / (0.15 - 0.02);
      else if (s > 0.4) visibility = 1 - (s - 0.4) / (0.55 - 0.4);
      else visibility = 1;
    }
    
    if (visibility <= 0) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    // Apply visibility via material opacity or scaling? Material is better for smooth fade
    mats.brain.opacity = visibility;
    mats.stag.opacity = visibility;
    mats.table.opacity = visibility;
    
    mats.brain.transparent = visibility < 1;
    mats.stag.transparent = visibility < 1;
    mats.table.transparent = visibility < 1;

    // Animate Staghorn corals swaying in current
    if (stagRef.current) {
      const time = state.clock.elapsedTime;
      for (let i = 0; i < stagCount; i++) {
        dummy.matrix.copy(stagMatrices[i]);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        
        // Add sway to rotation
        const euler = new THREE.Euler().setFromQuaternion(dummy.quaternion);
        euler.x += Math.sin(time * 1.5 + stagPhases[i]) * 0.02;
        euler.z += Math.cos(time * 1.2 + stagPhases[i]) * 0.02;
        dummy.quaternion.setFromEuler(euler);
        
        dummy.updateMatrix();
        stagRef.current.setMatrixAt(i, dummy.matrix);
      }
      stagRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={brainRef} args={[geos.brain, mats.brain, brainCount]} />
      <instancedMesh ref={stagRef} args={[geos.stag, mats.stag, stagCount]} />
      <instancedMesh ref={tableRef} args={[geos.table, mats.table, tableCount]} />
    </group>
  );
}
