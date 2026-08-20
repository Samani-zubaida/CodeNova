import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import useAppStore from './store/useAppStore';

function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200 font-sans">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<div className="p-8 text-center"><h1 className="text-4xl font-bold mb-4">Welcome to Code Nova</h1><p className="text-muted-foreground">Select a module from the navigation bar.</p></div>} />
            <Route path="/sandbox" element={<div className="p-8">Sandbox Route</div>} />
            <Route path="/learn/data-structures" element={<div className="p-8">Data Structures Route</div>} />
            <Route path="/game" element={<div className="p-8">3D Game Route</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
