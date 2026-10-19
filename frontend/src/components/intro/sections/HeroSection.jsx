import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * HeroSection — Stage 1 (Scroll 0%–19%)
 *
 * DESIGN SPECIFICATION:
 * - NO gray box, NO card, NO panel, NO background fill, NO scrim.
 * - Pure white and light-gray type floating directly on pure black negative space.
 * - Sits comfortably inside the hollow center of the framing particle ring.
 * - Small-caps pill label first.
 * - Two-line headline with first half bright white and back half trailing off in opacity.
 * - Muted gray one-line subtext below.
 * - Two pill-shaped buttons (one solid white, one outlined) well clear of ring's inner edge.
 */
export default function HeroSection({ scrollYProgress }) {
  // Stage 1 Hold: 0.00 -> 0.16; Clean upward glide out: 0.16 -> 0.20
  const opacity = useTransform(scrollYProgress, [0.0, 0.16, 0.20, 1.0], [1, 1, 0, 0]);
  const y = useTransform(scrollYProgress, [0.0, 0.16, 0.20, 1.0], [0, 0, -36, -36]);
  const pointerEvents = useTransform(scrollYProgress, (v) => (v <= 0.18 ? 'auto' : 'none'));
  const visibility = useTransform(scrollYProgress, (v) => (v <= 0.21 ? 'visible' : 'hidden'));

  // Line 1: First half bright white (100%), back half quietly fades down (60% -> 35%)
  const line1 = [
    { text: 'Visualize', opacity: 1.0 },
    { text: 'code', opacity: 1.0 },
    { text: 'in', opacity: 0.9 },
    { text: 'living', opacity: 0.6 },
    { text: 'dimension.', opacity: 0.35 },
  ];

  // Line 2: First half bright white (100%), back half quietly fades down (60% -> 35%)
  const line2 = [
    { text: 'Master', opacity: 1.0 },
    { text: 'logic', opacity: 1.0 },
    { text: 'at', opacity: 0.9 },
    { text: 'spatial', opacity: 0.6 },
    { text: 'speed.', opacity: 0.35 },
  ];

  return (
    <motion.section
      className="fixed inset-0 flex flex-col items-center justify-center text-center px-6 z-10 intro-page pointer-events-none"
      style={{ opacity, y, pointerEvents, visibility }}
    >
      {/* 
        NO background panel, NO scrim, NO gray box.
        Floating directly on pure black inside the hollow ring.
      */}
      <div className="relative flex flex-col items-center max-w-xl px-4 pointer-events-auto">

        {/* 1. Small-caps pill label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.03] mb-6">
          <Sparkles size={11} className="text-[#FF4500]" />
          <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/70">
            ✦ The 3D Computational Universe
          </span>
        </div>

        {/* 2. Large two-line headline with trailing-word opacity fade */}
        <div className="mb-4">
          {/* Line 1 */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.12] mb-1">
            {line1.map((item) => (
              <span
                key={item.text}
                className="inline-block mr-2 sm:mr-3 text-white"
                style={{ opacity: item.opacity }}
              >
                {item.text}
              </span>
            ))}
          </h1>

          {/* Line 2 */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.12]">
            {line2.map((item) => (
              <span
                key={item.text}
                className="inline-block mr-2 sm:mr-3 text-white"
                style={{ opacity: item.opacity }}
              >
                {item.text}
              </span>
            ))}
          </h2>
        </div>

        {/* 3. Muted gray one-line subtext below */}
        <p className="text-xs sm:text-sm font-normal text-white/50 max-w-lg mb-7 tracking-normal leading-relaxed">
          Transform abstract data structures, cryptographic ciphers, and polyglot execution into real-time interactive 3D simulations.
        </p>

        {/* 4. Two pill-shaped buttons: one solid white, one outlined */}
        <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
          {/* Solid white pill button */}
          <Link
            to="/visualizer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider shadow-lg shadow-white/10 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Explore OOP & Visualizers</span>
            <ArrowRight size={13} />
          </Link>

          {/* Outlined pill button */}
          <Link
            to="/sandbox"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-white/25 bg-transparent text-white/80 hover:text-white hover:border-white/50 hover:bg-white/[0.04] font-medium text-xs uppercase tracking-wider transition-all"
          >
            <span>Code Sandbox</span>
          </Link>
        </div>
      </div>

      {/* Subtle bottom scroll indicator */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1.5 opacity-40 hover:opacity-70 transition-opacity">
        <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-normal">
          Scroll to explore
        </span>
        <div className="w-3.5 h-6 rounded-full border border-white/20 flex items-start justify-center p-0.5">
          <div className="w-1 h-1.5 rounded-full bg-[#FF4500] animate-bounce" />
        </div>
      </div>
    </motion.section>
  );
}
