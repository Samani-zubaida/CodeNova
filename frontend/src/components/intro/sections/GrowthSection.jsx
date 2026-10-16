import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * GrowthSection — Stage 3: The Wave Section (Scroll 54%–74%)
 *
 * DESIGN SPECIFICATION:
 * - Empty upper zone: The entire top ~60% of the screen is pure black empty space.
 * - Deliberate pure-black buffer between the text block and the wave ridge below.
 * - Left-aligned, two-column layout:
 *   - Far left: small pill eyebrow ("✦ The pull of mastery")
 *   - Left column: two-line headline with trailing-fade attention gradient on "your growth."
 *   - Right column (vertically centered against headline): supporting paragraph + two CTA pills
 * - No floating stat cards (typography-over-terrain only)
 * - Staggered fade + rise entrances for each text element
 */
export default function GrowthSection({ scrollYProgress }) {
  // Master container visibility: active 0.53 to 0.75 (exits as wave starts bending into sinkhole)
  const sectionOpacity = useTransform(scrollYProgress, [0.0, 0.53, 0.58, 0.70, 0.74, 1.0], [0, 0, 1, 1, 0, 0]);
  const pointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.56 && v <= 0.72 ? 'auto' : 'none'));
  const visibility = useTransform(scrollYProgress, (v) => (v >= 0.53 && v <= 0.75 ? 'visible' : 'hidden'));

  // ── Coordinated Entrance & Stable Reading Hold (0.58 -> 0.70) ──
  // 1. Eyebrow
  const eyeOpacity = useTransform(scrollYProgress, [0.0, 0.53, 0.57, 0.70, 0.74, 1.0], [0, 0, 1, 1, 0, 0]);
  const eyeY = useTransform(scrollYProgress, [0.0, 0.53, 0.57, 0.70, 0.74, 1.0], [18, 18, 0, 0, -22, -22]);

  // 2. Headline
  const headOpacity = useTransform(scrollYProgress, [0.0, 0.54, 0.58, 0.70, 0.74, 1.0], [0, 0, 1, 1, 0, 0]);
  const headY = useTransform(scrollYProgress, [0.0, 0.54, 0.58, 0.70, 0.74, 1.0], [22, 22, 0, 0, -22, -22]);

  // 3. Paragraph
  const paraOpacity = useTransform(scrollYProgress, [0.0, 0.54, 0.58, 0.70, 0.74, 1.0], [0, 0, 1, 1, 0, 0]);
  const paraY = useTransform(scrollYProgress, [0.0, 0.54, 0.58, 0.70, 0.74, 1.0], [26, 26, 0, 0, -22, -22]);

  // 4. CTA Buttons
  const btnOpacity = useTransform(scrollYProgress, [0.0, 0.55, 0.58, 0.70, 0.74, 1.0], [0, 0, 1, 1, 0, 0]);
  const btnY = useTransform(scrollYProgress, [0.0, 0.55, 0.58, 0.70, 0.74, 1.0], [30, 30, 0, 0, -22, -22]);

  // Headline words with trailing-fade attention gradient on "execute in real-time."
  const line1 = "Write in your language —";
  const line2Part1 = "execute";
  const trailingWords = [
    { text: "in", opacity: 0.55 },
    { text: "real-time.", opacity: 0.28 },
  ];

  return (
    <motion.section
      className="fixed inset-0 z-10 pointer-events-none intro-page"
      style={{ opacity: sectionOpacity, pointerEvents, visibility }}
    >
      {/* 
        Upper Zone Container:
        Anchored in the top half of the screen (top-12 to top-20).
        Leaves a generous pure-black buffer above the particle ridge below.
      */}
      <div className="absolute top-[8%] sm:top-[11%] md:top-[13%] inset-x-0 max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 pointer-events-auto">
        
        {/* Far Left: Small Pill Eyebrow */}
        <motion.div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.03] mb-5 sm:mb-6"
          style={{ opacity: eyeOpacity, y: eyeY }}
        >
          <Sparkles size={11} className="text-[#2E47FA]" />
          <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/70">
            ✦ The Live Code Workshop
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
                <span className="text-white mr-2.5">{line2Part1}</span>
                {trailingWords.map((item) => (
                  <span
                    key={item.text}
                    className="inline-block mr-2 text-white"
                    style={{ opacity: item.opacity }}
                  >
                    {item.text}
                  </span>
                ))}
              </span>
            </h2>
          </motion.div>

          {/* ── RIGHT COLUMN: Supporting Paragraph + CTA Pills ── */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Supporting paragraph tailored to Code Nova */}
            <motion.p
              className="text-xs sm:text-sm md:text-[0.95rem] font-normal text-white/55 leading-relaxed mb-6 max-w-lg tracking-normal"
              style={{ opacity: paraOpacity, y: paraY }}
            >
              Polyglot Monaco editor powering Python, JavaScript, C++, and Java. Built-in output terminal, automatic Big-O complexity detection, and live AST visual canvases generated directly from your syntax.
            </motion.p>

            {/* Two CTA Pills: One Solid White, One Outlined */}
            <motion.div
              className="flex flex-row items-center gap-3 sm:gap-4 flex-wrap"
              style={{ opacity: btnOpacity, y: btnY }}
            >
              {/* Solid White Pill */}
              <Link
                to="/sandbox"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm shadow-xl shadow-white/10 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Launch Sandbox</span>
                <ArrowRight size={14} />
              </Link>

              {/* Outlined Pill */}
              <Link
                to="/oop"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-full border border-white/20 bg-white/[0.03] text-white/80 hover:text-white hover:bg-white/[0.08] hover:border-white/35 font-medium text-xs sm:text-sm transition-all"
              >
                <span>Explore OOP & Visualizers</span>
              </Link>
            </motion.div>
          </div>

        </div>

      </div>
    </motion.section>
  );
}

