'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarField({ count = 1000 }) {
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state, delta) => {
    mesh.current.rotation.x -= delta / 50;
    mesh.current.rotation.y -= delta / 60;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#888888"
        sizeAttenuation={true}
        depthWrite={false}
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export default function Background3D() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      background: 'radial-gradient(circle at 50% 50%, #1a1a24 0%, #050505 100%)',
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <StarField count={2000} />
      </Canvas>
    </div>
  );
}
