import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * VisualizerDashboard - Legacy route component.
 * Route /visualizer is removed and redirected to /oop in App.jsx.
 * If ever mounted directly by any legacy link or import, this component seamlessly redirects to /oop.
 */
export default function VisualizerDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/oop', { replace: true });
  }, [navigate]);

  return null;
}

export { default as Visualizer3DLibrary } from '../visualizers/oop/components/Visualizer3DLibrary';
