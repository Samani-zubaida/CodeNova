import React, { useState } from 'react';
import DataStructureVisualizer from '../visualizers/DataStructureVisualizer';
import OOPVisualizer from '../visualizers/OOPVisualizer';
import CryptoVisualizer from '../visualizers/CryptoVisualizer';
import PlaybackControls from '../visualizers/PlaybackControls';

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
        <div className="flex justify-center border-b border-gray-200 dark:border-white/10 mb-8">
          <TabButton id="ds" label="Data Structures" />
          <TabButton id="oop" label="Object-Oriented Programming" />
          <TabButton id="crypto" label="Cryptography" />
        </div>

        {/* Content Area */}
        <div className="w-full">
          {activeTab === 'ds' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Data Structures Visualizer</h2>
                <p className="text-gray-500">More data structures (Arrays, Linked Lists, Heaps) coming soon...</p>
              </div>
              <DataStructureVisualizer />
            </div>
          )}

          {activeTab === 'oop' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">OOP Pillars Visualizer</h2>
                <p className="text-gray-500">Encapsulation, Abstraction, and Polymorphism modules coming soon...</p>
              </div>
              <OOPVisualizer />
            </div>
          )}

          {activeTab === 'crypto' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Cryptography Visualizer</h2>
                <p className="text-gray-500">Rail Fence and Simple Columnar Transposition modules coming soon...</p>
              </div>
              <CryptoVisualizer />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
