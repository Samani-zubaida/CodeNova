import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Visualizer3DLibrary from '../visualizers/oop/components/Visualizer3DLibrary';

/**
 * VisualizerDashboard - Legacy route component.
 * Route /visualizer is redirected to /oop in App.jsx.
 * If ever mounted directly by any legacy link or import, this component seamlessly redirects to /oop,
 * and re-exports Visualizer3DLibrary.
 */
export default function VisualizerDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/oop', { replace: true });
  }, [navigate]);

  return null;
}

export { Visualizer3DLibrary };
