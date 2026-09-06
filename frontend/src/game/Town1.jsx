import React, { useRef } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Html, Float, Text, Edges } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function Town1({ unlockedLevel, onCityEnter }) {
  const goalRef = useRef();

  useFrame((state) => {
    if (goalRef.current) {
      goalRef.current.rotation.y += 0.02;
      goalRef.current.rotation.x += 0.01;
    }
  });

  const isLevelUnlocked = (id) => unlockedLevel >= id;

  const handleCityCollision = (levelId, title) => (e) => {
    if (e.other.rigidBodyObject?.name === 'player') {
      onCityEnter(levelId, title);
    }
  };

  // Helper to get color based on lock state
  const getColor = (levelId, activeColor, lockedColor = "#222222") => {
    return isLevelUnlocked(levelId) ? activeColor : lockedColor;
  };

  return (
    <group>
      {/* Starting Area */}
      <RigidBody type="fixed" friction={2}>
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <cylinderGeometry args={[5, 5, 1, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
          <Edges linewidth={2} color="#22d3ee" />
        </mesh>
      </RigidBody>

      {/* City 1: Arrays (Level 1) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider 
          args={[2, 2, 2]} 
          position={[0, 1, -10]} 
          sensor 
          onIntersectionEnter={handleCityCollision(1, "Arrays")} 
        />
        <mesh position={[0, 1, -10]} receiveShadow castShadow>
          <boxGeometry args={[4, 1, 4]} />
          <meshStandardMaterial color={getColor(1, "#1e1b4b")} roughness={0.1} metalness={0.8} />
          <Edges linewidth={2} color={getColor(1, "#d946ef", "#555555")} threshold={15} />
        </mesh>
        <Text
          position={[0, 2.5, -10]}
          fontSize={0.5}
          color={getColor(1, "#d946ef", "#555555")}
          anchorX="center"
          anchorY="middle"
        >
          {isLevelUnlocked(1) ? "City 1: Arrays" : "LOCKED"}
        </Text>
      </RigidBody>

      {/* City 2: Linked Lists (Level 2) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider 
          args={[1.5, 2, 1.5]} 
          position={[0, 3, -18]} 
          sensor 
          onIntersectionEnter={handleCityCollision(2, "Linked Lists")} 
        />
        <mesh position={[0, 3, -18]} receiveShadow castShadow>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial color={getColor(2, "#1e1b4b")} roughness={0.1} />
          <Edges linewidth={2} color={getColor(2, "#22d3ee", "#555555")} threshold={15} />
        </mesh>
        <Text
          position={[0, 4.5, -18]}
          fontSize={0.5}
          color={getColor(2, "#22d3ee", "#555555")}
          anchorX="center"
          anchorY="middle"
        >
          {isLevelUnlocked(2) ? "City 2: Linked Lists" : "LOCKED"}
        </Text>
      </RigidBody>
      
      {/* City 3: Stacks & Queues (Level 3) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider 
          args={[1.5, 2, 1.5]} 
          position={[-6, 5, -24]} 
          sensor 
          onIntersectionEnter={handleCityCollision(3, "Stacks & Queues")} 
        />
        <mesh position={[-6, 5, -24]} receiveShadow castShadow>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial color={getColor(3, "#1e1b4b")} />
          <Edges linewidth={2} color={getColor(3, "#22d3ee", "#555555")} threshold={15} />
        </mesh>
        <Text
          position={[-6, 6.5, -24]}
          fontSize={0.5}
          color={getColor(3, "#22d3ee", "#555555")}
          anchorX="center"
          anchorY="middle"
        >
          {isLevelUnlocked(3) ? "City 3: Stacks" : "LOCKED"}
        </Text>
      </RigidBody>

      {/* Gateway to Town 2 (Requires Level 4 to unlock) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider 
          args={[1.5, 1.5, 1.5]} 
          position={[-12, 7, -30]} 
          sensor 
          onIntersectionEnter={handleCityCollision(4, "Town 2: OOP")} 
        />
        <Float speed={2} rotationIntensity={0} floatIntensity={1} floatingRange={[0, 1]}>
          <mesh ref={goalRef} position={[-12, 7, -30]} receiveShadow castShadow>
            <octahedronGeometry args={[2]} />
            <meshStandardMaterial 
              color={getColor(4, "#22d3ee", "#222222")} 
              emissive={getColor(4, "#22d3ee", "#000000")} 
              emissiveIntensity={isLevelUnlocked(4) ? 2 : 0} 
              toneMapped={false} 
            />
          </mesh>
        </Float>
        <Text
          position={[-12, 10, -30]}
          fontSize={0.5}
          color={getColor(4, "#ffffff", "#555555")}
          anchorX="center"
          anchorY="middle"
        >
          {isLevelUnlocked(4) ? "Town 2 Portal" : "Portal Locked"}
        </Text>
      </RigidBody>
    </group>
  );
}
