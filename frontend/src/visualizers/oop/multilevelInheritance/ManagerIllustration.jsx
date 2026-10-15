import React from 'react';
import { motion } from 'framer-motion';
import useAppStore from '../../../store/useAppStore';

/**
 * ManagerIllustration - 2.5D Executive Team Leader Avatar
 * Visualizes the final child class: Manager (teamSize, conductMeeting())
 */
export const ManagerIllustration = ({
  isActive = false,
  isDimmed = false,
  highlightedMember = null,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const strokeColor = isDark ? '#C084FC' : isWarm ? '#9333EA' : '#7E22CE';
  const accentGlow = isDark ? 'rgba(192, 132, 252, 0.45)' : isWarm ? 'rgba(147, 51, 234, 0.3)' : 'rgba(126, 34, 206, 0.25)';
  const bodyGradStart = isDark ? '#1C122C' : isWarm ? '#FDFBF7' : '#FAF5FF';
  const bodyGradEnd = isDark ? '#2E1065' : isWarm ? '#F3E8FF' : '#E9D5FF';
  const leaderGold = isDark ? '#F472B6' : isWarm ? '#D97706' : '#C026D3';

  return (
    <div className={`relative w-28 sm:w-36 h-24 sm:h-28 flex items-center justify-center transition-all duration-500 ${
      isDimmed ? 'opacity-40 grayscale-[35%]' : 'opacity-100'
    }`}>
      {/* Ambient Pulsing Backlight */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.12, 1] : 1,
          opacity: isActive ? [0.45, 0.75, 0.45] : 0.25,
        }}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        className="absolute w-32 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: accentGlow }}
      />

      {/* 2.5D Isometric Manager Silhouette with Executive Crest & Analytics Holo-Chart */}
      <svg
        viewBox="0 0 160 140"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mgrBustGrad" x1="20" y1="40" x2="140" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={bodyGradStart} stopOpacity="0.95" />
            <stop offset="100%" stopColor={bodyGradEnd} stopOpacity="0.9" />
          </linearGradient>

          <filter id="mgrGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Isometric Base Pedestal */}
        <polygon
          points="80,118 135,98 80,78 25,98"
          fill={isDark ? '#140D24' : isWarm ? '#FAF5FF' : '#E2E8F0'}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeOpacity={isDark ? 0.6 : 0.8}
        />
        <polygon
          points="25,98 80,118 80,126 25,106"
          fill={isDark ? '#0D0818' : isWarm ? '#E9D5FF' : '#CBD5E1'}
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <polygon
          points="80,118 135,98 135,106 80,126"
          fill={isDark ? '#110B1F' : isWarm ? '#E9D5FF' : '#94A3B8'}
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Torso with Executive Blazer */}
        <path
          d="M44,95 C44,76 60,68 80,68 C100,68 116,76 116,95 L116,105 L44,105 Z"
          fill="url(#mgrBustGrad)"
          stroke={strokeColor}
          strokeWidth="1.8"
        />

        {/* Blazer Lapels */}
        <path
          d="M66,68 L80,94 L94,68"
          stroke={leaderGold}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Executive Leadership Tie */}
        <polygon
          points="80,76 83,80 81,96 79,96 77,80"
          fill={leaderGold}
        />

        {/* Head Contour */}
        <circle
          cx="80"
          cy="44"
          r="18"
          fill="url(#mgrBustGrad)"
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Executive Star / Leadership Pin atop Lapel */}
        <g transform="translate(68, 78)">
          <circle cx="3" cy="3" r="3" fill={leaderGold} filter="url(#mgrGlow)" />
          <circle cx="3" cy="3" r="1.5" fill="#FFFFFF" />
        </g>

        {/* Floating Holographic Team Growth Chart on Right */}
        <g transform="translate(118, 52)">
          <rect
            width="26"
            height="22"
            rx="4"
            fill={isDark ? '#2E1065' : '#FAF5FF'}
            fillOpacity="0.85"
            stroke={leaderGold}
            strokeWidth="1"
          />
          {/* Mini Bar Chart representing Team Analytics */}
          <line x1="4" y1="18" x2="22" y2="18" stroke={strokeColor} strokeWidth="1" />
          <rect x="6" y="12" width="3" height="6" fill={strokeColor} rx="0.5" />
          <rect x="11" y="8" width="3" height="10" fill={strokeColor} rx="0.5" />
          <rect x="16" y="5" width="3" height="13" fill={leaderGold} rx="0.5" />
        </g>

        {/* Floating Identity Badge Pill: "FINAL" */}
        <g transform="translate(104, 20)">
          <rect
            width="46"
            height="16"
            rx="8"
            fill={isDark ? '#7E22CE' : '#7E22CE'}
            fillOpacity="0.2"
            stroke={strokeColor}
            strokeWidth="1"
          />
          <text
            x="23"
            y="11.5"
            textAnchor="middle"
            fill={isDark ? '#E9D5FF' : '#6B21A8'}
            fontSize="7"
            fontWeight="bold"
            fontFamily="monospace"
          >
            FINAL
          </text>
        </g>
      </svg>
    </div>
  );
};
