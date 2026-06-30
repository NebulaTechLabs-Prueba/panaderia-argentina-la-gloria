"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

// Polvillo de harina flotando (WebGL). Da una capa de profundidad viva al hero.
function Polvo({ count = 1100, color = "#FFB347" }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < a.length; i += 3) {
      a[i] = (Math.random() - 0.5) * 16;
      a[i + 1] = (Math.random() - 0.5) * 10;
      a[i + 2] = (Math.random() - 0.5) * 8;
    }
    return a;
  }, [count]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.04;
    // leve deriva vertical (cae como harina)
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.4;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color={color} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Canvas autocontenido (se carga diferido desde el hero, sin SSR).
export default function Particles3D() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <Polvo />
    </Canvas>
  );
}
