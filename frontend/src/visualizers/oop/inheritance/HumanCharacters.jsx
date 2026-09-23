import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// HIERARCHICAL INHERITANCE - 2.5D / 3D HUMAN CHARACTERS
// 1. Person (Parent / Superclass) - Tallest, Dusky skin, Long brown hair, Glasses
// 2. Child1 (Subclass) - Shorter, Dusky skin (inherited), Glasses (inherited), Black hair (overridden)
// 3. Child2 (Subclass) - Tall (inherited), Brown hair (inherited), Fair skin (own), Blue eyes (own)
// ============================================================================

/**
 * 1. PERSON CHARACTER (Parent / Superclass)
 * Tallest character, Dusky skin tone, Long brown hair, Glasses/specs, Professional appearance.
 */
export const PersonCharacter = ({ isHovered = false, isDimmed = false }) => {
  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.05 : 1,
        y: isHovered ? -4 : 0,
        opacity: isDimmed ? 0.35 : 1,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative w-22 h-30 sm:w-26 sm:h-34 flex items-center justify-center select-none shrink-0"
    >
      {/* Ambient Floor Shadow */}
      <div className="absolute -bottom-2 w-28 h-4 bg-amber-500/20 rounded-full blur-md" />

      {/* Atmospheric Backlight / Luminous Warm Amber Outline */}
      <motion.div
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : 0.35,
          scale: isHovered ? [1, 1.08, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-orange-400/20 to-yellow-500/30 rounded-full blur-xl pointer-events-none"
      />

      <svg
        viewBox="0 0 120 180"
        className="w-full h-full relative z-10 drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dusky Skin Tone Gradient */}
          <radialGradient id="personDuskySkin" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#A86E49" />
            <stop offset="60%" stopColor="#8D5533" />
            <stop offset="100%" stopColor="#6C3E22" />
          </radialGradient>

          {/* Long Brown Hair Gradient */}
          <linearGradient id="personBrownHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E3D1D" />
            <stop offset="50%" stopColor="#532C12" />
            <stop offset="100%" stopColor="#381B09" />
          </linearGradient>

          {/* Professional Attire Gradient */}
          <linearGradient id="personBlazer" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#242B38" />
            <stop offset="50%" stopColor="#151B26" />
            <stop offset="100%" stopColor="#0B0F17" />
          </linearGradient>

          {/* Amber Lapel Accent */}
          <linearGradient id="personAmberLapel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Glasses Lens Shimmer */}
          <linearGradient id="lensGlare" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── BACK HAIR (Long flowing brown hair behind neck & shoulders) ── */}
        <path
          d="M 36 38 C 30 55, 26 85, 28 112 C 32 116, 40 105, 42 88 L 78 88 C 80 105, 88 116, 92 112 C 94 85, 90 55, 84 38 Z"
          fill="url(#personBrownHair)"
        />

        {/* ── UPPER BODY & TORSO (Tailored Professional Suit) ── */}
        <path
          d="M 30 82 C 28 115, 24 152, 26 178 L 94 178 C 96 152, 92 115, 90 82 C 84 73, 72 70, 60 70 C 48 70, 36 73, 30 82 Z"
          fill="url(#personBlazer)"
          stroke="#F59E0B"
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />

        {/* Crisp Shirt Collar & Tie */}
        <polygon points="60,74 48,118 72,118" fill="#F8FAFC" />
        <polygon points="58,78 62,78 63,110 60,116 57,110" fill="url(#personAmberLapel)" />

        {/* Blazer Lapels */}
        <path d="M 30 82 L 52 124 L 38 172" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.7" />
        <path d="M 90 82 L 68 124 L 82 172" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.7" />

        {/* Neck */}
        <rect x="52" y="60" width="16" height="18" rx="5" fill="url(#personDuskySkin)" />
        <path d="M 52 68 Q 60 75 68 68" fill="none" stroke="#6C3E22" strokeWidth="1.5" opacity="0.4" />

        {/* ── HEAD & FACIAL ANATOMY ── */}
        {/* Ears */}
        <circle cx="37" cy="46" r="6" fill="url(#personDuskySkin)" />
        <circle cx="83" cy="46" r="6" fill="url(#personDuskySkin)" />

        {/* Face Base */}
        <path
          d="M 38 34 C 38 18, 82 18, 82 34 C 82 54, 76 68, 60 68 C 44 68, 38 54, 38 34 Z"
          fill="url(#personDuskySkin)"
        />

        {/* Refined Eyebrows */}
        <path d="M 44 34 Q 51 31 56 34" fill="none" stroke="#381B09" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 64 34 Q 69 31 76 34" fill="none" stroke="#381B09" strokeWidth="2.2" strokeLinecap="round" />

        {/* Eyes (Brown irises) */}
        <ellipse cx="50" cy="40" rx="3.2" ry="3.5" fill="#381B09" />
        <ellipse cx="70" cy="40" rx="3.2" ry="3.5" fill="#381B09" />
        <circle cx="51" cy="39" r="1.1" fill="#FFFFFF" />
        <circle cx="71" cy="39" r="1.1" fill="#FFFFFF" />

        {/* ── GLASSES / SPECS (Distinctive inherited trait) ── */}
        {/* Left Rim */}
        <rect x="42" y="32" width="16" height="15" rx="3.5" fill="url(#lensGlare)" stroke="#F59E0B" strokeWidth="1.6" />
        {/* Right Rim */}
        <rect x="62" y="32" width="16" height="15" rx="3.5" fill="url(#lensGlare)" stroke="#F59E0B" strokeWidth="1.6" />
        {/* Glasses Bridge */}
        <line x1="58" y1="38" x2="62" y2="38" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        {/* Glasses Temples (connecting to ears) */}
        <line x1="42" y1="36" x2="37" y2="40" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="78" y1="36" x2="83" y2="40" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" />

        {/* Nose */}
        <path d="M 60 38 L 58 48 L 62 49" fill="none" stroke="#6C3E22" strokeWidth="1.8" strokeLinecap="round" />

        {/* Mature Warm Smile */}
        <path d="M 52 56 Q 60 61 68 56" fill="none" stroke="#532C12" strokeWidth="2.2" strokeLinecap="round" />

        {/* ── FRONT HAIR (Long parted brown hair with volume) ── */}
        <path
          d="M 38 32 C 38 12, 82 12, 82 32 C 82 36, 76 25, 60 25 C 44 25, 38 36, 38 32 Z"
          fill="url(#personBrownHair)"
        />
        {/* Side hair wisps */}
        <path d="M 37 32 Q 35 48 37 60" fill="none" stroke="url(#personBrownHair)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 83 32 Q 85 48 83 60" fill="none" stroke="url(#personBrownHair)" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

/**
 * 2. CHILD1 CHARACTER (Subclass 1: Child1 extends Person)
 * Inherits Dusky skin and Glasses from Person.
 * Has OWN/OVERRIDDEN Black Hair and Shorter Height.
 */
export const Child1Character = ({ isHovered = false, isDimmed = false }) => {
  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.05 : 1,
        y: isHovered ? -4 : 0,
        opacity: isDimmed ? 0.35 : 1,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative w-17 h-23 sm:w-19 sm:h-26 flex items-center justify-center select-none shrink-0"
    >
      {/* Ambient Floor Shadow */}
      <div className="absolute -bottom-2 w-20 h-3.5 bg-emerald-500/20 rounded-full blur-md" />

      {/* Atmospheric Backlight / Luminous Emerald Outline */}
      <motion.div
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : 0.35,
          scale: isHovered ? [1, 1.08, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-teal-400/20 to-cyan-500/30 rounded-full blur-xl pointer-events-none"
      />

      <svg
        viewBox="0 0 120 170"
        className="w-full h-full relative z-10 drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* INHERITED: Dusky Skin Tone (Identical to Person) */}
          <radialGradient id="child1DuskySkin" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#A86E49" />
            <stop offset="60%" stopColor="#8D5533" />
            <stop offset="100%" stopColor="#6C3E22" />
          </radialGradient>

          {/* OWN / OVERRIDDEN: Black Hair */}
          <linearGradient id="child1BlackHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3F3F46" />
            <stop offset="50%" stopColor="#18181B" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>

          {/* Emerald Youth Attire */}
          <linearGradient id="child1Jacket" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="60%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Glasses Lens Shimmer */}
          <linearGradient id="child1Lens" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#34D399" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── UPPER BODY & TORSO (Modern Youth Jacket) ── */}
        <path
          d="M 32 82 C 30 110, 26 142, 28 168 L 92 168 C 94 142, 90 110, 88 82 C 82 74, 70 72, 60 72 C 50 72, 38 74, 32 82 Z"
          fill="url(#child1Jacket)"
          stroke="#10B981"
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />

        {/* Inner Shirt Collar */}
        <polygon points="60,76 52,106 68,106" fill="#F1F5F9" />

        {/* Jacket Zipper */}
        <line x1="60" y1="106" x2="60" y2="168" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Neck */}
        <rect x="53" y="62" width="14" height="16" rx="4" fill="url(#child1DuskySkin)" />

        {/* ── HEAD & FACIAL ANATOMY ── */}
        {/* Ears */}
        <circle cx="38" cy="48" r="5.5" fill="url(#child1DuskySkin)" />
        <circle cx="82" cy="48" r="5.5" fill="url(#child1DuskySkin)" />

        {/* Face (Inherited Dusky Skin) */}
        <path
          d="M 39 36 C 39 20, 81 20, 81 36 C 81 54, 75 66, 60 66 C 45 66, 39 54, 39 36 Z"
          fill="url(#child1DuskySkin)"
        />

        {/* Eyebrows (Black, matching own hair) */}
        <path d="M 45 35 Q 51 32 55 35" fill="none" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 65 35 Q 69 32 75 35" fill="none" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />

        {/* Eyes (Brown) */}
        <ellipse cx="50" cy="41" rx="3" ry="3.2" fill="#18181B" />
        <ellipse cx="70" cy="41" rx="3" ry="3.2" fill="#18181B" />
        <circle cx="51" cy="40" r="1" fill="#FFFFFF" />
        <circle cx="71" cy="40" r="1" fill="#FFFFFF" />

        {/* ── INHERITED GLASSES / SPECS (Inherited from Person) ── */}
        <rect x="43" y="34" width="15" height="14" rx="3" fill="url(#child1Lens)" stroke="#10B981" strokeWidth="1.5" />
        <rect x="62" y="34" width="15" height="14" rx="3" fill="url(#child1Lens)" stroke="#10B981" strokeWidth="1.5" />
        <line x1="58" y1="40" x2="62" y2="40" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="43" y1="38" x2="38" y2="42" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="77" y1="38" x2="82" y2="42" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />

        {/* Nose */}
        <path d="M 60 40 L 59 48 L 62 49" fill="none" stroke="#6C3E22" strokeWidth="1.6" strokeLinecap="round" />

        {/* Cheerful Smile */}
        <path d="M 54 55 Q 60 60 66 55" fill="none" stroke="#532C12" strokeWidth="2" strokeLinecap="round" />

        {/* ── OWN / OVERRIDDEN BLACK HAIR (Short modern haircut) ── */}
        <path
          d="M 38 34 C 38 12, 82 12, 82 34 C 82 36, 76 22, 60 22 C 44 22, 38 36, 38 34 Z"
          fill="url(#child1BlackHair)"
        />
        {/* Modern textured hair spikes on top */}
        <path d="M 46 22 Q 52 14 58 20" fill="none" stroke="url(#child1BlackHair)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 58 20 Q 64 13 72 22" fill="none" stroke="url(#child1BlackHair)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

/**
 * 3. CHILD2 CHARACTER (Subclass 2: Child2 extends Person)
 * Inherits Brown hair and Tall height from Person.
 * Has OWN Fair skin and Blue eyes. No glasses.
 */
export const Child2Character = ({ isHovered = false, isDimmed = false }) => {
  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.05 : 1,
        y: isHovered ? -4 : 0,
        opacity: isDimmed ? 0.35 : 1,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative w-21 h-29 sm:w-25 sm:h-33 flex items-center justify-center select-none shrink-0"
    >
      {/* Ambient Floor Shadow */}
      <div className="absolute -bottom-2 w-26 h-4 bg-indigo-500/20 rounded-full blur-md" />

      {/* Atmospheric Backlight / Luminous Indigo Outline */}
      <motion.div
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : 0.35,
          scale: isHovered ? [1, 1.08, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 via-blue-400/20 to-violet-500/30 rounded-full blur-xl pointer-events-none"
      />

      <svg
        viewBox="0 0 120 178"
        className="w-full h-full relative z-10 drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* OWN PROPERTY: Fair Skin Tone */}
          <radialGradient id="child2FairSkin" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#FFE0C8" />
            <stop offset="55%" stopColor="#F7C4A5" />
            <stop offset="100%" stopColor="#E2A682" />
          </radialGradient>

          {/* INHERITED: Brown Hair Gradient (Matching Person) */}
          <linearGradient id="child2BrownHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E3D1D" />
            <stop offset="50%" stopColor="#532C12" />
            <stop offset="100%" stopColor="#381B09" />
          </linearGradient>

          {/* Contemporary Indigo Attire */}
          <linearGradient id="child2Attire" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="60%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>

          {/* Radiant Blue Eye Gradient */}
          <radialGradient id="radiantBlueEyes" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </radialGradient>
        </defs>

        {/* ── UPPER BODY & TORSO (Tall Frame, Matching Person Height) ── */}
        <path
          d="M 31 82 C 29 112, 25 148, 27 174 L 93 174 C 95 148, 91 112, 89 82 C 83 73, 71 70, 60 70 C 49 70, 37 73, 31 82 Z"
          fill="url(#child2Attire)"
          stroke="#818CF8"
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />

        {/* Contrast Crew Neck Collar */}
        <path d="M 48 70 C 48 82, 72 82, 72 70" fill="none" stroke="#C7D2FE" strokeWidth="2.5" />

        {/* Neck (Fair skin) */}
        <rect x="52" y="58" width="16" height="16" rx="5" fill="url(#child2FairSkin)" />

        {/* ── HEAD & FACIAL ANATOMY ── */}
        {/* Ears */}
        <circle cx="37" cy="46" r="6" fill="url(#child2FairSkin)" />
        <circle cx="83" cy="46" r="6" fill="url(#child2FairSkin)" />

        {/* Face (Own Fair Skin) */}
        <path
          d="M 38 34 C 38 18, 82 18, 82 34 C 82 54, 76 66, 60 66 C 44 66, 38 54, 38 34 Z"
          fill="url(#child2FairSkin)"
        />

        {/* Eyebrows (Brown, matching inherited hair) */}
        <path d="M 44 33 Q 51 30 56 33" fill="none" stroke="#532C12" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 64 33 Q 69 30 76 33" fill="none" stroke="#532C12" strokeWidth="2.2" strokeLinecap="round" />

        {/* ── OWN PROPERTY: RADIANT BLUE EYES (High Contrast & Catchlights) ── */}
        <ellipse cx="50" cy="40" rx="4" ry="4.2" fill="#FFFFFF" />
        <ellipse cx="70" cy="40" rx="4" ry="4.2" fill="#FFFFFF" />

        {/* Blue Irises */}
        <circle cx="50" cy="40" r="3.2" fill="url(#radiantBlueEyes)" />
        <circle cx="70" cy="40" r="3.2" fill="url(#radiantBlueEyes)" />

        {/* Pupils */}
        <circle cx="50" cy="40" r="1.5" fill="#0F172A" />
        <circle cx="70" cy="40" r="1.5" fill="#0F172A" />

        {/* Vivid White Glint / Catchlight */}
        <circle cx="51.2" cy="38.8" r="0.9" fill="#FFFFFF" />
        <circle cx="71.2" cy="38.8" r="0.9" fill="#FFFFFF" />

        {/* Nose */}
        <path d="M 60 38 L 59 47 L 62 48" fill="none" stroke="#C47E53" strokeWidth="1.6" strokeLinecap="round" />

        {/* Friendly Smile */}
        <path d="M 53 55 Q 60 61 67 55" fill="none" stroke="#9A502C" strokeWidth="2" strokeLinecap="round" />

        {/* ── INHERITED BROWN HAIR (Stylized medium length brown hair) ── */}
        <path
          d="M 38 33 C 38 12, 82 12, 82 33 C 82 36, 76 23, 60 23 C 44 23, 38 36, 38 33 Z"
          fill="url(#child2BrownHair)"
        />
        {/* Soft Brown hair waves */}
        <path d="M 42 24 Q 48 16 54 22" fill="none" stroke="url(#child2BrownHair)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 66 22 Q 72 16 78 24" fill="none" stroke="url(#child2BrownHair)" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

// Aliases for backwards compatibility
export const ParentCharacter = PersonCharacter;
export const StudentCharacter = Child1Character;
export const EmployeeCharacter = Child2Character;
