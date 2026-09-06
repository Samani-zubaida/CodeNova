import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward, Sliders } from 'lucide-react';

/**
 * Universal playback controller for all Algoverse visualizers.
 * Provides play, pause, step forward, step backward, reset, and speed tuning.
 */
export default function VisualizerPlaybackBar({
  isPlaying = false,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  speed = 1,
  onSpeedChange,
  currentStep = 0,
  totalSteps = 1,
  stepDescription = '',
  disabled = false,
  className = ''
}) {
  const speedOptions = [0.5, 1, 1.5, 2, 3];

  const progressPercent = totalSteps > 0 
    ? Math.min(100, Math.max(0, Math.round((currentStep / Math.max(1, totalSteps - 1)) * 100)))
    : 0;

  return (
    <div className={`w-full bg-white/95 dark:bg-[#161616]/95 backdrop-blur-md border border-[#EBE0D3] dark:border-[#2E2E2E] rounded-2xl p-3 md:p-4 shadow-lg flex flex-col gap-2.5 transition-all duration-300 ${className}`}>
      
      {/* Top Row: Current Step Description & Progress Meter */}
      <div className="flex items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="shrink-0 px-2 py-0.5 rounded-full font-bold font-mono text-[10px] bg-[#BC4A54]/10 text-[#BC4A54] dark:bg-[#BC4A54]/20 border border-[#BC4A54]/30">
            STEP {currentStep + 1}/{Math.max(1, totalSteps)}
          </span>
          <span className="truncate font-medium text-gray-700 dark:text-gray-300 text-xs" title={stepDescription}>
            {stepDescription || 'Ready to execute'}
          </span>
        </div>

        {/* Speed Selector */}
        {onSpeedChange && (
          <div className="flex items-center gap-1 shrink-0 bg-gray-100 dark:bg-[#222] px-2 py-1 rounded-lg border border-gray-200 dark:border-[#333]">
            <FastForward size={12} className="text-gray-500 dark:text-gray-400" />
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              disabled={disabled}
              className="bg-transparent text-[11px] font-bold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
            >
              {speedOptions.map((s) => (
                <option key={s} value={s} className="bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-gray-100">
                  {s}x
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="w-full bg-gray-200 dark:bg-[#252525] h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#BC4A54] to-[#D3DFC8] transition-all duration-200 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Bottom Row: Core Action Controls */}
      <div className="flex items-center justify-between pt-1">
        {/* Reset */}
        <button
          onClick={onReset}
          disabled={disabled || (currentStep === 0 && !isPlaying)}
          title="Reset to Start"
          className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RotateCcw size={16} />
        </button>

        {/* Center Controller Pill */}
        <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-[#202020] p-1 rounded-2xl border border-gray-200/80 dark:border-[#333]">
          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={disabled || currentStep <= 0 || isPlaying}
            title="Step Backward"
            className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#2a2a2a] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
          >
            <SkipBack size={16} />
          </button>

          {/* Primary Play / Pause Button */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={disabled}
            title={isPlaying ? 'Pause' : 'Play Simulation'}
            className="px-5 py-2 rounded-xl font-bold text-white bg-[#BC4A54] hover:bg-[#a63d46] active:scale-95 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <>
                <Pause size={16} className="fill-white" />
                <span className="text-xs tracking-wider uppercase">Pause</span>
              </>
            ) : (
              <>
                <Play size={16} className="fill-white" />
                <span className="text-xs tracking-wider uppercase">Play</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={disabled || currentStep >= totalSteps - 1 || isPlaying}
            title="Step Forward"
            className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#2a2a2a] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Mini Step Indicator Indicator Badge */}
        <div className="text-[11px] font-mono text-gray-400 font-semibold min-w-[40px] text-right">
          {progressPercent}%
        </div>
      </div>

    </div>
  );
}
