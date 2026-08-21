import React, { useState } from 'react';
import PlaybackControls from '../visualizers/PlaybackControls';

// Data Structures
import ArrayVisualizer from '../visualizers/ds/ArrayVisualizer';
import StringVisualizer from '../visualizers/ds/StringVisualizer';
import StackQueueVisualizer from '../visualizers/ds/StackQueueVisualizer';
import LinkedListVisualizer from '../visualizers/ds/LinkedListVisualizer';
import TreeGraphVisualizer from '../visualizers/ds/TreeGraphVisualizer';
import HeapVisualizer from '../visualizers/ds/HeapVisualizer';
import MapVisualizer from '../visualizers/ds/MapVisualizer';

// OOP
import EncapsulationVisualizer from '../visualizers/oop/EncapsulationVisualizer';
import AbstractionVisualizer from '../visualizers/oop/AbstractionVisualizer';
import InheritanceVisualizer from '../visualizers/oop/InheritanceVisualizer';
import PolymorphismVisualizer from '../visualizers/oop/PolymorphismVisualizer';

// Cryptography
import CaesarCipherVisualizer from '../visualizers/crypto/CaesarCipherVisualizer';
import RailFenceVisualizer from '../visualizers/crypto/RailFenceVisualizer';
import ColumnarVisualizer from '../visualizers/crypto/ColumnarVisualizer';

export default function VisualizerDashboard() {
  const [activeTab, setActiveTab] = useState('ds'); // 'ds', 'oop', 'crypto'

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 font-semibold transition-colors border-b-4 ${
        activeTab === id
          ? 'border-[var(--color-nova-red)] text-[var(--color-nova-red)]'
          : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Global Controls Panel */}
      <div className="bg-white/50 dark:bg-black/50 backdrop-blur border-b border-gray-200 dark:border-white/10 p-4">
        <PlaybackControls />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        
        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-200 dark:border-white/10 mb-12">
          <TabButton id="ds" label="Data Structures" />
          <TabButton id="oop" label="Object-Oriented Programming" />
          <TabButton id="crypto" label="Cryptography" />
        </div>

        {/* Content Area */}
        <div className="w-full">
          {activeTab === 'ds' && (
            <div className="space-y-16">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">Data Structures Visualizer</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Interactive modules showing memory allocation, pointers, hierarchies, and algorithmic concepts behind standard data structures.</p>
              </div>
              <ArrayVisualizer />
              <StringVisualizer />
              <StackQueueVisualizer />
              <LinkedListVisualizer />
              <TreeGraphVisualizer />
              <HeapVisualizer />
              <MapVisualizer />
            </div>
          )}

          {activeTab === 'oop' && (
            <div className="space-y-16">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">OOP Pillars Visualizer</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Visualizing the four foundational pillars of Object-Oriented Programming.</p>
              </div>
              <EncapsulationVisualizer />
              <AbstractionVisualizer />
              <InheritanceVisualizer />
              <PolymorphismVisualizer />
            </div>
          )}

          {activeTab === 'crypto' && (
            <div className="space-y-16">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">Cryptography Visualizer</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Interactive ciphers demonstrating basic cryptographic data transformations and shifts.</p>
              </div>
              <CaesarCipherVisualizer />
              <RailFenceVisualizer />
              <ColumnarVisualizer />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
