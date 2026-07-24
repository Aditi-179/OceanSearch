"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Float, Environment, Lightformer } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

// We keep a global reference to scroll progress for the canvas to read synchronously
let globalScrollProgress = 0;
let isHealed = false;

if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    globalScrollProgress = Math.max(0, Math.min(1, window.scrollY / (maxScroll || 1)));
  });
  
  window.addEventListener("ocean-heal", () => {
    isHealed = true;
  });
}

function DepthFog() {
  const { scene } = useThree();
  const fogColor = useMemo(() => new THREE.Color(), []);
  
  // Depth colors to interpolate between
  const surfaceColor = useMemo(() => new THREE.Color("#003E6B"), []);
  const midColor = useMemo(() => new THREE.Color("#00192E"), []);
  const abyssColor = useMemo(() => new THREE.Color("#000000"), []);

  useFrame(() => {
    // Interpolate fog color based on scroll, OR if healed, interpolate back to a bright beautiful color
    let targetColor = surfaceColor;
    
    if (isHealed) {
      targetColor = new THREE.Color("#00BFFF"); // Bright healed ocean blue
    } else {
      if (globalScrollProgress < 0.5) {
        targetColor = surfaceColor.clone().lerp(midColor, globalScrollProgress * 2);
      } else {
        targetColor = midColor.clone().lerp(abyssColor, (globalScrollProgress - 0.5) * 2);
      }
    }
    
    // Smooth transition (slower if healing so it looks like a sunrise)
    fogColor.lerp(targetColor, isHealed ? 0.02 : 0.1);
    scene.background = fogColor;
    if (scene.fog) {
      scene.fog.color = fogColor;
      (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp(isHealed ? 0.02 : 0.04, 0.08, globalScrollProgress);
    }
  });

  return null;
}

function Particles() {
  const ref1 = useRef<THREE.Group>(null!);
  const ref2 = useRef<THREE.Group>(null!);
  const ref3 = useRef<THREE.Group>(null!); // Marine Snow for abyss
  
  useFrame((state, delta) => {
    if (ref1.current) {
      ref1.current.rotation.y += delta * 0.05;
      ref1.current.rotation.x += delta * 0.02;
      // Safely access the Sparkles child mesh to fade it out
      const points = ref1.current.children[0] as any;
      if (points?.material) {
        points.material.opacity = THREE.MathUtils.lerp(0.5, 0, globalScrollProgress * 2);
        points.material.transparent = true;
      }
    }
    if (ref2.current) {
      ref2.current.rotation.y += delta * 0.02;
      const midOpacity = Math.sin(globalScrollProgress * Math.PI); // peaks at 0.5
      const points = ref2.current.children[0] as any;
      if (points?.material) {
        points.material.opacity = THREE.MathUtils.lerp(0, 0.8, midOpacity);
        points.material.transparent = true;
      }
    }
    if (ref3.current) {
      ref3.current.position.y -= delta * (isHealed ? -2 : 0.5); // drift up if healed
      if (ref3.current.position.y < -10) ref3.current.position.y = 10;
      if (isHealed && ref3.current.position.y > 10) ref3.current.position.y = -10;
      
      const abyssOpacity = globalScrollProgress > 0.6 ? (globalScrollProgress - 0.6) * 2.5 : 0;
      const points = ref3.current.children[0] as any;
      if (points?.material) {
        points.material.opacity = THREE.MathUtils.lerp(0, 0.6, isHealed ? 1 : abyssOpacity);
        points.material.transparent = true;
        if (isHealed) {
          // Sparkles color uniform/property depending on version
          if (points.material.color) points.material.color.set("#43F7FF");
        }
      }
    }
  });

  return (
    <group>
      <group ref={ref1}>
        <Sparkles count={500} scale={30} size={6} speed={0.8} opacity={0.5} color="#DDF5FF" />
      </group>
      <group ref={ref2}>
        <Sparkles count={300} scale={20} size={10} speed={0.2} opacity={0} color="#43F7FF" />
      </group>
      <group ref={ref3}>
        <Sparkles count={800} scale={40} size={3} speed={0.1} opacity={0} color="#ffffff" />
      </group>
    </group>
  );
}

function Caustics() {
  const group = useRef<THREE.Group>(null!);
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 2;
      group.current.position.z = Math.cos(state.clock.elapsedTime * 0.2) * 2;
      // Move light rig up so it fades out as camera "descends" (which is just scroll progress here)
      group.current.position.y = THREE.MathUtils.lerp(0, 20, globalScrollProgress * 3);
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.1} color="#003E6B" />
      <directionalLight position={[0, 10, 5]} intensity={1.5} color="#43F7FF" castShadow />
      
      {/* Volumetric "God Rays" feel - only visible near surface */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} color="#43F7FF" />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} color="#1D8DFF" />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} color="#5DCBFF" />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} color="#18FFC8" />
        </group>
      </Environment>
    </group>
  );
}

// Optional: interactive fish flock that avoids cursor
function FishFlock() {
  const { mouse, viewport } = useThree();
  const group = useRef<THREE.Group>(null!);
  
  // Dummy spheres for "fish" silhouettes
  const fishCount = 15;
  const positions = useMemo(() => Array.from({ length: fishCount }, () => new THREE.Vector3(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 5 - 2
  )), []);
  
  const fishRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    // Only show near surface/shallows
    const visibility = 1 - Math.min(1, globalScrollProgress * 3);
    
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const mouseVec = new THREE.Vector3(mouseX, mouseY, 0);

    fishRefs.current.forEach((fish, i) => {
      if (!fish) return;
      fish.visible = visibility > 0.01;
      (fish.material as THREE.MeshBasicMaterial).opacity = visibility * 0.5;
      
      // Swim slowly left to right
      fish.position.x -= delta * 1.5;
      if (fish.position.x < -15) fish.position.x = 15;
      
      // Avoid cursor
      const dist = fish.position.distanceTo(mouseVec);
      if (dist < 3) {
        const dir = fish.position.clone().sub(mouseVec).normalize();
        fish.position.add(dir.multiplyScalar(delta * 5));
      }
      
      // Wiggle
      fish.rotation.y = Math.sin(state.clock.elapsedTime * 5 + i) * 0.2;
    });
  });

  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <mesh 
          key={i} 
          position={pos} 
          ref={(el) => { if (el) fishRefs.current[i] = el; }}
        >
          {/* Using a simple shape for silhouette */}
          <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.5} fog={true} />
        </mesh>
      ))}
    </group>
  );
}

export default function OceanCanvas() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false }}
      >
        <color attach="background" args={["#003E6B"]} />
        <fogExp2 attach="fog" args={["#003E6B", 0.04]} />
        <DepthFog />
        <Caustics />
        <Particles />
        <FishFlock />
      </Canvas>
    </div>
  );
}
