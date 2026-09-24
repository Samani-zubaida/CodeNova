import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward, Volume2, VolumeX } from 'lucide-react';

/**
 * Universal playback controller for all Algoverse visualizers.
 * Provides play, pause, step forward, step backward, reset, speed tuning (down to 0.25x for thorough dry runs),
 * and an integrated AI Voice Narration toggle.
 */
export default function VisualizerPlaybackBar({
  isPlaying = false,
  onPlay,
  onPause,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onStepBack,
  onReset,
  speed = 1,
  onSpeedChange,
  currentStep = 0,
  totalSteps = 1,
  stepDescription = '',
  disabled = false,
  isVoiceEnabled = false,
  onToggleVoice = null,
  className = ''
}) {
  const handlePlayToggle = () => {
    if (onPlayPause) return onPlayPause();
    if (isPlaying) {
      if (onPause) onPause();
    } else {
      if (onPlay) onPlay();
    }
  };

  const handleStepBackAction = onStepBackward || onStepBack;

  // Slower speed options down to 0.25x for relaxed dry-run analysis
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  const progressPercent = totalSteps > 0 
    ? Math.min(100, Math.max(0, Math.round((currentStep / Math.max(1, totalSteps - 1)) * 100)))
    : 0;

  return (
    <div className={`w-full bg-white/95 dark:bg-[#423834]/95 backdrop-blur-md border border-[#EBE0D3] dark:border-[#2E2E2E] rounded-2xl p-3 md:p-4 shadow-lg flex flex-col gap-2.5 transition-all duration-300 ${className}`}>
      
      {/* Top Row: Current Step Description & Controls */}
      <div className="flex flex-wrap items-center justify-between text-xs gap-2.5">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="shrink-0 px-2 py-0.5 rounded-full font-bold font-mono text-[10px] bg-[#AB526B]/10 text-[#AB526B] dark:bg-[#AB526B]/20 border border-[#AB526B]/30">
            STEP {currentStep + 1}/{Math.max(1, totalSteps)}
          </span>
          <span className="truncate font-medium text-gray-700 dark:text-[#F0E2A4] text-xs" title={stepDescription}>
            {stepDescription || 'Ready to execute'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Voice Narration Toggle (if supported) */}
          {onToggleVoice && (
            <button
              onClick={onToggleVoice}
              disabled={disabled}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                isVoiceEnabled
                  ? 'bg-amber-500/20 border-amber-400 text-amber-500 dark:text-amber-300 shadow-sm'
                  : 'bg-gray-100 dark:bg-[#331921] border-gray-200 dark:border-[#5C4E49] text-gray-500 dark:text-[#BCA297] hover:text-gray-900 dark:hover:text-white'
              }`}
              title={isVoiceEnabled ? "Voice Narration Active (Click to mute speech)" : "Enable AI Voice Narration (Dry run spoken aloud)"}
            >
              {isVoiceEnabled ? (
                <>
                  <Volume2 size={13} className="text-amber-500 dark:text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">Voice: ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} />
                  <span className="hidden sm:inline">Voice: OFF</span>
                </>
              )}
            </button>
          )}

          {/* Speed Selector (supports slow 0.25x, 0.5x) */}
          {onSpeedChange && (
            <div className="flex items-center gap-1 shrink-0 bg-gray-100 dark:bg-[#331921] px-2 py-1 rounded-lg border border-gray-200 dark:border-[#5C4E49]">
              <FastForward size={12} className="text-gray-500 dark:text-[#BCA297]" />
              <select
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                disabled={disabled}
                className="bg-transparent text-[11px] font-bold text-gray-700 dark:text-[#F0E2A4] outline-none cursor-pointer"
                title="Playback Speed (Choose 0.25x or 0.5x to slow down)"
              >
                {speedOptions.map((s) => (
                  <option key={s} value={s} className="bg-white dark:bg-[#423834] text-gray-900 dark:text-[#F4EBC3]">
                    {s}x {s <= 0.5 ? '(Slow)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-gray-200 dark:bg-[#331921] h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#AB526B] to-[#D3DFC8] transition-all duration-200 rounded-full"
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
          className="p-2 rounded-xl text-gray-600 dark:text-[#BCA297] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RotateCcw size={16} />
        </button>

        {/* Center Controller Pill */}
        <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-[#423834] p-1 rounded-2xl border border-gray-200/80 dark:border-[#5C4E49]">
          {/* Step Backward */}
          <button
            onClick={handleStepBackAction}
            disabled={disabled || currentStep <= 0 || isPlaying}
            title="Step Backward"
            className="p-2 rounded-xl text-gray-700 dark:text-[#F0E2A4] hover:bg-white dark:hover:bg-[#5C4E49] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
          >
            <SkipBack size={16} />
          </button>

          {/* Primary Play / Pause Button */}
          <button
            onClick={handlePlayToggle}
            disabled={disabled}
            title={isPlaying ? 'Pause' : 'Play Simulation'}
            className="px-5 py-2 rounded-xl font-bold text-white bg-[#AB526B] hover:bg-[#8E3B53] active:scale-95 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="p-2 rounded-xl text-gray-700 dark:text-[#F0E2A4] hover:bg-white dark:hover:bg-[#5C4E49] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
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
