"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float, Environment, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={ref as any}>
      <Sparkles 
        count={300} 
        scale={20} 
        size={4} 
        speed={0.4} 
        opacity={0.3} 
        color="#BDEBFF" 
      />
      <Sparkles 
        count={150} 
        scale={15} 
        size={8} 
        speed={0.2} 
        opacity={0.1} 
        color="#43F7FF" 
      />
    </group>
  );
}

function Caustics() {
  // A simple representation of volumetric light/caustics using moving lightformers
  const group = useRef<THREE.Group>(null!);
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 2;
      group.current.position.z = Math.cos(state.clock.elapsedTime * 0.2) * 2;
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.2} color="#003E6B" />
      <directionalLight position={[0, 10, 5]} intensity={1.5} color="#43F7FF" castShadow />
      
      {/* Volumetric "God Rays" feel */}
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

export default function OceanCanvas() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface-100 via-shallow-100 to-mid-100">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
      >
        <color attach="background" args={["#00192E"]} />
        <fogExp2 attach="fog" args={["#00192E", 0.05]} />
        <Caustics />
        <Particles />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
           {/* We could place 3D models here later, for now just particles and fog */}
        </Float>
      </Canvas>
      {/* Gradient overlay to blend into the rest of the site */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-100/50 to-background" />
    </div>
  );
}
