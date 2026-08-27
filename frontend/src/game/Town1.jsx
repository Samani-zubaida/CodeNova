import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { updateGameScore, unlockTown } from '../lib/api';

export default function Town1() {
  const handleGoalCollision = async (e) => {
    // Only trigger once or debounce if needed
    if (e.other.rigidBodyObject?.name === 'player') {
      try {
        console.log("Goal Reached! Unlocking Town 2...");
        await updateGameScore(100);
        await unlockTown(2);
        alert('?? Data Structures Mastery Complete! Town 2 Unlocked!');
        // Ideally navigate to a victory screen or town select
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    }
  };

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" friction={2}>
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[50, 1, 50]} />
          <meshStandardMaterial color="#BCA297" />
        </mesh>
      </RigidBody>

      {/* Array Platform (Step 1) */}
      <RigidBody type="fixed">
        <mesh position={[0, 1, -10]} receiveShadow castShadow>
          <boxGeometry args={[4, 2, 4]} />
          <meshStandardMaterial color="#AB526B" />
        </mesh>
      </RigidBody>

      {/* Linked List Platforms */}
      <RigidBody type="fixed">
        <mesh position={[0, 3, -16]} receiveShadow castShadow>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial color="#C5CEAE" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed">
        <mesh position={[-5, 5, -20]} receiveShadow castShadow>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial color="#C5CEAE" />
        </mesh>
      </RigidBody>

      {/* Goal Block */}
      <RigidBody type="fixed" colliders={false} name="goal">
        <CuboidCollider 
          args={[1.5, 1.5, 1.5]} 
          position={[-10, 7, -25]} 
          sensor 
          onIntersectionEnter={handleGoalCollision} 
        />
        <mesh position={[-10, 7, -25]} receiveShadow castShadow>
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color="#F0E2A4" emissive="#F0E2A4" emissiveIntensity={0.5} />
        </mesh>
      </RigidBody>
    </group>
  );
}
