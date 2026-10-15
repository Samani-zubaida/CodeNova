import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * GalaxySection — Stage 4: Product Ecosystem Galaxy Section (Scroll 88%–100%)
 *
 * DESIGN SPECIFICATION:
 * - Empty upper zone: The typography sits in the top half of the screen, left-aligned,
 *   above the tilted orbital galaxy disc in the bottom half.
 * - Same left-aligned two-column discipline as GrowthSection ("Everything revolves"):
 *   - Far left: small pill eyebrow ("✦ Our product ecosystem")
 *   - Left column: two-line headline with trailing-fade attention gradient on "already in motion."
 *   - Right column: single-line supporting sentence slightly indented, plus two CTA pills:
 *     - Solid "Explore the ecosystem →"
 *     - Outlined "View integrations"
 * - Zero intrusive background scrim boxes or centered cards.
 * - Smooth fade + rise entrance with zero flinch.
 */
export default function GalaxySection({ scrollYProgress }) {
  // Master container visibility: enters smoothly after singularity unfurls (0.88 -> 0.92), holds through 1.00
  const sectionOpacity = useTransform(scrollYProgress, [0.0, 0.88, 0.92, 1.0], [0, 0, 1, 1]);
  const pointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.90 ? 'auto' : 'none'));
  const visibility = useTransform(scrollYProgress, (v) => (v >= 0.88 ? 'visible' : 'hidden'));

  // Staggered entrances
  // 1. Eyebrow
  const eyeOpacity = useTransform(scrollYProgress, [0.0, 0.88, 0.915, 1.0], [0, 0, 1, 1]);
  const eyeY = useTransform(scrollYProgress, [0.0, 0.88, 0.915, 1.0], [16, 16, 0, 0]);

  // 2. Headline
  const headOpacity = useTransform(scrollYProgress, [0.0, 0.89, 0.925, 1.0], [0, 0, 1, 1]);
  const headY = useTransform(scrollYProgress, [0.0, 0.89, 0.925, 1.0], [20, 20, 0, 0]);

  // 3. Paragraph
  const paraOpacity = useTransform(scrollYProgress, [0.0, 0.895, 0.93, 1.0], [0, 0, 1, 1]);
  const paraY = useTransform(scrollYProgress, [0.0, 0.895, 0.93, 1.0], [24, 24, 0, 0]);

  // 4. CTA Buttons
  const btnOpacity = useTransform(scrollYProgress, [0.0, 0.90, 0.935, 1.0], [0, 0, 1, 1]);
  const btnY = useTransform(scrollYProgress, [0.0, 0.90, 0.935, 1.0], [28, 28, 0, 0]);

  const line1 = "An entire universe of learning —";
  const trailingWords = [
    { text: "already", opacity: 0.50 },
    { text: "in", opacity: 0.35 },
    { text: "motion.", opacity: 0.20 },
  ];

  return (
    <motion.section
      className="fixed inset-0 z-10 pointer-events-none intro-page"
      style={{ opacity: sectionOpacity, pointerEvents, visibility }}
    >
      {/* 
        Upper Zone Container:
        Anchored in the top half of the screen (top-[8%] to top-[13%]).
        Leaves the bottom ~50% completely open for the tilted orbital galaxy disc.
      */}
      <div className="absolute top-[8%] sm:top-[11%] md:top-[13%] inset-x-0 max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 pointer-events-auto">
        
        {/* Far Left: Small Pill Eyebrow */}
        <motion.div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.03] mb-5 sm:mb-6"
          style={{ opacity: eyeOpacity, y: eyeY }}
        >
          <Sparkles size={11} className="text-[#FF380F]" />
          <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/70">
            ✦ The CodeNova Ecosystem
          </span>
        </motion.div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
          
          {/* ── LEFT COLUMN: Two-Line Headline with Trailing Fade ── */}
          <motion.div
            className="lg:col-span-6"
            style={{ opacity: headOpacity, y: headY }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.12] text-white">
              <span className="block mb-1 sm:mb-2">{line1}</span>
              <span className="block">
                {trailingWords.map((item) => (
                  <span
                    key={item.text}
                    className="inline-block mr-2.5 text-white"
                    style={{ opacity: item.opacity }}
                  >
                    {item.text}
                  </span>
                ))}
              </span>
            </h2>
          </motion.div>

          {/* ── RIGHT COLUMN: Supporting Sentence + CTA Pills ── */}
          <div className="lg:col-span-6 flex flex-col justify-center lg:pl-2">
            {/* Supporting sentence slightly indented under second headline line */}
            <motion.p
              className="text-xs sm:text-sm md:text-base font-normal text-white/60 mb-6 sm:mb-7 leading-relaxed tracking-normal"
              style={{ opacity: paraOpacity, y: paraY }}
            >
              Step into an explorable 2D RPG village with real-time portals, test your mastery across 6-tier Arena challenges, compete in 1v1 coding duels, and host live algorithmic competitions.
            </motion.p>

            {/* Dual CTA Pills */}
            <motion.div
              className="flex flex-row items-center gap-3 sm:gap-4 flex-wrap"
              style={{ opacity: btnOpacity, y: btnY }}
            >
              {/* Solid CTA Pill */}
              <Link
                to="/home"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#FF380F] text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-[#FF380F]/25 hover:bg-[#ff4e29] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Enter the Village</span>
                <ArrowRight size={14} />
              </Link>

              {/* Outlined CTA Pill */}
              <Link
                to="/game"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full border border-white/20 bg-white/[0.02] text-white/80 hover:text-white hover:bg-white/[0.06] hover:border-white/40 font-medium text-xs sm:text-sm tracking-wide transition-all"
              >
                <span>Join the Arena</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle bottom credits */}
      <div className="absolute bottom-6 inset-x-0 text-center text-white/20 text-[10px] tracking-[0.35em] uppercase font-normal pointer-events-none">
        Interactive 3D Simulation · Three.js · React
      </div>
    </motion.section>
  );
}
