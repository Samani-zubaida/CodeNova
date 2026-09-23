import React from 'react';
import { motion } from 'framer-motion';
import useAppStore from '../../../store/useAppStore';

/**
 * PersonIllustration - 2.5D Stylized Human Avatar Blueprint
 * Visualizes the root base class: Person (biological identity, name, age)
 */
export const PersonIllustration = ({
  isActive = false,
  isDimmed = false,
  highlightedMember = null,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const strokeColor = isDark ? '#38BDF8' : isWarm ? '#0284C7' : '#0369A1';
  const accentGlow = isDark ? 'rgba(56, 189, 248, 0.45)' : isWarm ? 'rgba(2, 132, 199, 0.3)' : 'rgba(3, 105, 161, 0.25)';
  const bodyGradStart = isDark ? '#0C1B2F' : isWarm ? '#FDFBF7' : '#F0F9FF';
  const bodyGradEnd = isDark ? '#1E293B' : isWarm ? '#E0F2FE' : '#BAE6FD';
  const vitalityColor = isDark ? '#00E5FF' : isWarm ? '#0284C7' : '#0284C7';

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

      {/* 2.5D Isometric Person Bust & Identity Crest */}
      <svg
        viewBox="0 0 160 140"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="personBustGrad" x1="20" y1="40" x2="140" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={bodyGradStart} stopOpacity="0.95" />
            <stop offset="100%" stopColor={bodyGradEnd} stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="personHeadGrad" x1="50" y1="20" x2="110" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={vitalityColor} stopOpacity="0.5" />
          </linearGradient>

          <filter id="personGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Isometric Base Pedestal */}
        <polygon
          points="80,118 135,98 80,78 25,98"
          fill={isDark ? '#081426' : isWarm ? '#E0F2FE' : '#E2E8F0'}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeOpacity={isDark ? 0.6 : 0.8}
        />
        <polygon
          points="25,98 80,118 80,126 25,106"
          fill={isDark ? '#040B16' : isWarm ? '#BAE6FD' : '#CBD5E1'}
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <polygon
          points="80,118 135,98 135,106 80,126"
          fill={isDark ? '#06101E' : isWarm ? '#BAE6FD' : '#94A3B8'}
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Shoulders & Torso */}
        <path
          d="M45,95 C45,78 60,70 80,70 C100,70 115,78 115,95 L115,105 L45,105 Z"
          fill="url(#personBustGrad)"
          stroke={strokeColor}
          strokeWidth="1.8"
        />

        {/* Collar & Tie / Neck Detail */}
        <path
          d="M72,70 L80,82 L88,70"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Head Contour */}
        <circle
          cx="80"
          cy="46"
          r="18"
          fill="url(#personBustGrad)"
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Stylized Modern Hairline / Headset Accent */}
        <path
          d="M66,42 C66,32 74,26 80,26 C86,26 94,32 94,42"
          stroke={vitalityColor}
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Vitality Core Node in Chest */}
        <circle
          cx="80"
          cy="88"
          r="5"
          fill={vitalityColor}
          filter="url(#personGlow)"
        />
        <circle
          cx="80"
          cy="88"
          r="2"
          fill="#FFFFFF"
        />

        {/* Orbiting Identity Data Ring */}
        <motion.ellipse
          cx="80"
          cy="46"
          rx="24"
          ry="10"
          fill="none"
          stroke={vitalityColor}
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeOpacity={isActive ? 0.9 : 0.5}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
          style={{ originX: '80px', originY: '46px' }}
        />

        {/* Floating Identity Badge Pill: "BASE" */}
        <g transform="translate(108, 24)">
          <rect
            width="36"
            height="16"
            rx="8"
            fill={isDark ? '#0284C7' : '#0284C7'}
            fillOpacity="0.2"
            stroke={strokeColor}
            strokeWidth="1"
          />
          <text
            x="18"
            y="11.5"
            textAnchor="middle"
            fill={isDark ? '#38BDF8' : '#0369A1'}
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
          >
            BASE
          </text>
        </g>
      </svg>
    </div>
  );
};
