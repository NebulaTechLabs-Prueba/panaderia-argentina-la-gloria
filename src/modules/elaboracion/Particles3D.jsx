"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

// Polvillo de harina flotando (WebGL). Da profundidad viva al hero y REACCIONA al
// mouse (la nube se inclina/desplaza hacia el cursor).
function Polvo({ count = 1100, color = "#F3EAD6" }) {
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
    ref.current.rotation.y += dt * 0.035;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.4;
    // reacción al mouse: parallax suave hacia el puntero
    ref.current.rotation.x += (state.pointer.y * 0.35 - ref.current.rotation.x) * 0.05;
    ref.current.position.x += (state.pointer.x * 2 - ref.current.position.x) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.75} sizeAttenuation depthWrite={false} />
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
