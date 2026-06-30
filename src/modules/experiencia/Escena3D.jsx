"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";

// Pieza 3D decorativa (aro tipo factura/rosca) que gira sola.
function Pieza() {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.5;
    ref.current.rotation.x += dt * 0.12;
  });
  return (
    <mesh ref={ref} castShadow>
      <torusGeometry args={[1, 0.42, 40, 120]} />
      <meshStandardMaterial color="#FF9900" roughness={0.35} metalness={0.15} />
    </mesh>
  );
}

// Acento 3D del hero. Se carga diferido (ssr:false) para no pesar el render
// inicial ni romper el prerender del export estático.
export default function Escena3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-4, -2, 2]} intensity={0.4} color="#63B0DD" />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.4}>
        <Pieza />
      </Float>
    </Canvas>
  );
}
