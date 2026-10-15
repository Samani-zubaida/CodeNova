import React from 'react';
import { motion } from 'framer-motion';
import useAppStore from '../../../store/useAppStore';

/**
 * VehicleIllustration - 2.5D Futuristic Aerodynamic Vehicle Blueprint
 * Visualizes the abstract parent concept of a propulsion vehicle.
 */
export const VehicleIllustration = ({
  isActive = false,
  isDimmed = false,
  highlightedMember = null,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Aesthetic theme tokens
  const strokeColor = isDark ? '#38BDF8' : isWarm ? '#D97706' : '#2563EB';
  const accentGlow = isDark ? 'rgba(56,189,248,0.45)' : isWarm ? 'rgba(217,119,6,0.35)' : 'rgba(37,99,235,0.3)';
  const bodyGradientStart = isDark ? '#0F172A' : isWarm ? '#FDFBF7' : '#F8FAFC';
  const bodyGradientEnd = isDark ? '#1E293B' : isWarm ? '#F3EDE2' : '#E2E8F0';
  const engineCoreColor = isDark ? '#06B6D4' : isWarm ? '#F59E0B' : '#3B82F6';

  return (
    <div className={`relative w-36 sm:w-44 h-20 sm:h-24 flex items-center justify-center transition-all duration-500 ${
      isDimmed ? 'opacity-40 grayscale-[40%]' : 'opacity-100'
    }`}>
      {/* Ambient Radial Backlight */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.08, 1] : 1,
          opacity: isActive ? [0.4, 0.7, 0.4] : 0.3,
        }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        className="absolute w-40 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: accentGlow }}
      />

      {/* SVG 2.5D Isometric Aerodynamic Vehicle Chassis */}
      <svg
        viewBox="0 0 240 140"
        className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vehChassisGrad" x1="20" y1="30" x2="220" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={bodyGradientStart} stopOpacity="0.95" />
            <stop offset="100%" stopColor={bodyGradientEnd} stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="vehCanopyGrad" x1="70" y1="35" x2="160" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
          </linearGradient>

          <filter id="vehCoreGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ground Isometric Reflection Shadow */}
        <ellipse cx="120" cy="115" rx="85" ry="14" fill={isDark ? '#000000' : 'rgba(0,0,0,0.15)'} opacity="0.6" filter="blur(6px)" />

        {/* Lower Hull / Aerodynamic Undercarriage */}
        <path
          d="M 40 88 L 65 106 L 175 106 L 200 88 L 190 75 L 50 75 Z"
          fill="url(#vehChassisGrad)"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeOpacity="0.75"
        />

        {/* Aerodynamic Front Nosecone & Hood Line */}
        <path
          d="M 50 75 L 75 52 L 165 52 L 190 75 L 175 106 L 65 106 Z"
          fill="url(#vehChassisGrad)"
          stroke={strokeColor}
          strokeWidth="1.8"
        />

        {/* Futuristic Cockpit Glass Canopy */}
        <path
          d="M 85 52 L 105 32 L 145 32 L 160 52 Z"
          fill="url(#vehCanopyGrad)"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeDasharray="4 2"
        />

        {/* Longitudinal Aerodynamic Stiffeners */}
        <line x1="75" y1="52" x2="65" y2="106" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.5" />
        <line x1="165" y1="52" x2="175" y2="106" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.5" />
        <line x1="105" y1="32" x2="100" y2="80" stroke={strokeColor} strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line x1="145" y1="32" x2="140" y2="80" stroke={strokeColor} strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 3" />

        {/* Left & Right Mag-Lev Thruster Pods / Wheel Housing Hubs */}
        <g opacity="0.9">
          <ellipse cx="65" cy="98" rx="14" ry="7" fill={isDark ? '#020617' : '#FFFFFF'} stroke={strokeColor} strokeWidth="1.5" />
          <ellipse cx="175" cy="98" rx="14" ry="7" fill={isDark ? '#020617' : '#FFFFFF'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="65" cy="98" r="3.5" fill={engineCoreColor} filter="url(#vehCoreGlow)" />
          <circle cx="175" cy="98" r="3.5" fill={engineCoreColor} filter="url(#vehCoreGlow)" />
        </g>

        {/* Central Core Propulsion Reactor (Pulsing Heart) */}
        <g filter="url(#vehCoreGlow)">
          <circle cx="120" cy="74" r="8" fill={engineCoreColor} opacity="0.3" />
          <circle cx="120" cy="74" r="4.5" fill={engineCoreColor} />
          <circle cx="120" cy="74" r="2" fill="#FFFFFF" />
        </g>

        {/* Vector Field Velocity Sensors */}
        <circle cx="50" cy="75" r="2" fill={strokeColor} />
        <circle cx="190" cy="75" r="2" fill={strokeColor} />
        <line x1="50" y1="75" x2="35" y2="75" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 2" />
        <line x1="190" y1="75" x2="205" y2="75" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 2" />

        {/* "VEHICLE CORE" Blueprint Subtitle Badge */}
        <text
          x="120"
          y="126"
          textAnchor="middle"
          fill={strokeColor}
          fontSize="7.5"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontWeight="700"
          letterSpacing="1.8"
          opacity="0.85"
        >
          [ BASE VEHICLE BLUEPRINT ]
        </text>
      </svg>
    </div>
  );
};
