import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import VisualizerDashboard from './pages/VisualizerDashboard';
import Sandbox from './pages/Sandbox';
import GameWorld from './game/GameWorld';

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
import VigenereCipherVisualizer from './visualizers/crypto/VigenereCipherVisualizer';
import PlayfairCipherVisualizer from './visualizers/crypto/PlayfairCipherVisualizer';
import RailFenceVisualizer from './visualizers/crypto/RailFenceVisualizer';
import ColumnarVisualizer from './visualizers/crypto/ColumnarVisualizer';
import AESVisualizer from './visualizers/crypto/AESVisualizer';
import RSAVIsualizer from './visualizers/crypto/RSAVIsualizer';
import SHA256Visualizer from './visualizers/crypto/SHA256Visualizer';
import DigitalSignatureVisualizer from './visualizers/crypto/DigitalSignatureVisualizer';
import SteganographyVisualizer from './visualizers/crypto/SteganographyVisualizer';
import EnigmaVisualizer from './visualizers/crypto/EnigmaVisualizer';
import HackerModeVisualizer from './visualizers/crypto/HackerModeVisualizer';
import DHVisualizer from './visualizers/crypto/DHVisualizer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        <Navbar />
        
        <main className="pt-16 min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/visualizer" replace />} />
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
            <Route path="/visualizer/caesar" element={<div className="p-8"><CaesarCipherVisualizer /></div>} />
            <Route path="/visualizer/vigenere" element={<div className="p-8"><VigenereCipherVisualizer /></div>} />
            <Route path="/visualizer/playfair" element={<div className="p-8"><PlayfairCipherVisualizer /></div>} />
            <Route path="/visualizer/railfence" element={<div className="p-8"><RailFenceVisualizer /></div>} />
            <Route path="/visualizer/columnar" element={<div className="p-8"><ColumnarVisualizer /></div>} />
            <Route path="/visualizer/aes" element={<div className="p-8"><AESVisualizer /></div>} />
            <Route path="/visualizer/rsa" element={<div className="p-8"><RSAVIsualizer /></div>} />
            <Route path="/visualizer/hash" element={<div className="p-8"><SHA256Visualizer /></div>} />
            <Route path="/visualizer/signature" element={<div className="p-8"><DigitalSignatureVisualizer /></div>} />
            <Route path="/visualizer/steg" element={<div className="p-8"><SteganographyVisualizer /></div>} />
            <Route path="/visualizer/enigma" element={<div className="p-8"><EnigmaVisualizer /></div>} />
            <Route path="/visualizer/hacker" element={<div className="p-8"><HackerModeVisualizer /></div>} />
            <Route path="/visualizer/dh" element={<div className="p-8"><DHVisualizer /></div>} />

            <Route path="/game" element={<GameWorld />} />

            {/* Sandbox */}
            <Route path="/sandbox" element={<Sandbox />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
