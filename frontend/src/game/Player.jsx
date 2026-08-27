import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import * as THREE from 'three';

const SPEED = 5;
const JUMP_FORCE = 8;

export default function Player({ position }) {
  const bodyRef = useRef();
  const { rapier, world } = useRapier();
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false, space: false });

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === ' ') setKeys(k => ({ ...k, space: true }));
      else if (keys.hasOwnProperty(key)) setKeys(k => ({ ...k, [key]: true }));
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === ' ') setKeys(k => ({ ...k, space: false }));
      else if (keys.hasOwnProperty(key)) setKeys(k => ({ ...k, [key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state) => {
    if (!bodyRef.current) return;

    const velocity = bodyRef.current.linvel();
    const translation = bodyRef.current.translation();
    
    // Update camera to follow player (3rd person)
    state.camera.position.set(translation.x, translation.y + 4, translation.z + 8);
    state.camera.lookAt(translation.x, translation.y, translation.z);

    // Movement logic
    const moveDir = new THREE.Vector3(0, 0, 0);
    if (keys.w) moveDir.z -= 1;
    if (keys.s) moveDir.z += 1;
    if (keys.a) moveDir.x -= 1;
    if (keys.d) moveDir.x += 1;
    moveDir.normalize().multiplyScalar(SPEED);

    bodyRef.current.setLinvel({ x: moveDir.x, y: velocity.y, z: moveDir.z }, true);

    // Jump logic
    if (keys.space) {
      // Basic raycast to check if grounded
      const rayOrigin = { x: translation.x, y: translation.y - 1.1, z: translation.z };
      const rayDir = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(rayOrigin, rayDir);
      const hit = world.castRay(ray, 0.2, true);
      
      if (hit && hit.toi < 0.2) {
        bodyRef.current.setLinvel({ x: velocity.x, y: JUMP_FORCE, z: velocity.z }, true);
      }
    }
  });

  return (
    <RigidBody 
      ref={bodyRef} 
      colliders={false} 
      mass={1} 
      type="dynamic" 
      position={position} 
      enabledRotations={[false, false, false]} 
      name="player"
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
}
