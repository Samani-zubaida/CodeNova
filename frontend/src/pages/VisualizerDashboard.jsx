import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className={`relative px-6 py-3 font-semibold transition-colors rounded-full ${
        activeTab === id
          ? 'text-white'
          : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
      }`}
    >
      {activeTab === id && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-0 bg-gradient-to-r from-[var(--color-nova-red)] to-[var(--color-nova-brown)] rounded-full -z-10"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        
        {/* Premium Hero Section */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Interactive <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-nova-red)] via-[var(--color-nova-brown)] to-[var(--color-nova-green)]">Visualizers</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Explore dynamic, real-time representations of complex algorithms, data structures, and object-oriented paradigms.
            </p>
          </motion.div>
        </div>

        {/* Glassmorphic Tabs */}
        <div className="flex justify-center mb-16 w-full">
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-inner overflow-x-auto snap-x max-w-full">
            <TabButton id="ds" label="Data Structures" />
            <TabButton id="oop" label="Object-Oriented" />
            <TabButton id="crypto" label="Cryptography" />
          </div>
        </div>

        {/* Content Area with Staggered Entrance */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'ds' && (
              <motion.div 
                key="ds"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <ArrayVisualizer />
                <StringVisualizer />
                <StackQueueVisualizer />
                <LinkedListVisualizer />
                <TreeGraphVisualizer />
                <HeapVisualizer />
                <MapVisualizer />
              </motion.div>
            )}

            {activeTab === 'oop' && (
              <motion.div 
                key="oop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <EncapsulationVisualizer />
                <AbstractionVisualizer />
                <InheritanceVisualizer />
                <PolymorphismVisualizer />
              </motion.div>
            )}

            {activeTab === 'crypto' && (
              <motion.div 
                key="crypto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <CaesarCipherVisualizer />
                <RailFenceVisualizer />
                <ColumnarVisualizer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
