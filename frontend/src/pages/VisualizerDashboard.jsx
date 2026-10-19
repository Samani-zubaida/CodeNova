import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Visualizer3DLibrary from '../visualizers/oop/components/Visualizer3DLibrary';

/**
 * VisualizerDashboard - Dedicated 3D Library Room component (/visualizer).
 * Hosts the Three.js 3D Library with interactive bookshelves for DSA, OOP, Cryptography, and Sandbox.
 */
export default function VisualizerDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cat = searchParams.get('cat') || searchParams.get('category');

  useEffect(() => {
    if (cat === 'crypto' || cat === 'cryptography') {
      navigate('/visualizer/crypto', { replace: true });
    } else if (cat === 'oop' || cat === 'oops') {
      navigate('/oop', { replace: true });
    }
  }, [cat, navigate]);

  return <Visualizer3DLibrary onExitToPillars={() => navigate('/oop')} />;
}

export { Visualizer3DLibrary };

