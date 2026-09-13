import React, { useEffect, useState } from 'react';

/**
 * BlackHoleTransition — Epic Cosmic Black Hole & Warp Particle Transition.
 * 
 * - When stepping into a door, a cosmic singularity / black hole opens.
 * - Glowing relativistic accretion disk spins around the event horizon.
 * - 80+ matter and light particles spiral into the vortex.
 * - The camera dives into the singularity with hyperspace warp speed lines.
 * - Quantum cosmic flash smoothly lands the player on the destination route!
 */
export default function BlackHoleTransition({ active, onComplete }) {
  const [phase, setPhase] = useState(0); // 0=idle, 1=singularity forms & sucks in, 2=warp dive, 3=quantum arrival, 4=complete

  useEffect(() => {
    if (active && phase === 0) {
      setPhase(1);

      // Phase 2: Hyperspace dive into the event horizon
      const t1 = setTimeout(() => setPhase(2), 1100);

      // Phase 3: Quantum arrival flash
      const t2 = setTimeout(() => setPhase(3), 2000);

      // Phase 4: Land on route
      const t3 = setTimeout(() => {
        setPhase(4);
        onComplete?.();
      }, 2400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [active]);

  if (!active || phase === 0 || phase === 4) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden pointer-events-none select-none flex items-center justify-center">
      {/* ── KEYFRAME ANIMATIONS ── */}
      <style>{`
        @keyframes blackHoleSpawn {
          0% {
            transform: scale(0.01) rotate(0deg);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        @keyframes accretionSpin {
          0% { transform: rotate(0deg) scaleY(0.45); }
          100% { transform: rotate(360deg) scaleY(0.45); }
        }

        @keyframes lensingPulse {
          0%, 100% {
            box-shadow: 0 0 40px 15px rgba(0, 220, 255, 0.7), 0 0 90px 40px rgba(168, 85, 247, 0.5), inset 0 0 30px #000;
          }
          50% {
            box-shadow: 0 0 60px 25px rgba(56, 189, 248, 0.9), 0 0 130px 60px rgba(236, 72, 153, 0.6), inset 0 0 40px #000;
          }
        }

        @keyframes particleSpiralIn {
          0% {
            transform: rotate(var(--rot)) translateX(var(--dist)) scale(1.4);
            opacity: 0.9;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(calc(var(--rot) + 540deg)) translateX(20px) scale(0.1);
            opacity: 0;
          }
        }

        @keyframes warpStreak {
          0% {
            transform: rotate(var(--angle)) translateY(0px) scaleY(0.1);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: rotate(var(--angle)) translateY(800px) scaleY(5);
            opacity: 0;
          }
        }

        @keyframes singularityDive {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(35);
          }
        }

        @keyframes cosmicFlash {
          0% { opacity: 0; transform: scale(0.2); }
          40% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 1; transform: scale(3.5); }
        }

        @keyframes vortexDistort {
          0% { filter: blur(0px); }
          50% { filter: blur(2px); }
          100% { filter: blur(0px); }
        }
      `}</style>

      {/* ── 1. BACKGROUND VOID TINT (Dimming the village as black hole opens) ── */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-700 ease-out"
        style={{
          opacity: phase === 1 ? 0.8 : (phase === 2 ? 0.98 : 1)
        }}
      />

      {/* ── 2. THE BLACK HOLE & ACCRETION DISK (Centrally Aligned) ── */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          animation: phase >= 2 ? 'singularityDive 1.1s cubic-bezier(0.7, 0, 0.3, 1) forwards' : 'none'
        }}
      >
        {/* Lensing Einstein Ring (Outer Glowing Ring) */}
        <div 
          className="w-[280px] h-[280px] rounded-full flex items-center justify-center"
          style={{
            animation: 'blackHoleSpawn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards, lensingPulse 1.2s infinite alternate',
            background: 'radial-gradient(circle, transparent 40%, rgba(56, 189, 248, 0.4) 48%, rgba(217, 70, 239, 0.7) 54%, rgba(0, 0, 0, 0.8) 60%, transparent 72%)',
          }}
        >
          {/* Gravitational Photon Sphere (Inner Brilliant Ring) */}
          <div 
            className="w-[180px] h-[180px] rounded-full border border-cyan-300/80 flex items-center justify-center"
            style={{
              boxShadow: '0 0 25px 8px #38bdf8, inset 0 0 25px 8px #c084fc'
            }}
          >
            {/* The Pitch-Black Singularity (Pure Event Horizon) */}
            <div 
              className="w-[150px] h-[150px] rounded-full bg-black shadow-[0_0_50px_20px_rgba(0,0,0,1)]"
            />
          </div>
        </div>

        {/* 3D Tilted Relativistic Accretion Disk */}
        <div 
          className="absolute w-[440px] h-[440px] rounded-full pointer-events-none"
          style={{
            animation: 'accretionSpin 3s linear infinite',
            background: 'conic-gradient(from 0deg, #38bdf8, #818cf8, #c084fc, #f43f5e, #fb923c, #38bdf8)',
            filter: 'blur(3px)',
            opacity: 0.75,
            maskImage: 'radial-gradient(circle, transparent 35%, black 48%, black 65%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 35%, black 48%, black 65%, transparent 75%)',
          }}
        />

        {/* Relativistic Jet Core Beam */}
        <div 
          className="absolute w-1 h-[600px] bg-gradient-to-t from-transparent via-cyan-300 to-transparent blur-[1px] opacity-70 rotate-45"
        />
      </div>

      {/* ── 3. MATTER & LIGHT PARTICLES SPIRALING INTO SINGULARITY ── */}
      {phase === 1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {Array.from({ length: 90 }).map((_, i) => {
            const rot = `${(i * 360) / 90}deg`;
            const dist = `${150 + Math.random() * 450}px`;
            const dur = `${0.7 + Math.random() * 0.7}s`;
            const delay = `${Math.random() * 0.4}s`;
            const size = Math.random() * 4 + 2;
            const isCyan = i % 3 === 0;
            const isPurple = i % 3 === 1;

            return (
              <div
                key={`spiral-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: isCyan ? '#38bdf8' : (isPurple ? '#e879f9' : '#facc15'),
                  boxShadow: `0 0 10px 2px ${isCyan ? '#0284c7' : '#c026d3'}`,
                  '--rot': rot,
                  '--dist': dist,
                  animation: `particleSpiralIn ${dur} cubic-bezier(0.4, 0, 0.2, 1) ${delay} forwards`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── 4. HYPERSPACE DIVE WARP STREAKS (Phase 2) ── */}
      {phase >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {Array.from({ length: 65 }).map((_, i) => {
            const angle = `${(i * 360) / 65}deg`;
            const dur = `${0.5 + Math.random() * 0.4}s`;
            const delay = `${Math.random() * 0.25}s`;
            const color = i % 2 === 0 ? '#38bdf8' : '#e0e7ff';

            return (
              <div
                key={`streak-${i}`}
                className="absolute w-[2px] h-[60px] rounded-full origin-top"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${color}, #ffffff)`,
                  boxShadow: `0 0 8px ${color}`,
                  '--angle': angle,
                  animation: `warpStreak ${dur} cubic-bezier(0.1, 0.8, 0.2, 1) ${delay} infinite`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── 5. QUANTUM ARRIVAL FLASH (Phase 3) ── */}
      {phase >= 3 && (
        <div 
          className="absolute inset-0 bg-white"
          style={{
            animation: 'cosmicFlash 0.5s ease-out forwards'
          }}
        />
      )}
    </div>
  );
}
