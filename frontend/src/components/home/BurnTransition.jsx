import React, { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import VisualizerDashboard from '../../pages/VisualizerDashboard';
import Sandbox from '../../pages/Sandbox';
import GameWorld from '../../game/GameWorld';

/**
 * BurnTransition — Realistic molten liquid melt transition.
 * 
 * - The destination route UI is revealed underneath with 100% crystal clarity.
 * - The old page liquefies and melts from the center outward.
 * - Gravitational molten drips, viscous dripping stalactites, sizzling lava bubbles,
 *   and falling molten droplets create an unmistakable "melting away" visual.
 */
export default function BurnTransition({ active, route, onComplete }) {
  const [phase, setPhase] = useState(0); // 0 = idle, 1 = melting, 2 = complete

  useEffect(() => {
    if (active && phase === 0) {
      setPhase(1);
      const timer = setTimeout(() => {
        setPhase(2);
        onComplete?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || phase === 0) return null;

  return (
    <>
      {/* ── STYLES FOR THE MOLTEN MELTING TRANSITION ── */}
      <style>{`
        @keyframes meltApertureExpand {
          0% {
            transform: scale(0.02) scaleY(1);
            opacity: 0.8;
          }
          15% {
            transform: scale(0.3) scaleY(1.15);
            opacity: 1;
          }
          50% {
            transform: scale(1.1) scaleY(1.25);
            opacity: 1;
          }
          85% {
            transform: scale(2.3) scaleY(1.3);
            opacity: 0.95;
          }
          100% {
            transform: scale(3.5) scaleY(1.35);
            opacity: 0;
          }
        }

        @keyframes moltenDripFall {
          0% {
            transform: translateY(0) scale(1, 1);
            opacity: 1;
          }
          30% {
            transform: translateY(40px) scale(0.85, 1.6);
            opacity: 1;
          }
          70% {
            transform: translateY(180px) scale(0.6, 2.2);
            opacity: 0.9;
          }
          100% {
            transform: translateY(380px) scale(0.2, 2.8);
            opacity: 0;
          }
        }

        @keyframes moltenGlowPulse {
          0%, 100% {
            filter: drop-shadow(0 0 15px #ff4500) drop-shadow(0 0 35px #ffaa00) drop-shadow(0 0 60px #ff2200);
          }
          50% {
            filter: drop-shadow(0 0 25px #ff6600) drop-shadow(0 0 55px #ffd700) drop-shadow(0 0 90px #ff3300);
          }
        }

        @keyframes dripStretch {
          0% {
            transform: scaleY(0.2);
            opacity: 0.4;
          }
          35% {
            transform: scaleY(1.2);
            opacity: 1;
          }
          70% {
            transform: scaleY(1.8);
            opacity: 0.85;
          }
          100% {
            transform: scaleY(2.4);
            opacity: 0;
          }
        }

        @keyframes bubbleSizzle {
          0% { transform: scale(0.4); opacity: 0; }
          40% { transform: scale(1.2); opacity: 1; }
          75% { transform: scale(1.4); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes igniteFlashWhite {
          0% { opacity: 0; transform: scale(0.1); }
          25% { opacity: 1; transform: scale(1.2); }
          60% { opacity: 0.6; transform: scale(2.0); }
          100% { opacity: 0; transform: scale(3.0); }
        }
      `}</style>

      {/* ── 1. CRYSTAL CLEAR DESTINATION ROUTE UI (Revealed through the melt) ── */}
      {/* Kept 100% crisp, sharp, and clear — NO blur or distortion */}
      <div 
        className="fixed inset-0 z-[110] overflow-y-auto bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans pointer-events-none select-none"
      >
        <Navbar />
        <main className="pt-16 min-h-screen">
          {route === '/visualizer' && <VisualizerDashboard />}
          {route === '/sandbox' && <Sandbox />}
          {route === '/game' && <GameWorld />}
        </main>
      </div>

      {/* ── 2. SVG FILTER FOR LIQUID / GOOEY MELTING EDGES ── */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="meltFluidNoise" x="-20%" y="-20%" width="140%" height="140%">
            {/* Vertical distortion stretches the noise downward to simulate gravity melting */}
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="42" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── 3. EXPANDING MOLTEN LIQUID RIM (Glowing Magma & Molten Gold) ── */}
      <div className="fixed inset-0 z-[125] flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Outer Sagging Molten Ring with Liquid Border */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: '65vmin',
            height: '65vmin',
            animation: 'meltApertureExpand 2.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards, moltenGlowPulse 0.5s infinite alternate',
            filter: 'url(#meltFluidNoise)',
            background: 'radial-gradient(ellipse at 50% 52%, transparent 35%, rgba(40,10,0,0.92) 42%, #cc1800 46%, #ff4400 50%, #ffaa00 55%, #ffffff 58%, transparent 63%)',
            border: '10px solid rgba(255, 120, 0, 0.9)',
            boxShadow: '0 0 60px 25px #ff4500, inset 0 0 60px 25px #ff6600, 0 10px 90px 45px #ffaa00',
          }}
        >
          {/* Sizzling White-Hot Molten Core Line */}
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, #200400 39%, #ff3300 45%, #fff0a0 48%, transparent 52%)',
            }}
          />
        </div>
      </div>

      {/* ── 4. VISCOUS DRIPPING MOLTEN STALACTITES (Hanging & Stretching Down) ── */}
      <div className="fixed inset-0 z-[126] flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative w-[70vmin] h-[70vmin] flex items-center justify-center">
          {/* Multiple dripping strands arranged around the aperture */}
          {[
            { left: '25%', top: '22%', height: '70px', width: '14px', delay: '0.1s' },
            { left: '38%', top: '18%', height: '95px', width: '18px', delay: '0.3s' },
            { left: '50%', top: '16%', height: '110px', width: '22px', delay: '0.0s' },
            { left: '62%', top: '19%', height: '85px', width: '16px', delay: '0.2s' },
            { left: '74%', top: '24%', height: '65px', width: '12px', delay: '0.4s' },
            // Bottom hanging drips
            { left: '32%', top: '65%', height: '80px', width: '15px', delay: '0.25s' },
            { left: '46%', top: '70%', height: '105px', width: '20px', delay: '0.05s' },
            { left: '58%', top: '68%', height: '90px', width: '16px', delay: '0.35s' },
            { left: '70%', top: '63%', height: '60px', width: '12px', delay: '0.15s' },
          ].map((drip, idx) => (
            <div
              key={`drip-${idx}`}
              className="absolute origin-top rounded-b-full pointer-events-none"
              style={{
                left: drip.left,
                top: drip.top,
                width: drip.width,
                height: drip.height,
                background: 'linear-gradient(to bottom, #ff3b00, #ff8800, #ffd23f, #ffffff)',
                boxShadow: '0 0 14px 4px #ff5500, 0 4px 20px #ffaa00',
                animation: `dripStretch 1.8s ease-in forwards ${drip.delay}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 5. HEAVY MOLTEN DROPLETS DRIPPING DOWNWARD WITH GRAVITY ── */}
      <div className="fixed inset-0 z-[127] pointer-events-none overflow-hidden">
        {Array.from({ length: 32 }).map((_, i) => {
          const startX = 25 + Math.random() * 50; // Centered horizontal spread
          const startY = 30 + Math.random() * 40; // Along the melting opening
          const width = 6 + Math.random() * 8;
          const height = width * (1.3 + Math.random() * 0.8);
          const delay = 0.2 + Math.random() * 1.4;
          const dur = 0.9 + Math.random() * 0.8;

          return (
            <div
              key={`drop-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${startX}%`,
                top: `${startY}%`,
                width: `${width}px`,
                height: `${height}px`,
                background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #ffea70 30%, #ff5500 70%, #990000 100%)',
                boxShadow: '0 0 12px 4px rgba(255, 100, 0, 0.85), 0 0 25px rgba(255, 180, 0, 0.6)',
                animation: `moltenDripFall ${dur}s cubic-bezier(0.55, 0.085, 0.68, 0.53) ${delay}s forwards`,
              }}
            />
          );
        })}
      </div>

      {/* ── 6. SIZZLING HEAT BUBBLES ALONG MELT EDGES ── */}
      <div className="fixed inset-0 z-[128] pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const rx = 48 + Math.cos(angle) * (20 + Math.random() * 8);
          const ry = 50 + Math.sin(angle) * (20 + Math.random() * 8);
          const size = 10 + Math.random() * 14;
          const delay = 0.3 + Math.random() * 1.5;

          return (
            <div
              key={`bubble-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${rx}%`,
                top: `${ry}%`,
                width: `${size}px`,
                height: `${size}px`,
                border: '2px solid #ffd700',
                background: 'radial-gradient(circle, #ffffff 10%, #ff7700 60%, transparent 90%)',
                boxShadow: '0 0 15px #ff5500',
                animation: `bubbleSizzle 0.7s ease-out ${delay}s forwards`,
              }}
            />
          );
        })}
      </div>

      {/* ── 7. INITIAL WHITE-HOT LIQUEFACTION FLASH ── */}
      <div className="fixed inset-0 z-[129] flex items-center justify-center pointer-events-none">
        <div
          className="w-56 h-56 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, #fff0a0 30%, #ff5500 60%, transparent 80%)',
            boxShadow: '0 0 90px 40px #ff6600',
            animation: 'igniteFlashWhite 0.6s ease-out forwards',
          }}
        />
      </div>
    </>
  );
}
