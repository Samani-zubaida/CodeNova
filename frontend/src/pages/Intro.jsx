import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useScroll, motion, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';

import ParticleField from '../components/intro/ParticleField';
import IntroCamera from '../components/intro/IntroCamera';
import HeroSection from '../components/intro/sections/HeroSection';
import StatsSection from '../components/intro/sections/StatsSection';
import GrowthSection from '../components/intro/sections/GrowthSection';
import GalaxySection from '../components/intro/sections/GalaxySection';

/**
 * Intro — High-End Scroll-Scrubbed 3D Particle Morphing Experience.
 *
 * ARCHITECTURE:
 * - Single persistent Three.js <Canvas> with Bloom post-processing
 * - 18,000 particles continuously morphing across 4 stages via GPU GLSL shaders
 * - One scrollYProgress value as single source of truth
 * - Sections are pinned to the viewport with dedicated safe zones and dead-zone transitions
 * - Butter-smooth Lenis inertial scrolling
 */
// High-precision smooth scroll driver that keeps 3D scene in lockstep with DOM overlays
function SmoothScrollDriver({ rawRef, smoothRef }) {
  useFrame((state, delta) => {
    const target = rawRef.current || 0;
    // High-frequency critically damped response (~30ms) guarantees zero lag against text overlays
    // while filtering out sub-frame mousewheel notch jitter
    smoothRef.current = THREE.MathUtils.damp(smoothRef.current || 0, target, 22.0, delta);
  });
  return null;
}

export default function Intro() {
  const scrollContainerRef = useRef(null);
  const rawScrollProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  // Single source of truth for the entire page
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  // Sync Framer Motion progress directly to canvas ref without triggering React re-renders
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      rawScrollProgressRef.current = v;
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Lenis smooth scroll configuration with proper RAF lifecycle
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const onScroll = (e) => {
      rawScrollProgressRef.current = e.progress;
    };
    lenis.on('scroll', onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', onScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative bg-[#050508] text-white selection:bg-[#FF6B35]/30 selection:text-white">
      {/* ── PERSISTENT 3D CANVAS WITH BLOOM ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0.0, 7.2], fov: 50, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.05} />

          {/* Unified frame-rate independent smooth progress driver */}
          <SmoothScrollDriver rawRef={rawScrollProgressRef} smoothRef={smoothProgressRef} />

          {/* Morphing GPU particle field */}
          <ParticleField scrollRef={smoothProgressRef} />

          {/* Camera movement controller */}
          <IntroCamera scrollRef={smoothProgressRef} />

          {/* Cinematic Bloom Postprocessing */}
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.18}
              luminanceSmoothing={0.85}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* ── TOP CORNER NAVIGATION ── */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          to="/visualizer"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors py-2 px-3 rounded-full bg-[#050508]/40 backdrop-blur-md border border-white/[0.06]"
        >
          <span className="text-[#FF6B35]">→</span>
          <span>Visualizers</span>
        </Link>
      </div>

      {/* ── VERTICAL PROGRESS TRACKER (Right Edge) ── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3">
        <div className="w-[2px] h-32 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            className="w-full bg-[#FF6B35] origin-top"
            style={{
              height: '100%',
              scaleY: scrollYProgress,
            }}
          />
        </div>
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-medium rotate-90 translate-y-2">
          Progress
        </span>
      </div>


      {/* ── PINNED SECTION OVERLAYS (Dead-space & safe-zone separated) ── */}
      <HeroSection scrollYProgress={scrollYProgress} />
      <StatsSection scrollYProgress={scrollYProgress} />
      <GrowthSection scrollYProgress={scrollYProgress} />
      <GalaxySection scrollYProgress={scrollYProgress} />

      {/* ── SCROLL CONTAINER TRACK (520vh) ── */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 pointer-events-none"
        style={{ height: '520vh' }}
      />

      {/* ── CINEMATIC EDGE VIGNETTES ── */}
      <div className="fixed inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050508] via-[#050508]/60 to-transparent z-[5] pointer-events-none" />
      <div className="fixed inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent z-[5] pointer-events-none" />
    </div>
  );
}
