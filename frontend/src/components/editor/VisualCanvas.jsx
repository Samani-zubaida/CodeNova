import React, { useState, useEffect } from 'react';
import { Network, Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import D3Engine from './D3Engine';

const VisualCanvas = ({ data, isVisualizing }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play logic
  useEffect(() => {
    let interval;
    if (isPlaying && data && currentStep < data.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500); // 1.5 seconds per step for clarity
    } else if (currentStep >= (data?.length || 0) - 1) {
      setIsPlaying(false);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, data]);

  // Reset when new data arrives
  useEffect(() => {
    if (data && data.length > 0) {
      setCurrentStep(0);
      setIsPlaying(true);
    }
  }, [data]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    if (data && currentStep < data.length - 1) {
      setCurrentStep(prev => prev + 1);
      setIsPlaying(false);
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsPlaying(false);
    }
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="h-full w-full glass-card p-4 overflow-hidden flex flex-col relative group shadow-lg">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[var(--color-nova-red)]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[var(--color-nova-red)]/20 transition-all duration-700" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[var(--color-nova-green)]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[var(--color-nova-green)]/20 transition-all duration-700" />
      
      <div className="flex items-center gap-2 mb-2 relative z-10 pb-3 border-b border-black/5 dark:border-white/5">
        <div className="p-1.5 bg-gradient-to-br from-[var(--color-nova-red)] to-[var(--color-nova-brown)] rounded-lg shadow-sm shadow-[var(--color-nova-red)]/20">
          <Network size={16} className="text-white" />
        </div>
        <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 flex-1">
          Neural Visualizer
        </h3>
        
        {/* Step Indicator */}
        {data && data.length > 0 && (
          <div className="text-xs font-medium text-gray-500 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md">
            Step {currentStep + 1} / {data.length}
          </div>
        )}
      </div>

      {isVisualizing ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[var(--color-nova-red)]/20 border-t-[var(--color-nova-red)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[var(--color-nova-brown)]/20 border-b-[var(--color-nova-brown)] rounded-full animate-spin-reverse" />
            </div>
          </div>
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 animate-pulse tracking-widest uppercase">
            Mapping Syntax Tree...
          </p>
        </div>
      ) : data && data.length > 0 ? (
        <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
          {/* Main D3 Visualization Area */}
          <div className="flex-1 w-full bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 backdrop-blur-sm overflow-hidden">
             <D3Engine stepData={data[currentStep]} />
          </div>
          
          {/* Playback Controls */}
          <div className="mt-4 flex items-center justify-center gap-3">
             <button 
               onClick={handleReset} 
               className="p-2 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
               title="Reset"
             >
               <RotateCcw size={16} />
             </button>
             
             <button 
               onClick={handlePrev} 
               disabled={currentStep === 0}
               className="p-2 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all disabled:opacity-30"
               title="Previous Step"
             >
               <SkipBack size={18} />
             </button>
             
             <button 
               onClick={handlePlayPause} 
               className="p-3 rounded-full bg-gradient-to-r from-[var(--color-nova-red)] to-[var(--color-nova-brown)] text-white shadow-md shadow-[var(--color-nova-red)]/30 hover:shadow-[var(--color-nova-red)]/50 transition-all transform hover:scale-105 active:scale-95"
               title={isPlaying ? "Pause" : "Play"}
             >
               {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
             </button>
             
             <button 
               onClick={handleNext} 
               disabled={currentStep >= data.length - 1}
               className="p-2 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all disabled:opacity-30"
               title="Next Step"
             >
               <SkipForward size={18} />
             </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
          <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-[var(--color-nova-red)]/10 to-[var(--color-nova-wheat)]/20 flex items-center justify-center">
            <Network size={24} className="text-[var(--color-nova-red)]/50" />
          </div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Awaiting Code Input</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
            Write your logic in the editor and click <span className="font-semibold text-[var(--color-nova-red)]">Visualize</span> to generate an interactive 3D execution map of your algorithms.
          </p>
        </div>
      )}
    </div>
  );
};

export default VisualCanvas;
