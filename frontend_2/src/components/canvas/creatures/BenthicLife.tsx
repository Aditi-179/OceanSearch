"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { oceanState, depthLerp } from "@/lib/oceanState";

function makeTubeWorm() {
  const g = new THREE.CylinderGeometry(0.05, 0.08, 1.2, 5);
  g.translate(0, 0.6, 0); // anchor base
  return g;
}

function makeIsopod() {
  const g = new THREE.CapsuleGeometry(0.15, 0.4, 4, 8);
  g.rotateZ(Math.PI / 2); // lie flat
  return g;
}

export default function BenthicLife() {
  const tubeCount = 200;
  const isopodCount = 20;

  const groupRef = useRef<THREE.Group>(null!);
  const tubeRef = useRef<THREE.InstancedMesh>(null!);
  const isopodRef = useRef<THREE.InstancedMesh>(null!);

  const tubeGeo = useMemo(() => makeTubeWorm(), []);
  const tubeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#c0392b", fog: true }), []);
  
  const isoGeo = useMemo(() => makeIsopod(), []);
  const isoMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#7f8c8d", fog: true }), []);

  const initialized = useRef(false);

  // Generate static positions
  const { tubeMatrices, isopods } = useMemo(() => {
    const tMats = [];
    const dummy = new THREE.Object3D();
    
    // Tube worms clumped around central vents
    for (let i = 0; i < tubeCount; i++) {
      const radius = 1 + Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;
      dummy.position.set(
        Math.cos(angle) * radius + (Math.random() - 0.5) * 8, // slight spread across vents
        -10, // sea floor
        Math.sin(angle) * radius + (Math.random() - 0.5) * 4
      );
      // Lean outwards slightly
      dummy.rotation.set(
        Math.sin(angle) * (0.2 + Math.random() * 0.3),
        Math.random() * Math.PI,
        -Math.cos(angle) * (0.2 + Math.random() * 0.3)
      );
      dummy.scale.setScalar(0.5 + Math.random() * 1.5);
      dummy.updateMatrix();
      tMats.push(dummy.matrix.clone());
    }

    const iData = [];
    // Isopods crawling on the floor
    for (let i = 0; i < isopodCount; i++) {
      iData.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          -9.9, // just above floor
          (Math.random() - 0.5) * 20
        ),
        dir: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.1,
      });
    }

    return { tubeMatrices: tMats, isopods: iData };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Benthic life is deep: Abyss (0.8+) and Hadal
    const visibility = depthLerp(0, 1, 0.75, 0.9);

    if (!initialized.current && tubeRef.current && isopodRef.current) {
      for (let i = 0; i < tubeCount; i++) {
        tubeRef.current.setMatrixAt(i, tubeMatrices[i]);
      }
      tubeRef.current.instanceMatrix.needsUpdate = true;
      initialized.current = true;
    }

    if (visibility <= 0) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    tubeMat.opacity = visibility;
    tubeMat.transparent = visibility < 1;
    isoMat.opacity = visibility;
    isoMat.transparent = visibility < 1;

    // Isopod slow crawling
    if (isopodRef.current) {
      for (let i = 0; i < isopodCount; i++) {
        const iso = isopods[i];
        
        // Randomly change direction very slowly
        iso.dir += (Math.random() - 0.5) * 0.05;
        
        iso.pos.x += Math.cos(iso.dir) * iso.speed * delta;
        iso.pos.z += Math.sin(iso.dir) * iso.speed * delta;

        // Keep bounds
        if (iso.pos.x > 15 || iso.pos.x < -15) iso.dir += Math.PI;
        if (iso.pos.z > 10 || iso.pos.z < -10) iso.dir += Math.PI;

        dummy.position.copy(iso.pos);
        dummy.rotation.set(0, -iso.dir, 0); // face movement dir
        
        // Slight wobble while walking
        dummy.rotation.z = Math.sin(t * 5 + i) * 0.1;
        
        dummy.updateMatrix();
        isopodRef.current.setMatrixAt(i, dummy.matrix);
      }
      isopodRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={tubeRef} args={[tubeGeo, tubeMat, tubeCount]} />
      <instancedMesh ref={isopodRef} args={[isoGeo, isoMat, isopodCount]} />
      
      {/* Black Smoker Vent Particles/Geyser handled in EcosystemEngine or here */}
      {/* For simplicity, we can keep the simple particle system for the vents in the main canvas or move it here. 
          Let's add a simple vent stack geometry here. */}
      <mesh position={[0, -10, 0]}>
        <cylinderGeometry args={[1.5, 3, 2, 8]} />
        <meshBasicMaterial color="#111111" fog={true} />
      </mesh>
    </group>
  );
}
