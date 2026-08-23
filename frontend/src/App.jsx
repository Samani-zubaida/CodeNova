import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import VisualizerDashboard from './pages/VisualizerDashboard';

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
            <Route path="/visualizer/array" element={<div className="p-8"><ArrayVisualizer /></div>} />
            <Route path="/visualizer/string" element={<div className="p-8"><StringVisualizer /></div>} />
            <Route path="/visualizer/stack" element={<div className="p-8"><StackVisualizer /></div>} />
            <Route path="/visualizer/queue" element={<div className="p-8"><QueueVisualizer /></div>} />
            <Route path="/visualizer/linkedlist" element={<div className="p-8"><LinkedListVisualizer /></div>} />
            <Route path="/visualizer/tree" element={<div className="p-8"><TreeGraphVisualizer /></div>} />
            <Route path="/visualizer/heap" element={<div className="p-8"><HeapVisualizer /></div>} />
            <Route path="/visualizer/map" element={<div className="p-8"><MapVisualizer /></div>} />

            {/* OOP Routes */}
            <Route path="/visualizer/encapsulation" element={<div className="p-8"><EncapsulationVisualizer /></div>} />
            <Route path="/visualizer/abstraction" element={<div className="p-8"><AbstractionVisualizer /></div>} />
            <Route path="/visualizer/inheritance" element={<div className="p-8"><InheritanceVisualizer /></div>} />
            <Route path="/visualizer/polymorphism" element={<div className="p-8"><PolymorphismVisualizer /></div>} />

            {/* Crypto Routes */}
            <Route path="/visualizer/caesar" element={<div className="p-8"><CaesarCipherVisualizer /></div>} />
            <Route path="/visualizer/railfence" element={<div className="p-8"><RailFenceVisualizer /></div>} />
            <Route path="/visualizer/columnar" element={<div className="p-8"><ColumnarVisualizer /></div>} />

            {/* Placeholder routes for future implementation */}
            <Route path="/sandbox" element={<div className="p-8 text-center"><h1 className="text-3xl">Sandbox (Coming Soon)</h1></div>} />
            <Route path="/game" element={<div className="p-8 text-center"><h1 className="text-3xl">3D Game (Coming Soon)</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
