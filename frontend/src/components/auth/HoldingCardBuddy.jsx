import React, { useEffect } from 'react';

/**
 * HoldingCardBuddy - Fused "Holding the Card" Full-Body Layout
 * 
 * Used for Mobile, Tablet Portrait, Split-Screen, and all viewports
 * where the buddy cannot be cleanly aligned horizontally side-by-side.
 *
 * The 3D developer character physically holds the dark glassmorphic login card:
 * - Head and shoulders rise above the card with friendly expression
 * - Arms bend outward at the sides in a weight-bearing grip
 * - Hands grip the top-left and top-right card corners from behind
 * - The card sits at chest height
 * - Legs with rolled denim cuffs and clean white sneakers peek out and ground below the card
 * - Entire composition is compact and fixed within 100dvh without scrolling
 */
const HOLDING_FULLBODY = {
  idle: '/assets/buddy/buddy_fullbody_holding_idle.png',
  peek: '/assets/buddy/buddy_fullbody_holding_peek.png',
  thinking: '/assets/buddy/buddy_fullbody_holding_thinking.png',
  success: '/assets/buddy/buddy_fullbody_holding_success.png',
  fail: '/assets/buddy/buddy_fullbody_holding_fail.png',
  missing_input: '/assets/buddy/buddy_fullbody_holding_thinking.png',
};

export default function HoldingCardBuddy({ mood = 'idle', children }) {
  // Preload all holding poses for instant reactive mood transitions
  useEffect(() => {
    Object.values(HOLDING_FULLBODY).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const activeImage = HOLDING_FULLBODY[mood] || HOLDING_FULLBODY.idle;

  return (
    <div className="relative w-full flex flex-col items-center justify-center auth-holding-wrapper">
      {/* ── 1. Soft Ambient Mood Glow Behind Character & Card ── */}
      <div
        className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-[340px] sm:w-[400px] h-[460px] rounded-full blur-[80px] pointer-events-none transition-all duration-500 z-0 opacity-40"
        style={{
          background:
            mood === 'success'
              ? 'radial-gradient(circle, rgba(197, 206, 174, 0.8) 0%, transparent 70%)'
              : mood === 'fail'
              ? 'radial-gradient(circle, rgba(239, 68, 68, 0.7) 0%, transparent 70%)'
              : mood === 'thinking'
              ? 'radial-gradient(circle, rgba(121, 40, 202, 0.7) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(171, 82, 107, 0.6) 0%, transparent 70%)',
        }}
      />

      {/* ── 2. Scaled Holding Composition Container ── */}
      <div
        className={`relative w-full max-w-[325px] sm:max-w-[335px] mx-auto pt-[190px] sm:pt-[205px] pb-5 transition-transform duration-300 ${
          mood === 'success' ? 'animate-devBounce' : ''
        }`}
      >
        {/* ── 3. Full-Body Standing 3D Character (Behind Card, z-10) ── */}
        <div
          className={`absolute top-[-95px] sm:top-[-100px] left-1/2 -translate-x-1/2 w-[460px] sm:w-[480px] h-[800px] sm:h-[830px] z-10 pointer-events-none flex flex-col items-center ${
            mood === 'fail' ? 'animate-headShake' : ''
          }`}
        >
          <img
            src={activeImage}
            alt="Dev Buddy holding login card"
            className="w-full h-full object-contain object-top filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
          />
        </div>

        {/* ── 4. The Glassmorphic Login Card (z-20) ── */}
        <div className="relative z-20 w-full">
          {children}
        </div>

        {/* ── 5. Sneaker Floor Grounding Shadow (z-0) ── */}
        <div className="w-48 h-3 mx-auto mt-1 rounded-full bg-black/85 blur-sm pointer-events-none z-0" />
      </div>
    </div>
  );
}
