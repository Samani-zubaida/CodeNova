import React from 'react';

/**
 * Animated SVG Graphics for the 4 OOP Pillars in Catalog Cards
 */

// 1. Encapsulation Graphic: Concentric glowing security rings guarding private data core
export const EncapsulationGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
    <defs>
      <radialGradient id="encapCoreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FB7185" stopOpacity="0.9" />
        <stop offset="45%" stopColor="#F43F5E" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="shieldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="50%" stopColor="#FDA4AF" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
    </defs>

    {/* Background Grid Pattern */}
    <rect width="200" height="130" rx="14" fill="#0C0F17" />
    <circle cx="100" cy="65" r="55" fill="none" stroke="#F43F5E" strokeOpacity="0.1" strokeDasharray="3 3" />
    
    {/* Outer Defense Orbital */}
    <circle cx="100" cy="65" r="44" fill="none" stroke="url(#shieldRingGrad)" strokeWidth="1.5" strokeDasharray="8 6" className="animate-spin" style={{ transformOrigin: '100px 65px', animationDuration: '14s' }} />
    
    {/* Shield Wall Ring */}
    <circle cx="100" cy="65" r="32" fill="#141824" stroke="#F43F5E" strokeWidth="2.5" />
    <circle cx="100" cy="65" r="32" fill="none" stroke="#FFE4E6" strokeWidth="1" strokeDasharray="4 8" className="animate-spin" style={{ transformOrigin: '100px 65px', animationDuration: '8s' }} />

    {/* Inner Private Data Core (Glowing) */}
    <circle cx="100" cy="65" r="22" fill="url(#encapCoreGlow)" />
    <circle cx="100" cy="65" r="14" fill="#F43F5E" />
    
    {/* Vault Icon / Shield Glyph */}
    <path d="M100 57 L106 60 V66 C106 70 100 73 100 73 C100 73 94 70 94 66 V60 Z" fill="#FFFFFF" />
    
    {/* Deflection particles */}
    <circle cx="148" cy="40" r="2" fill="#FDA4AF" />
    <circle cx="56" cy="85" r="2.5" fill="#FDA4AF" />
    <line x1="140" y1="45" x2="134" y2="52" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
  </svg>
);

// 2. Abstraction Graphic: Clean glass interface toggle with intricate circuit complexity below
export const AbstractionGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="abstractGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Dark Canvas */}
    <rect width="200" height="130" rx="14" fill="#0C0F17" />

    {/* Hidden Hardware Circuit Layer (Complex Internals) */}
    <g opacity="0.45">
      <path d="M 30 95 H 170" stroke="#065F46" strokeWidth="1.5" />
      <path d="M 50 95 V 115 H 70" stroke="#047857" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M 110 95 V 118 H 135 V 105" stroke="#10B981" strokeWidth="1.2" />
      <path d="M 150 95 V 110 H 165" stroke="#059669" strokeWidth="1.5" />
      <circle cx="50" cy="95" r="3" fill="#10B981" />
      <circle cx="110" cy="95" r="3" fill="#34D399" />
      <circle cx="150" cy="95" r="3" fill="#10B981" />
      <rect x="80" y="102" width="22" height="14" rx="3" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
    </g>

    {/* Boundary Separation Line (Interface vs Implementation) */}
    <line x1="20" y1="85" x2="180" y2="85" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
    <text x="100" y="80" textAnchor="middle" fill="#6EE7B7" fontSize="8" fontFamily="monospace" letterSpacing="1">
      INTERFACE BOUNDARY
    </text>

    {/* Simple Upper Interface (Cockpit / Button) */}
    <rect x="42" y="24" width="116" height="42" rx="12" fill="url(#abstractGlass)" stroke="url(#emeraldGlow)" strokeWidth="2" />
    <rect x="52" y="32" width="42" height="26" rx="8" fill="#10B981" />
    <path d="M68 40 L 78 45 L 68 50 Z" fill="#FFFFFF" />
    
    <text x="104" y="44" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
      phone.start()
    </text>
    <text x="104" y="54" fill="#A7F3D0" fontSize="8" fontFamily="monospace">
      1-Touch Public API
    </text>
  </svg>
);

// 3. Inheritance Graphic: Luminous Class Tree Hierarchy with glowing inheritance conduits
export const InheritanceGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="azureConduit" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#818CF8" />
      </linearGradient>
    </defs>

    {/* Dark Canvas */}
    <rect width="200" height="130" rx="14" fill="#0C0F17" />

    {/* Class Tree Branches (Conduits) */}
    <path d="M 100 38 V 58 H 55 V 78" stroke="url(#azureConduit)" strokeWidth="2" fill="none" />
    <path d="M 100 58 H 145 V 78" stroke="url(#azureConduit)" strokeWidth="2" fill="none" />
    <circle cx="100" cy="58" r="3.5" fill="#38BDF8" />

    {/* SuperClass Node (Parent) */}
    <rect x="68" y="16" width="64" height="24" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
    <text x="100" y="32" textAnchor="middle" fill="#E0F2FE" fontSize="10" fontWeight="bold" fontFamily="monospace">
      Vehicle
    </text>
    <circle cx="76" cy="28" r="2.5" fill="#38BDF8" />

    {/* SubClass Node 1 (Car extends Vehicle) */}
    <rect x="25" y="78" width="60" height="24" rx="8" fill="#1E293B" stroke="#818CF8" strokeWidth="2" />
    <text x="55" y="94" textAnchor="middle" fill="#E0E7FF" fontSize="10" fontWeight="bold" fontFamily="monospace">
      Car
    </text>

    {/* SubClass Node 2 (Plane extends Vehicle) */}
    <rect x="115" y="78" width="60" height="24" rx="8" fill="#1E293B" stroke="#818CF8" strokeWidth="2" />
    <text x="145" y="94" textAnchor="middle" fill="#E0E7FF" fontSize="10" fontWeight="bold" fontFamily="monospace">
      Plane
    </text>

    {/* Conduit Arrow Badges */}
    <text x="40" y="68" fill="#38BDF8" fontSize="8" fontFamily="monospace" fontWeight="bold">
      extends
    </text>
    <text x="130" y="68" fill="#38BDF8" fontSize="8" fontFamily="monospace" fontWeight="bold">
      extends
    </text>
    <circle cx="55" cy="78" r="2.5" fill="#818CF8" />
    <circle cx="145" cy="78" r="2.5" fill="#818CF8" />

    {/* Pulse Dot animating down */}
    <circle cx="100" cy="46" r="3" fill="#BAE6FD" className="animate-pulse" />
  </svg>
);

// 4. Polymorphism Graphic: Refraction emitter splitting 1 call into multiple dynamic forms
export const PolymorphismGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="amberPrismGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Dark Canvas */}
    <rect width="200" height="130" rx="14" fill="#0C0F17" />

    {/* Input Method Signal Flowing In */}
    <path d="M 100 16 V 38" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 3" />
    <circle cx="100" cy="20" r="3" fill="#FDE68A" />

    {/* Central Polymorphic Prism Emitter */}
    <polygon points="100,38 122,58 78,58" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
    <circle cx="100" cy="50" r="10" fill="url(#amberPrismGlow)" />
    <circle cx="100" cy="50" r="4" fill="#FEF3C7" />

    {/* Dispatched Refraction Rays */}
    <line x1="86" y1="58" x2="40" y2="86" stroke="#F43F5E" strokeWidth="2" />
    <line x1="94" y1="58" x2="80" y2="86" stroke="#10B981" strokeWidth="2" />
    <line x1="106" y1="58" x2="120" y2="86" stroke="#38BDF8" strokeWidth="2" />
    <line x1="114" y1="58" x2="160" y2="86" stroke="#F59E0B" strokeWidth="2" />

    {/* 4 Polymorphic Form Shapes */}
    {/* Form 1: Circle (Dev) */}
    <circle cx="40" cy="98" r="12" fill="#1E293B" stroke="#F43F5E" strokeWidth="2" />
    <circle cx="40" cy="98" r="5" fill="#F43F5E" />

    {/* Form 2: Square (Parent) */}
    <rect x="70" y="88" width="20" height="20" rx="4" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
    <rect x="76" y="94" width="8" height="8" rx="2" fill="#10B981" />

    {/* Form 3: Triangle (Athlete) */}
    <polygon points="120,86 132,108 108,108" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
    <circle cx="120" cy="100" r="3.5" fill="#38BDF8" />

    {/* Form 4: Star/Diamond (Musician) */}
    <polygon points="160,86 170,98 160,110 150,98" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
    <circle cx="160" cy="98" r="3.5" fill="#F59E0B" />
  </svg>
);
