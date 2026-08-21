import React, { useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function PlaybackControls() {
  const { isPlayingVisualizer, setPlayingVisualizer } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const togglePlay = () => {
    setPlayingVisualizer(!isPlayingVisualizer);
  };

  const handleProgressChange = (e) => {
    setProgress(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg w-full max-w-md mx-auto my-4 dark:bg-black/40">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-nova-red)]">Visualizer Controls</h3>
        <span className="text-xs text-gray-500 font-mono">Speed: {speed}x</span>
      </div>
      
      {/* Playback Buttons */}
      <div className="flex justify-center items-center gap-6">
        <button className="p-2 rounded-full hover:bg-[var(--color-nova-wheat)] hover:text-black transition-colors" title="Reset">
          <RotateCcw size={20} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-4 rounded-full bg-[var(--color-nova-red)] text-white hover:bg-[var(--color-nova-brown)] transition-colors shadow-md flex items-center justify-center"
        >
          {isPlayingVisualizer ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        <button className="p-2 rounded-full hover:bg-[var(--color-nova-wheat)] hover:text-black transition-colors" title="Step Forward">
          <SkipForward size={20} />
        </button>
      </div>

      {/* Progress Slider */}
      <div className="flex flex-col gap-1 mt-2">
        <label className="text-xs text-gray-500 flex justify-between">
          <span>Progress</span>
          <span>{progress}%</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-nova-red)]"
        />
      </div>
    </div>
  );
}
