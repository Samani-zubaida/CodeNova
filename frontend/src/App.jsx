import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import VisualizerDashboard from './pages/VisualizerDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/visualizer" replace />} />
            <Route path="/visualizer" element={<VisualizerDashboard />} />
            
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
