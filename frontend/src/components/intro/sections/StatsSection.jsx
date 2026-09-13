import React from 'react';
import { motion, useTransform } from 'framer-motion';

/**
 * StatsSection — Stage 2 (Scroll 22%–50%)
 *
 * DESIGN SPECIFICATION:
 * - Pinned to the sides in the negative space where the hourglass column narrows:
 *   - Card 1: Left side, slightly above the pinch point (top ~30%, left ~6-20%)
 *   - Card 2: Right side, below the pinch point (top ~58%, right ~6-20%)
 * - Pure contrast against black void, far outside particle silhouette (zero overlap)
 * - Quiet cards: large metric + tight explanation, fade and drift up slightly with scroll
 * - Clean technical styling: subtle glowing accent line, backdrop blur
 */
export default function StatsSection({ scrollYProgress }) {
  // Master container visibility: active between 0.21 and 0.51
  const sectionOpacity = useTransform(scrollYProgress, [0.0, 0.21, 0.25, 0.46, 0.50, 1.0], [0, 0, 1, 1, 0, 0]);
  const pointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.23 && v <= 0.48 ? 'auto' : 'none'));
  const visibility = useTransform(scrollYProgress, (v) => (v >= 0.21 && v <= 0.51 ? 'visible' : 'hidden'));

  // ── CARD 1: Left of column waist, slightly above pinch point ──
  // Smooth entrance (0.22 -> 0.25), locked rock-solid throughout reading hold (0.25 -> 0.46), clean exit (0.46 -> 0.49)
  const c1Opacity = useTransform(scrollYProgress, [0.0, 0.21, 0.25, 0.46, 0.49, 1.0], [0, 0, 1, 1, 0, 0]);
  const c1Y = useTransform(scrollYProgress, [0.0, 0.21, 0.25, 0.46, 0.49, 1.0], [24, 24, 0, 0, -24, -24]);

  // ── CARD 2: Right of column waist, below pinch point ──
  // Micro-staggered entrance (0.23 -> 0.26), locked rock-solid throughout reading hold (0.26 -> 0.46), clean exit (0.46 -> 0.50)
  const c2Opacity = useTransform(scrollYProgress, [0.0, 0.22, 0.26, 0.46, 0.50, 1.0], [0, 0, 1, 1, 0, 0]);
  const c2Y = useTransform(scrollYProgress, [0.0, 0.22, 0.26, 0.46, 0.50, 1.0], [24, 24, 0, 0, -24, -24]);

  return (
    <motion.section
      className="fixed inset-0 z-10 pointer-events-none intro-page"
      style={{ opacity: sectionOpacity, pointerEvents, visibility }}
    >
      {/* ── CARD 1: Left side, slightly above pinch point ── */}
      <motion.div
        className="absolute top-[28%] sm:top-[30%] left-6 sm:left-10 md:left-16 lg:left-24 max-w-[270px] sm:max-w-[310px] pointer-events-auto"
        style={{ opacity: c1Opacity, y: c1Y }}
      >
        <div className="p-6 rounded-2xl bg-[#06080e]/92 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/90 relative overflow-hidden">
          {/* Cool blue-violet top accent line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#2E47FA] to-transparent opacity-90" />

          {/* Metric value */}
          <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-1">
            50+
          </div>

          {/* Metric label */}
          <div className="text-sm font-semibold text-white/90 mb-1.5 tracking-normal">
            Interactive Algorithms
          </div>

          {/* Description */}
          <p className="text-xs font-normal text-white/50 leading-relaxed">
            Step-by-step 3D models across 8 data structures, self-balancing trees, dynamic graphs, and 4 OOP design paradigms.
          </p>
        </div>
      </motion.div>

      {/* ── CARD 2: Right side, below pinch point ── */}
      <motion.div
        className="absolute top-[54%] sm:top-[56%] right-6 sm:right-10 md:right-16 lg:right-24 max-w-[270px] sm:max-w-[310px] pointer-events-auto"
        style={{ opacity: c2Opacity, y: c2Y }}
      >
        <div className="p-6 rounded-2xl bg-[#06080e]/92 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/90 relative overflow-hidden">
          {/* Warm red-orange top accent line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF380F] to-transparent opacity-90" />

          {/* Metric value */}
          <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-1">
            13
          </div>

          {/* Metric label */}
          <div className="text-sm font-semibold text-white/90 mb-1.5 tracking-normal">
            Cryptographic Engines
          </div>

          {/* Description */}
          <p className="text-xs font-normal text-white/50 leading-relaxed">
            From WWII Enigma machines and classic ciphers to AES-128 rounds, RSA key generation, and SHA-256 block hashing.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}

