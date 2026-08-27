import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky, Environment } from '@react-three/drei';
import Player from './Player';
import Town1 from './Town1';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function GameWorld() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen relative bg-black">
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <button 
          onClick={() => navigate('/visualizer')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800 text-white rounded-lg backdrop-blur-sm transition-colors border border-gray-700"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <div className="px-4 py-2 bg-gray-900/80 text-white rounded-lg backdrop-blur-sm border border-gray-700">
          <span className="font-bold text-[#C5CEAE]">Town 1:</span> Data Structures
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-10 text-white/50 text-sm pointer-events-none">
        WASD to move • SPACE to jump • Mouse to look around
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />
          
          <ambientLight intensity={0.3} />
          <directionalLight
            castShadow
            position={[10, 20, 10]}
            intensity={1.5}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <Physics timeStep="vary">
            <Player position={[0, 5, 0]} />
            <Town1 />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
