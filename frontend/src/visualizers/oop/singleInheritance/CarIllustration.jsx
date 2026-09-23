import React from 'react';
import { motion } from 'framer-motion';
import useAppStore from '../../../store/useAppStore';

/**
 * CarIllustration - 2.5D Sleek Modern Automobile
 * Visually depicts the specialized child class with passenger doors and cargo trunk.
 */
export const CarIllustration = ({
  isActive = false,
  highlightDoors = false,
  highlightTrunk = false,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Aesthetic theme tokens
  const carPrimary = isDark ? '#A855F7' : isWarm ? '#9333EA' : '#7C3AED';
  const carAccent = isDark ? '#06B6D4' : isWarm ? '#D97706' : '#2563EB';
  const bodyGradStart = isDark ? '#1E1B4B' : isWarm ? '#FDFBF7' : '#FFFFFF';
  const bodyGradEnd = isDark ? '#312E81' : isWarm ? '#EDE5D8' : '#F1F5F9';
  const glassColor = isDark ? 'rgba(56,189,248,0.3)' : 'rgba(37,99,235,0.2)';

  return (
    <div className="relative w-38 sm:w-46 h-20 sm:h-24 flex items-center justify-center transition-all duration-500">
      {/* Ambient Radial Backlight */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.1, 1] : 1,
          opacity: isActive ? [0.45, 0.75, 0.45] : 0.3,
        }}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        className="absolute w-44 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: isDark ? 'rgba(168,85,247,0.35)' : 'rgba(147,51,234,0.25)' }}
      />

      {/* SVG 2.5D Isometric Car */}
      <svg
        viewBox="0 0 250 145"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="carBodyGrad" x1="20" y1="30" x2="230" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={bodyGradStart} stopOpacity="0.98" />
            <stop offset="100%" stopColor={bodyGradEnd} stopOpacity="0.95" />
          </linearGradient>

          <filter id="carGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ground Drop Shadow */}
        <ellipse cx="125" cy="120" rx="95" ry="14" fill={isDark ? '#000000' : 'rgba(0,0,0,0.2)'} opacity="0.65" filter="blur(6px)" />

        {/* 1. Main Sedan Body Chassis */}
        <path
          d="M 32 94 C 32 85 42 78 55 76 L 85 74 L 115 48 C 122 42 132 40 148 40 L 176 40 C 188 40 196 46 202 54 L 218 74 L 228 80 C 236 84 238 90 238 96 L 235 106 C 235 110 230 114 220 114 L 45 114 C 36 114 32 108 32 98 Z"
          fill="url(#carBodyGrad)"
          stroke={carPrimary}
          strokeWidth="1.8"
        />

        {/* 2. Cabin Glass Greenhouse (Front & Rear Windows) */}
        <path
          d="M 88 73 L 118 49 C 123 45 130 44 142 44 L 174 44 C 182 44 188 48 193 55 L 210 73 Z"
          fill={glassColor}
          stroke={carAccent}
          strokeWidth="1.3"
          strokeOpacity="0.8"
        />

        {/* Central B-Pillar Partition */}
        <line x1="150" y1="44" x2="150" y2="73" stroke={carPrimary} strokeWidth="2" strokeOpacity="0.9" />

        {/* 3. Four Passenger Doors Seams (Specialized Feature: numberOfDoors = 4) */}
        <g stroke={highlightDoors ? '#38BDF8' : carPrimary} strokeWidth={highlightDoors ? '2.4' : '1.3'} opacity={highlightDoors ? '1' : '0.75'}>
          {/* Front Door Contour */}
          <path d="M 148 73 L 148 108 L 195 108 L 206 82 L 180 73 Z" fill="none" />
          <rect x="180" y="80" width="10" height="2.5" rx="1.2" fill={highlightDoors ? '#38BDF8' : carPrimary} />

          {/* Rear Door Contour */}
          <path d="M 98 73 L 102 108 L 146 108 L 146 73 Z" fill="none" />
          <rect x="132" y="80" width="10" height="2.5" rx="1.2" fill={highlightDoors ? '#38BDF8' : carPrimary} />
        </g>

        {/* 4. Rear Cargo Trunk Hatch Seam (Specialized Feature: openTrunk()) */}
        <g stroke={highlightTrunk ? '#F59E0B' : carPrimary} strokeWidth={highlightTrunk ? '2.4' : '1.3'}>
          <path
            d="M 36 90 L 52 76 L 78 75 L 75 102"
            fill="none"
            strokeDasharray={highlightTrunk ? '4 2' : 'none'}
          />
          {highlightTrunk && (
            <motion.path
              d="M 52 76 L 42 60 L 68 58"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
              filter="url(#carGlow)"
            />
          )}
        </g>

        {/* 5. Aerodynamic Alloy Wheels with Calipers */}
        {/* Front Wheel */}
        <g>
          <circle cx="192" cy="108" r="17" fill={isDark ? '#020617' : '#0F172A'} stroke={carPrimary} strokeWidth="2.2" />
          <circle cx="192" cy="108" r="10" fill={isDark ? '#1E293B' : '#E2E8F0'} stroke={carAccent} strokeWidth="1" />
          <circle cx="192" cy="108" r="3.5" fill={carAccent} filter="url(#carGlow)" />
          {/* Spokes */}
          <line x1="192" y1="98" x2="192" y2="118" stroke={carAccent} strokeWidth="1" />
          <line x1="182" y1="108" x2="202" y2="108" stroke={carAccent} strokeWidth="1" />
        </g>

        {/* Rear Wheel */}
        <g>
          <circle cx="78" cy="108" r="17" fill={isDark ? '#020617' : '#0F172A'} stroke={carPrimary} strokeWidth="2.2" />
          <circle cx="78" cy="108" r="10" fill={isDark ? '#1E293B' : '#E2E8F0'} stroke={carAccent} strokeWidth="1" />
          <circle cx="78" cy="108" r="3.5" fill={carAccent} filter="url(#carGlow)" />
          {/* Spokes */}
          <line x1="78" y1="98" x2="78" y2="118" stroke={carAccent} strokeWidth="1" />
          <line x1="68" y1="108" x2="88" y2="108" stroke={carAccent} strokeWidth="1" />
        </g>

        {/* Front Headlight (Dual Xenon / LED Projector) */}
        <polygon points="228,84 238,88 234,94 225,92" fill={carAccent} filter="url(#carGlow)" />

        {/* Rear Lightbar (Red LED Taillight) */}
        <line x1="33" y1="90" x2="35" y2="98" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" filter="url(#carGlow)" />

        {/* Subtitle Badge */}
        <text
          x="125"
          y="135"
          textAnchor="middle"
          fill={carPrimary}
          fontSize="7.5"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontWeight="700"
          letterSpacing="1.8"
          opacity="0.9"
        >
          [ SPECIALIZED CAR SUBCLASS ]
        </text>
      </svg>
    </div>
  );
};
