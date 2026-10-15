import React from 'react';
import { motion } from 'framer-motion';
import useAppStore from '../../../store/useAppStore';

/**
 * EmployeeIllustration - 2.5D Workplace Professional Avatar
 * Visualizes the intermediate subclass: Employee (employeeId, department, work())
 */
export const EmployeeIllustration = ({
  isActive = false,
  isDimmed = false,
  highlightedMember = null,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const strokeColor = isDark ? '#818CF8' : isWarm ? '#4F46E5' : '#4338CA';
  const accentGlow = isDark ? 'rgba(129, 140, 248, 0.45)' : isWarm ? 'rgba(79, 70, 229, 0.3)' : 'rgba(67, 56, 202, 0.25)';
  const bodyGradStart = isDark ? '#141432' : isWarm ? '#FDFBF7' : '#EEF2FF';
  const bodyGradEnd = isDark ? '#1E1B4B' : isWarm ? '#E0E7FF' : '#C7D2FE';
  const badgeColor = isDark ? '#A5B4FC' : isWarm ? '#4F46E5' : '#4F46E5';

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

      {/* 2.5D Isometric Employee Silhouette with Lanyard & Workstation Screen */}
      <svg
        viewBox="0 0 160 140"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="empBustGrad" x1="20" y1="40" x2="140" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={bodyGradStart} stopOpacity="0.95" />
            <stop offset="100%" stopColor={bodyGradEnd} stopOpacity="0.9" />
          </linearGradient>

          <filter id="empGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Isometric Base Pedestal */}
        <polygon
          points="80,118 135,98 80,78 25,98"
          fill={isDark ? '#0F1226' : isWarm ? '#EEF2FF' : '#E2E8F0'}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeOpacity={isDark ? 0.6 : 0.8}
        />
        <polygon
          points="25,98 80,118 80,126 25,106"
          fill={isDark ? '#0A0C1A' : isWarm ? '#C7D2FE' : '#CBD5E1'}
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <polygon
          points="80,118 135,98 135,106 80,126"
          fill={isDark ? '#0D0F21' : isWarm ? '#C7D2FE' : '#94A3B8'}
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Torso & Uniform */}
        <path
          d="M44,95 C44,76 60,68 80,68 C100,68 116,76 116,95 L116,105 L44,105 Z"
          fill="url(#empBustGrad)"
          stroke={strokeColor}
          strokeWidth="1.8"
        />

        {/* Corporate Lanyard Ribbon */}
        <path
          d="M74,68 L80,88 L86,68"
          stroke={badgeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Smart ID Badge Card dangling from Lanyard */}
        <rect
          x="75"
          y="88"
          width="10"
          height="14"
          rx="2"
          fill={isDark ? '#1E1B4B' : '#E0E7FF'}
          stroke={badgeColor}
          strokeWidth="1.2"
        />
        <circle cx="80" cy="92" r="1.5" fill={badgeColor} />
        <line x1="77" y1="96" x2="83" y2="96" stroke={badgeColor} strokeWidth="1" />
        <line x1="77" y1="99" x2="82" y2="99" stroke={badgeColor} strokeWidth="0.8" />

        {/* Head Contour */}
        <circle
          cx="80"
          cy="44"
          r="18"
          fill="url(#empBustGrad)"
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Stylized Glasses / Tech Visor (Workforce Focus) */}
        <rect
          x="69"
          y="40"
          width="22"
          height="7"
          rx="3.5"
          fill={isDark ? '#312E81' : '#E0E7FF'}
          stroke={badgeColor}
          strokeWidth="1.4"
        />

        {/* Holographic Work Terminal Floating on Left */}
        <g transform="translate(18, 56)">
          <rect
            width="22"
            height="16"
            rx="3"
            fill={isDark ? '#1E1B4B' : '#EEF2FF'}
            fillOpacity="0.8"
            stroke={badgeColor}
            strokeWidth="1"
          />
          <line x1="22" y1="64" x2="28" y2="64" stroke={strokeColor} strokeWidth="1" />
          {/* Mini code lines inside screen */}
          <line x1="3" y1="4" x2="16" y2="4" stroke={badgeColor} strokeWidth="1" />
          <line x1="3" y1="8" x2="19" y2="8" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="3" y1="12" x2="12" y2="12" stroke={badgeColor} strokeWidth="0.8" />
        </g>

        {/* Floating Identity Badge Pill: "SUBCLASS" */}
        <g transform="translate(104, 22)">
          <rect
            width="46"
            height="16"
            rx="8"
            fill={isDark ? '#4338CA' : '#4338CA'}
            fillOpacity="0.2"
            stroke={strokeColor}
            strokeWidth="1"
          />
          <text
            x="23"
            y="11.5"
            textAnchor="middle"
            fill={isDark ? '#A5B4FC' : '#3730A3'}
            fontSize="7"
            fontWeight="bold"
            fontFamily="monospace"
          >
            SUBCLASS
          </text>
        </g>
      </svg>
    </div>
  );
};
