import React from 'react';
import DataStructureVisualizer from './visualizers/DataStructureVisualizer';
import OOPVisualizer from './visualizers/OOPVisualizer';
import CryptoVisualizer from './visualizers/CryptoVisualizer';
import PlaybackControls from './visualizers/PlaybackControls';

function App() {
  return (
    <div className="min-h-screen bg-black/5 p-8 dark:bg-black/90">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[var(--color-nova-red)] to-[var(--color-nova-brown)] bg-clip-text text-transparent mb-2">
          Code Nova Visualizers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Phase 1: Foundation & Curated Modules</p>
      </header>

      <div className="max-w-6xl mx-auto space-y-16 pb-24">
        
        {/* Playback Controls (Global) */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Global State</h2>
          </div>
          <PlaybackControls />
        </section>

        {/* Data Structures Visualizer */}
        <section>
          <div className="mb-6 border-l-4 border-[var(--color-nova-red)] pl-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Data Structures</h2>
            <p className="text-gray-500 text-sm mt-1">Interactive nodes rendered with React Flow</p>
          </div>
          <DataStructureVisualizer />
        </section>

        {/* OOP Visualizer */}
        <section>
          <div className="mb-6 border-l-4 border-[var(--color-nova-brown)] pl-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Object-Oriented Programming</h2>
            <p className="text-gray-500 text-sm mt-1">Inheritance transitions rendered with Framer Motion</p>
          </div>
          <OOPVisualizer />
        </section>

        {/* Cryptography Visualizer */}
        <section>
          <div className="mb-6 border-l-4 border-[var(--color-nova-green)] pl-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Cryptography</h2>
            <p className="text-gray-500 text-sm mt-1">Interactive Cipher Shift rendered with Framer Motion</p>
          </div>
          <CryptoVisualizer />
        </section>
        
      </div>
    </div>
  );
}

export default App;
