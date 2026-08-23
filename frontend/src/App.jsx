import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import VisualizerDashboard from './pages/VisualizerDashboard';
import Sandbox from './pages/Sandbox';

// Data Structures
import ArrayVisualizer from './visualizers/ds/ArrayVisualizer';
import StringVisualizer from './visualizers/ds/StringVisualizer';
import StackVisualizer from './visualizers/ds/StackVisualizer';
import QueueVisualizer from './visualizers/ds/QueueVisualizer';
import LinkedListVisualizer from './visualizers/ds/LinkedListVisualizer';
import TreeGraphVisualizer from './visualizers/ds/TreeGraphVisualizer';
import HeapVisualizer from './visualizers/ds/HeapVisualizer';
import MapVisualizer from './visualizers/ds/MapVisualizer';

// OOP
import EncapsulationVisualizer from './visualizers/oop/EncapsulationVisualizer';
import AbstractionVisualizer from './visualizers/oop/AbstractionVisualizer';
import InheritanceVisualizer from './visualizers/oop/InheritanceVisualizer';
import PolymorphismVisualizer from './visualizers/oop/PolymorphismVisualizer';

// Cryptography
import CaesarCipherVisualizer from './visualizers/crypto/CaesarCipherVisualizer';
import RailFenceVisualizer from './visualizers/crypto/RailFenceVisualizer';
import ColumnarVisualizer from './visualizers/crypto/ColumnarVisualizer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        <Navbar />
        
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/visualizer" replace />} />
            
            {/* Dashboard Menu */}
            <Route path="/visualizer" element={<VisualizerDashboard />} />
            
            {/* DS Routes */}
            <Route path="/visualizer/array" element={<ArrayVisualizer />} />
            <Route path="/visualizer/string" element={<StringVisualizer />} />
            <Route path="/visualizer/stack" element={<StackVisualizer />} />
            <Route path="/visualizer/queue" element={<QueueVisualizer />} />
            <Route path="/visualizer/linkedlist" element={<LinkedListVisualizer />} />
            <Route path="/visualizer/tree" element={<TreeGraphVisualizer />} />
            <Route path="/visualizer/heap" element={<HeapVisualizer />} />
            <Route path="/visualizer/map" element={<MapVisualizer />} />

            {/* OOP Routes */}
            <Route path="/visualizer/encapsulation" element={<EncapsulationVisualizer />} />
            <Route path="/visualizer/abstraction" element={<AbstractionVisualizer />} />
            <Route path="/visualizer/inheritance" element={<InheritanceVisualizer />} />
            <Route path="/visualizer/polymorphism" element={<PolymorphismVisualizer />} />

            {/* Crypto Routes */}
            <Route path="/visualizer/caesar" element={<CaesarCipherVisualizer />} />
            <Route path="/visualizer/railfence" element={<RailFenceVisualizer />} />
            <Route path="/visualizer/columnar" element={<ColumnarVisualizer />} />

            {/* Sandbox */}
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/game" element={<div className="p-8 text-center"><h1 className="text-3xl">3D Game (Coming Soon)</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
