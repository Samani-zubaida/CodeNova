import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import VisualizerDashboard from './pages/VisualizerDashboard';
import Sandbox from './pages/Sandbox';
import GameWorld from './game/GameWorld';
import HostDashboard from './game/HostDashboard';
import Home from './pages/Home';
import Intro from './pages/Intro';
import Auth from './pages/Auth';
import useAppStore from './store/useAppStore';

// Data Structures
import ArrayHub from './visualizers/ds/ArrayHub';
import Array3DVisualizer from './visualizers/ds/Array3DVisualizer';
import StringHub from './visualizers/ds/StringHub';
import StringVisualizer from './visualizers/ds/StringVisualizer';
import StackHub from './visualizers/ds/StackHub';
import StackVisualizer from './visualizers/ds/StackVisualizer';
import QueueHub from './visualizers/ds/QueueHub';
import QueueVisualizer from './visualizers/ds/QueueVisualizer';
import LinkedListHub from './visualizers/ds/LinkedListHub';
import LinkedListVisualizer from './visualizers/ds/LinkedListVisualizer';
import TreeHub from './visualizers/ds/TreeHub';
import TreeGraphVisualizer from './visualizers/ds/TreeGraphVisualizer';
import GraphHub from './visualizers/ds/GraphHub';
import GraphVisualizer from './visualizers/ds/GraphVisualizer';
import HeapVisualizer from './visualizers/ds/HeapVisualizer';
import MapVisualizer from './visualizers/ds/MapVisualizer';

// OOP & Cryptography Studios
import OopHub from './visualizers/oop/OopHub';
import CryptoHub from './visualizers/crypto/CryptoHub';

const PrivateRoute = ({ children }) => {
  const user = useAppStore(state => state.user);
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isIntro = location.pathname === '/intro';
  const isVisualizerHub = location.pathname === '/visualizer';
  const isFullscreen = isHome || isIntro || isVisualizerHub;
  const { theme } = useAppStore();

  React.useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('dark', 'warm');
    body.classList.remove('dark', 'warm');
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else if (theme === 'warm') {
      root.classList.add('warm');
      body.classList.add('warm');
    }
  }, [theme]);

  const themeClass = theme === 'dark' 
    ? 'dark bg-[#331921] text-[#F4EBC3]' 
    : theme === 'warm' 
    ? 'warm bg-[#F4EBC3] text-[#2D1F23]' 
    : 'bg-[#FAF7F2] text-[#2D1F23]';

  return (
    <div className={isFullscreen ? '' : `min-h-screen ${themeClass} font-sans transition-colors duration-300`}>
      {!isFullscreen && <Navbar />}
      
      <main className={isFullscreen ? '' : 'pt-16 min-h-screen'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/visualizer" element={<VisualizerDashboard />} />
          
          {/* DS Routes */}
          <Route path="/visualizer/array" element={<ArrayHub />} />
          <Route path="/visualizer/array/:algoId" element={<Array3DVisualizer />} />
          <Route path="/visualizer/graph" element={<GraphHub />} />
          <Route path="/visualizer/graph/:algoId" element={<GraphVisualizer />} />
          <Route path="/visualizer/linkedlist" element={<LinkedListHub />} />
          <Route path="/visualizer/linkedlist/:algoId" element={<LinkedListVisualizer />} />
          <Route path="/visualizer/string" element={<StringHub />} />
          <Route path="/visualizer/string/:algoId" element={<StringVisualizer />} />
          <Route path="/visualizer/tree" element={<TreeHub />} />
          <Route path="/visualizer/tree/:algoId" element={<TreeGraphVisualizer />} />
          <Route path="/visualizer/stack" element={<StackHub />} />
          <Route path="/visualizer/stack/:algoId" element={<StackVisualizer />} />
          <Route path="/visualizer/queue" element={<QueueHub />} />
          <Route path="/visualizer/queue/:algoId" element={<QueueVisualizer />} />
          <Route path="/visualizer/heap" element={<HeapVisualizer />} />
          <Route path="/visualizer/map" element={<MapVisualizer />} />

          {/* OOP Routes */}
          <Route path="/visualizer/oop" element={<OopHub />} />
          <Route path="/visualizer/oops" element={<OopHub />} />
          <Route path="/visualizer/encapsulation" element={<OopHub defaultConcept="encapsulation" />} />
          <Route path="/visualizer/abstraction" element={<OopHub defaultConcept="abstraction" />} />
          <Route path="/visualizer/inheritance" element={<OopHub defaultConcept="inheritance" />} />
          <Route path="/visualizer/polymorphism" element={<OopHub defaultConcept="polymorphism" />} />

          {/* Crypto Routes */}
          <Route path="/visualizer/crypto" element={<CryptoHub />} />
          <Route path="/visualizer/crypto/:algoId" element={<CryptoHub />} />
          <Route path="/visualizer/cryptography" element={<CryptoHub />} />
          <Route path="/visualizer/caesar" element={<CryptoHub defaultAlgo="caesar" />} />
          <Route path="/visualizer/vigenere" element={<CryptoHub defaultAlgo="vigenere" />} />
          <Route path="/visualizer/playfair" element={<CryptoHub defaultAlgo="playfair" />} />
          <Route path="/visualizer/railfence" element={<CryptoHub defaultAlgo="railfence" />} />
          <Route path="/visualizer/columnar" element={<CryptoHub defaultAlgo="columnar" />} />
          <Route path="/visualizer/aes" element={<CryptoHub defaultAlgo="aes" />} />
          <Route path="/visualizer/rsa" element={<CryptoHub defaultAlgo="rsa" />} />
          <Route path="/visualizer/hash" element={<CryptoHub defaultAlgo="hash" />} />
          <Route path="/visualizer/signature" element={<CryptoHub defaultAlgo="signature" />} />
          <Route path="/visualizer/steg" element={<CryptoHub defaultAlgo="steg" />} />
          <Route path="/visualizer/enigma" element={<CryptoHub defaultAlgo="enigma" />} />
          <Route path="/visualizer/hacker" element={<CryptoHub defaultAlgo="hacker" />} />
          <Route path="/visualizer/dh" element={<CryptoHub defaultAlgo="dh" />} />

          {/* Game Routes */}
          <Route path="/game" element={<GameWorld />} />
          <Route path="/host" element={<HostDashboard />} />

          {/* Sandbox */}
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
