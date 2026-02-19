'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { Float, PerspectiveCamera, Environment } from '@react-three/drei';

function GeometricShape({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      // Slight scale pulse on hover
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
}

function TorusRing({ position, color, rotation }: { position: [number, number, number]; color: string; rotation: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.z -= delta * 0.1;
        }
    });

    return (
        <group rotation={rotation} position={position}>
            <mesh ref={meshRef}>
                <torusGeometry args={[2.5, 0.02, 16, 100]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} />
            </mesh>
        </group>
    )

}

export default function Scene3D() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <Environment preset="city" />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />

      <group position={[1, 0, 0]}>
        <GeometricShape position={[0, 0, 0]} color="#4285F4" />
        <GeometricShape position={[-2, 1.5, -2]} color="#EA4335" />
        <GeometricShape position={[2, -1.5, -1]} color="#FBBC04" />
        <GeometricShape position={[0, 2, -3]} color="#34A853" />
        
        <TorusRing position={[0,0,0]} rotation={[0.5, 0, 0]} color="#ffffff" />
         <TorusRing position={[0,0,0]} rotation={[0, 0.5, 0]} color="#ffffff" />
      </group>
    </>
  );
}
