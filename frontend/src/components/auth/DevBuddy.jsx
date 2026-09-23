import React, { useRef, useEffect, useState, useMemo } from 'react';

/**
 * DevBuddy - 3D Stylized Developer Boy Character
 *
 * Front-facing 3D Pixar/Disney-styled young developer:
 * - Heather-gray hoodie with hood UP framing the head
 * - Voluminous swept chestnut-brown hair spilling from under the hood
 * - Large expressive warm brown eyes (tracking cursor & natural blinking)
 * - Sweet confident smirk with rosy blush cheeks and cute button nose
 * - White crew-neck undershirt, central zipper, and hanging drawstrings with metal aglets
 * - Front kangaroo pouch pocket with hands tucked inside during idle
 * - Medium-wash denim blue jeans with rolled-up beige cuffs
 * - Clean crisp white sneakers with white laces
 *
 * Fully reactive SVG character with 0 external dependencies.
 */
export default function DevBuddy({ mood = 'idle', isPasswordVisible = false }) {
  const characterRef = useRef(null);
  const rafRef = useRef(null);

  // Normalized cursor coordinate [-1, 1] relative to character center
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Natural idle blink state
  const [isBlinking, setIsBlinking] = useState(false);

  // ── Automatic Idle Blinking (every 4-6s for ~120ms) ──
  useEffect(() => {
    if (mood !== 'idle') {
      setIsBlinking(false);
      return;
    }

    let blinkTimeout;
    let nextBlinkTimeout;

    const scheduleBlink = () => {
      const delay = 3800 + Math.random() * 2200;
      nextBlinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        blinkTimeout = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 120);
      }, delay);
    };

    scheduleBlink();

    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(nextBlinkTimeout);
    };
  }, [mood]);

  // ── Throttled Cursor Tracking ──
  useEffect(() => {
    if (
      mood === 'peek' ||
      mood === 'thinking' ||
      mood === 'success' ||
      mood === 'fail' ||
      mood === 'missing_input'
    ) {
      setCursorPos({ x: 0, y: 0 });
      return;
    }

    const handlePointerMove = (e) => {
      if (!characterRef.current) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = characterRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.22; // eye level on character

        const rawDx = (e.clientX - centerX) / (window.innerWidth * 0.35);
        const rawDy = (e.clientY - centerY) / (window.innerHeight * 0.35);

        const clampedX = Math.max(-1, Math.min(1, rawDx));
        const clampedY = Math.max(-1, Math.min(1, rawDy));

        setCursorPos({ x: clampedX, y: clampedY });
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mood]);

  // ── Head & Pupil Transforms ──
  const { headTransform, pupilOffset, bodyBounceClass, headShakeClass } = useMemo(() => {
    let head = { x: 0, y: 0, rotate: 0 };
    let pupil = { x: 0, y: 0 };
    let bounce = '';
    let shake = '';

    switch (mood) {
      case 'success':
        head = { x: 0, y: -6, rotate: 0 };
        pupil = { x: 0, y: -1.5 };
        bounce = 'animate-devBounce';
        break;

      case 'fail':
        head = { x: 0, y: 5, rotate: 0 };
        pupil = { x: 0, y: 3.5 };
        shake = 'animate-headShake';
        break;

      case 'thinking':
        head = { x: 3, y: -3, rotate: 3.5 };
        pupil = { x: 3.2, y: -3.5 };
        break;

      case 'missing_input':
        head = { x: 2, y: -2, rotate: -3.0 };
        pupil = { x: 3.0, y: 0.5 };
        break;

      case 'peek':
        head = { x: 0, y: 4, rotate: 0.5 };
        pupil = { x: 0, y: 0 };
        break;

      case 'idle':
      default:
        head = {
          x: cursorPos.x * 4.5,
          y: cursorPos.y * 3.0,
          rotate: cursorPos.x * 2.2,
        };
        pupil = {
          x: cursorPos.x * 3.8,
          y: cursorPos.y * 3.0,
        };
        break;
    }

    return {
      headTransform: `translate(${head.x}px, ${head.y}px) rotate(${head.rotate}deg)`,
      pupilOffset: { x: pupil.x, y: pupil.y },
      bodyBounceClass: bounce,
      headShakeClass: shake,
    };
  }, [mood, cursorPos]);

  // ── Eyebrow Shapes Per Emotion ──
  const { leftBrowPath, rightBrowPath } = useMemo(() => {
    switch (mood) {
      case 'success':
        // High joyful arched brows
        return {
          leftBrowPath: 'M 152 114 Q 166 104 180 115',
          rightBrowPath: 'M 200 115 Q 214 104 228 114',
        };
      case 'fail':
        // Inner ends lifted high into troubled slant
        return {
          leftBrowPath: 'M 153 124 Q 166 119 180 113',
          rightBrowPath: 'M 200 113 Q 214 119 227 124',
        };
      case 'thinking':
        // One brow raised in contemplation
        return {
          leftBrowPath: 'M 152 110 Q 166 102 180 113',
          rightBrowPath: 'M 200 120 Q 214 118 228 117',
        };
      case 'missing_input':
        // Both brows raised quizzically
        return {
          leftBrowPath: 'M 153 111 Q 166 103 180 112',
          rightBrowPath: 'M 200 112 Q 214 103 227 111',
        };
      case 'peek':
        // Neutral slightly lowered brows
        return {
          leftBrowPath: 'M 153 118 Q 166 113 180 118',
          rightBrowPath: 'M 200 118 Q 214 113 227 118',
        };
      case 'idle':
      default:
        // Confident, charming relaxed curve
        return {
          leftBrowPath: 'M 153 117 Q 166 111 180 117',
          rightBrowPath: 'M 200 117 Q 214 111 227 117',
        };
    }
  }, [mood]);

  // ── Mouth Shape Per Emotion ──
  const mouthElement = useMemo(() => {
    switch (mood) {
      case 'success':
        // Wide joyful open grin with teeth and pink tongue
        return (
          <g className="transition-all duration-200">
            <path d="M 177 167 Q 190 186 203 167 Z" fill="#882C39" />
            <path d="M 180 168 Q 190 174 200 168 Z" fill="#FFFFFF" />
            <path d="M 183 179 Q 190 175 197 179 Q 190 184 183 179 Z" fill="#FF8BA0" />
          </g>
        );

      case 'fail':
        // Downturned pouting frown
        return (
          <path
            d="M 181 176 Q 190 168 199 176"
            stroke="#9C4449"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-200"
          />
        );

      case 'thinking':
        // Pensive straight mouth
        return (
          <path
            d="M 183 171 L 197 171"
            stroke="#9C4449"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-200"
          />
        );

      case 'missing_input':
        // Cute small "o" or flat query
        return (
          <path
            d="M 184 172 L 196 172"
            stroke="#9C4449"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-200"
          />
        );

      case 'peek':
        // Small bashful smile
        return (
          <path
            d="M 183 170 Q 190 174 197 170"
            stroke="#9C4449"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-200"
          />
        );

      case 'idle':
      default:
        // Sweet, confident boyish smirk (turned up on viewer's right with cute dimple)
        return (
          <g className="transition-all duration-200">
            <path
              d="M 180 168 Q 189 174 200 168"
              stroke="#9C4449"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Subtle dimple crease on the right cheek */}
            <path
              d="M 200 166 Q 202 168 201 171"
              stroke="#D28D77"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
    }
  }, [mood]);

  return (
    <div
      ref={characterRef}
      className={`relative w-full aspect-[380/680] select-none flex items-center justify-center filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)] ${bodyBounceClass}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 380 680"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ── Soft Lighting & Glow Filters ── */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* ── Skin Gradients: Warm Pixar Peach ── */}
          <linearGradient id="boySkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2EB" />
            <stop offset="55%" stopColor="#FAD8C7" />
            <stop offset="100%" stopColor="#E9B9A2" />
          </linearGradient>

          <radialGradient id="boyCheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8DA1" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#FFA4B5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFA4B5" stopOpacity="0" />
          </radialGradient>

          {/* ── Hair Gradients: Rich Swept Chestnut Brown ── */}
          <linearGradient id="hairBaseGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#7E4C29" />
            <stop offset="45%" stopColor="#573117" />
            <stop offset="85%" stopColor="#381D0B" />
            <stop offset="100%" stopColor="#251105" />
          </linearGradient>

          <linearGradient id="hairHighlightGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#A86E45" />
            <stop offset="50%" stopColor="#87532F" />
            <stop offset="100%" stopColor="#553017" />
          </linearGradient>

          {/* ── Hoodie Gradients: Light Heather Gray ── */}
          <linearGradient id="hoodieOuterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBCBD4" />
            <stop offset="25%" stopColor="#E5E5EB" />
            <stop offset="70%" stopColor="#D2D2DC" />
            <stop offset="100%" stopColor="#B3B3BF" />
          </linearGradient>

          <linearGradient id="hoodieBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E3E3E9" />
            <stop offset="40%" stopColor="#D5D5DE" />
            <stop offset="85%" stopColor="#C4C4CF" />
            <stop offset="100%" stopColor="#AFAFB9" />
          </linearGradient>

          <linearGradient id="hoodInnerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5E5C66" />
            <stop offset="50%" stopColor="#797782" />
            <stop offset="100%" stopColor="#92909C" />
          </linearGradient>

          <linearGradient id="hoodPaddedRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BABAC5" />
            <stop offset="50%" stopColor="#EEEEF3" />
            <stop offset="100%" stopColor="#B5B5C0" />
          </linearGradient>

          {/* ── Jeans: Medium-Wash Denim Blue ── */}
          <linearGradient id="denimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A6E94" />
            <stop offset="45%" stopColor="#375577" />
            <stop offset="90%" stopColor="#2A4360" />
            <stop offset="100%" stopColor="#1E3147" />
          </linearGradient>

          <linearGradient id="denimThighHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6C8FB5" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#5479A1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#375577" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="cuffBeigeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5D9C4" />
            <stop offset="50%" stopColor="#D4C5A8" />
            <stop offset="100%" stopColor="#B8A88B" />
          </linearGradient>

          {/* ── Sneakers: Crisp Clean White ── */}
          <linearGradient id="sneakerUpperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F5F5F7" />
            <stop offset="100%" stopColor="#E2E2E6" />
          </linearGradient>

          <linearGradient id="sneakerSoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#E8E8EC" />
            <stop offset="100%" stopColor="#CFD0D6" />
          </linearGradient>

          {/* ── Eye Clips (clamping pupils strictly inside eye sockets) ── */}
          <clipPath id="leftEyeClip">
            <ellipse cx="166" cy="140" rx="14" ry="15" />
          </clipPath>
          <clipPath id="rightEyeClip">
            <ellipse cx="214" cy="140" rx="14" ry="15" />
          </clipPath>

          {/* ── 3D Iris Gradient (warm hazel-chocolate) ── */}
          <radialGradient id="irisGrad" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#8A4A22" />
            <stop offset="50%" stopColor="#5E2F13" />
            <stop offset="85%" stopColor="#3A1A08" />
            <stop offset="100%" stopColor="#1E0A02" />
          </radialGradient>
        </defs>

        {/* ── 1. GROUND CONTACT SHADOW ── */}
        <ellipse cx="190" cy="640" rx="98" ry="11" fill="#000000" opacity="0.42" />

        {/* ── 2. LEGS & ROLLED-CUFF DENIM JEANS ── */}
        <g id="jeans-group">
          {/* Left Leg (Ground Stance) */}
          <path
            d="M 148 375 L 140 480 L 138 565 L 170 565 L 174 480 L 186 375 Z"
            fill="url(#denimGrad)"
            stroke="#1B2B3E"
            strokeWidth="1.6"
          />
          {/* Left thigh wash highlight */}
          <path
            d="M 147 395 C 144 440 144 475 146 510 C 158 512 166 512 168 510 C 170 475 170 440 167 395 Z"
            fill="url(#denimThighHighlight)"
          />
          {/* Left Knee Wrinkles */}
          <path d="M 143 478 Q 155 483 169 479" stroke="#5E83AA" strokeWidth="1.5" fill="none" opacity="0.75" />
          <path d="M 144 483 Q 155 487 167 484" stroke="#162332" strokeWidth="1.5" fill="none" opacity="0.8" />
          {/* Golden Outer & Inseam Topstitching */}
          <path d="M 141 380 L 139 565" stroke="#C89748" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity="0.8" />

          {/* Right Leg (Relaxed Stance) */}
          <path
            d="M 194 375 L 206 480 L 210 565 L 242 565 L 240 480 L 232 375 Z"
            fill="url(#denimGrad)"
            stroke="#1B2B3E"
            strokeWidth="1.6"
          />
          {/* Right thigh wash highlight */}
          <path
            d="M 213 395 C 210 440 210 475 212 510 C 224 512 232 512 234 510 C 236 475 236 440 233 395 Z"
            fill="url(#denimThighHighlight)"
          />
          {/* Right Knee Wrinkles */}
          <path d="M 211 475 Q 223 480 237 476" stroke="#5E83AA" strokeWidth="1.5" fill="none" opacity="0.75" />
          <path d="M 212 480 Q 222 484 235 481" stroke="#162332" strokeWidth="1.5" fill="none" opacity="0.8" />
          {/* Golden Outer & Inseam Topstitching */}
          <path d="M 241 380 L 241 565" stroke="#C89748" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity="0.8" />

          {/* Crotch & Pocket Arc Details */}
          <path d="M 186 375 Q 190 405 194 375" stroke="#162332" strokeWidth="2" fill="none" />
          <path d="M 152 382 Q 165 390 178 382" stroke="#C89748" strokeWidth="1.2" fill="none" opacity="0.7" />
          <path d="M 202 382 Q 215 390 228 382" stroke="#C89748" strokeWidth="1.2" fill="none" opacity="0.7" />

          {/* ── Rolled-Up Cuffs (Showing beige underside of denim) ── */}
          {/* Left Rolled Cuff */}
          <g transform="translate(136, 563)">
            <rect x="0" y="0" width="36" height="15" rx="3" fill="url(#cuffBeigeGrad)" stroke="#8F7E64" strokeWidth="1.2" />
            <line x1="2" y1="13" x2="34" y2="13" stroke="#A8967A" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="2" y1="2" x2="34" y2="2" stroke="#FAF2E3" strokeWidth="1" opacity="0.7" />
          </g>

          {/* Right Rolled Cuff */}
          <g transform="translate(208, 563)">
            <rect x="0" y="0" width="36" height="15" rx="3" fill="url(#cuffBeigeGrad)" stroke="#8F7E64" strokeWidth="1.2" />
            <line x1="2" y1="13" x2="34" y2="13" stroke="#A8967A" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="2" y1="2" x2="34" y2="2" stroke="#FAF2E3" strokeWidth="1" opacity="0.7" />
          </g>
        </g>

        {/* ── 3. CLEAN WHITE SNEAKERS ── */}
        <g id="sneakers-group">
          {/* Left Sneaker */}
          <g transform="translate(132, 580)">
            {/* Sneaker Upper */}
            <path
              d="M 5 28 C 4 15 12 5 26 5 C 34 5 38 12 39 28 Z"
              fill="url(#sneakerUpperGrad)"
              stroke="#B3B4BC"
              strokeWidth="1.2"
            />
            {/* White Rubber Toe Bumper */}
            <path d="M 4 28 C 4 19 10 16 16 16 L 16 28 Z" fill="#FFFFFF" stroke="#D3D4DC" strokeWidth="1" />
            {/* White Laces */}
            <line x1="20" y1="10" x2="28" y2="10" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="21" y1="15" x2="29" y2="15" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="22" y1="20" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            {/* Shoe Tongue & Collar */}
            <path d="M 25 5 L 34 8" stroke="#DCDCE2" strokeWidth="1.5" />
            {/* Rubber Sole */}
            <rect x="1" y="27" width="41" height="8.5" rx="4" fill="url(#sneakerSoleGrad)" stroke="#A9ABB5" strokeWidth="1.2" />
            <line x1="2" y1="32" x2="40" y2="32" stroke="#B8BAC4" strokeWidth="1" />
          </g>

          {/* Right Sneaker */}
          <g transform="translate(206, 580)">
            {/* Sneaker Upper */}
            <path
              d="M 4 28 C 4 15 12 5 26 5 C 34 5 38 12 39 28 Z"
              fill="url(#sneakerUpperGrad)"
              stroke="#B3B4BC"
              strokeWidth="1.2"
            />
            {/* White Rubber Toe Bumper */}
            <path d="M 4 28 C 4 19 10 16 16 16 L 16 28 Z" fill="#FFFFFF" stroke="#D3D4DC" strokeWidth="1" />
            {/* White Laces */}
            <line x1="20" y1="10" x2="28" y2="10" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="21" y1="15" x2="29" y2="15" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="22" y1="20" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            {/* Shoe Tongue & Collar */}
            <path d="M 25 5 L 34 8" stroke="#DCDCE2" strokeWidth="1.5" />
            {/* Rubber Sole */}
            <rect x="1" y="27" width="41" height="8.5" rx="4" fill="url(#sneakerSoleGrad)" stroke="#A9ABB5" strokeWidth="1.2" />
            <line x1="2" y1="32" x2="40" y2="32" stroke="#B8BAC4" strokeWidth="1" />
          </g>
        </g>

        {/* ── 4. HOODIE BACK/INNER SHADOW (Curving behind head) ── */}
        <g id="hood-back">
          {/* Deep dark cavity behind head and hair */}
          <path
            d="M 124 165 C 114 95 142 55 190 55 C 238 55 266 95 256 165 C 254 200 240 230 190 235 C 140 230 126 200 124 165 Z"
            fill="url(#hoodInnerShadow)"
          />
        </g>

        {/* ── 5. HOODIE TORSO, POUCH & KANGAROO POCKET ── */}
        <g id="hoodie-torso" className="animate-subtleBreathing">
          {/* Main Heather Gray Torso Body */}
          <path
            d="M 130 230 C 126 270 128 335 132 376 C 160 382 220 382 248 376 C 252 335 254 270 250 230 C 232 220 215 216 190 216 C 165 216 148 220 130 230 Z"
            fill="url(#hoodieBodyGrad)"
            stroke="#9E9EAA"
            strokeWidth="1.8"
          />

          {/* Ribbed Waistband Hem at Bottom of Hoodie */}
          <path
            d="M 131 372 C 160 380 220 380 249 372 L 248 388 C 220 395 160 395 132 388 Z"
            fill="#B9B9C5"
            stroke="#9292A0"
            strokeWidth="1.2"
          />
          {/* Subtle vertical ribbing stitches on waistband */}
          <line x1="160" y1="375" x2="160" y2="391" stroke="#9E9EA8" strokeWidth="1" opacity="0.6" />
          <line x1="190" y1="377" x2="190" y2="393" stroke="#9E9EA8" strokeWidth="1" opacity="0.6" />
          <line x1="220" y1="375" x2="220" y2="391" stroke="#9E9EA8" strokeWidth="1" opacity="0.6" />

          {/* White Undershirt Crew-Neck T-Shirt Collar */}
          <path
            d="M 175 220 C 182 232 198 232 205 220 Z"
            fill="#FFFFFF"
            stroke="#DCDCE2"
            strokeWidth="1.5"
          />

          {/* Central Metal Zipper */}
          <line x1="190" y1="230" x2="190" y2="305" stroke="#7A7A88" strokeWidth="3" strokeLinecap="round" />
          <line x1="190" y1="230" x2="190" y2="305" stroke="#D2D2DC" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Zipper Pull Tab */}
          <rect x="188.5" y="252" width="3" height="6.5" rx="1" fill="#E8E8EE" stroke="#686875" strokeWidth="0.8" />

          {/* Hanging Hoodie Drawstrings with Metal Aglets */}
          {/* Left Drawstring */}
          <path d="M 174 230 C 171 260 173 290 171 324" stroke="#D8D8E0" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <rect x="169.5" y="322" width="3" height="7.5" rx="1" fill="#FFFFFF" stroke="#787886" strokeWidth="0.8" />
          {/* Right Drawstring */}
          <path d="M 206 230 C 209 260 207 290 209 324" stroke="#D8D8E0" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <rect x="207.5" y="322" width="3" height="7.5" rx="1" fill="#FFFFFF" stroke="#787886" strokeWidth="0.8" />

          {/* ── KANGAROO POCKET (Centered on lower abdomen) ── */}
          <g id="kangaroo-pocket">
            {/* Pocket Body */}
            <path
              d="M 144 315 L 140 370 C 165 376 215 376 240 370 L 236 315 L 218 315 C 200 322 180 322 162 315 Z"
              fill="url(#hoodieOuterGrad)"
              stroke="#9595A2"
              strokeWidth="1.6"
            />
            {/* Top seam highlight */}
            <path
              d="M 162 315 C 180 322 200 322 218 315"
              stroke="#F5F5FA"
              strokeWidth="1.2"
              fill="none"
              opacity="0.8"
            />
            {/* Diagonal Side Pocket Slits where hands insert */}
            <path d="M 144 315 L 140 370" stroke="#71717E" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 236 315 L 240 370" stroke="#71717E" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </g>

        {/* ── 6. HEAD GROUP (Hood Outer, Face, Hair, Eyes, Expressions) ── */}
        <g
          id="head-group"
          className={headShakeClass}
          style={{
            transform: headTransform,
            transformOrigin: '190px 145px',
            transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Neck with soft chin cast shadow */}
          <path d="M 177 185 L 175 224 L 205 224 L 203 185 Z" fill="url(#boySkinGrad)" />
          <path d="M 177 185 C 184 195 196 195 203 185 Z" fill="#D49983" opacity="0.6" />

          {/* ── HOOD OUTER DOME (Worn UP on the head!) ── */}
          <path
            d="M 116 230 C 104 140 126 65 190 65 C 254 65 276 140 264 230 C 252 200 242 180 236 160 C 234 100 216 80 190 80 C 164 80 146 100 144 160 C 138 180 128 200 116 230 Z"
            fill="url(#hoodieOuterGrad)"
            stroke="#9696A4"
            strokeWidth="2"
          />

          {/* Hood Padded Edge Trim around the Face */}
          <path
            d="M 134 200 C 130 115 150 82 190 82 C 230 82 250 115 246 200 C 240 160 228 92 190 92 C 152 92 140 160 134 200 Z"
            fill="url(#hoodPaddedRim)"
            stroke="#B0B0BD"
            strokeWidth="1.2"
          />

          {/* ── FACE & JAWLINE (Pixar 3D Smooth Peach Contours) ── */}
          <path
            d="M 142 140 C 140 98 240 98 238 140 C 238 168 218 190 190 190 C 162 190 142 168 142 140 Z"
            fill="url(#boySkinGrad)"
            stroke="#D8A087"
            strokeWidth="1.6"
          />

          {/* Soft Ears peeking at sides */}
          <ellipse cx="140" cy="144" rx="6" ry="8.5" fill="#F8D3C0" stroke="#D8A087" strokeWidth="1.2" />
          <ellipse cx="240" cy="144" rx="6" ry="8.5" fill="#F8D3C0" stroke="#D8A087" strokeWidth="1.2" />

          {/* Rosy Cheek Blush Ovals */}
          <ellipse
            cx="153"
            cy="155"
            rx="11"
            ry="6.5"
            fill="url(#boyCheekBlush)"
            className="transition-opacity duration-300"
            opacity={mood === 'success' ? 0.95 : 0.65}
          />
          <ellipse
            cx="227"
            cy="155"
            rx="11"
            ry="6.5"
            fill="url(#boyCheekBlush)"
            className="transition-opacity duration-300"
            opacity={mood === 'success' ? 0.95 : 0.65}
          />

          {/* ── SWEPT CHESTNUT-BROWN HAIR (Voluminous stylized locks under hood) ── */}
          <g id="boy-hair-group">
            {/* Hair base shape */}
            <path
              d="M 142 128 C 140 85 240 85 238 128 C 230 102 215 92 190 92 C 165 92 150 102 142 128 Z"
              fill="url(#hairBaseGrad)"
            />
            {/* Swept hair volume flowing forward and across to the left */}
            <path
              d="M 146 122 C 158 92 188 88 234 104 C 216 96 195 94 175 108 C 162 118 152 124 146 122 Z"
              fill="url(#hairHighlightGrad)"
            />
            {/* Individual stylized 3D hair tufts/locks */}
            <path
              d="M 172 94 C 188 108 216 110 230 102 C 218 95 198 90 172 94 Z"
              fill="#8B5532"
            />
            <path
              d="M 152 116 C 164 102 184 102 204 108 C 185 106 170 110 152 116 Z"
              fill="#522F17"
            />
            <path
              d="M 188 92 C 205 102 225 104 235 98 C 220 92 205 90 188 92 Z"
              fill="#A26A42"
            />
          </g>

          {/* ── EYEBROWS (Morph per emotion) ── */}
          <g id="eyebrows">
            <path
              d={leftBrowPath}
              stroke="#3F200E"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              style={{ transition: 'd 180ms ease-out' }}
            />
            <path
              d={rightBrowPath}
              stroke="#3F200E"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              style={{ transition: 'd 180ms ease-out' }}
            />
          </g>

          {/* ── EYES & TRACKING PUPILS (Pixar Expressive 3D Eyes) ── */}
          <g id="eyes-group">
            {mood === 'success' ? (
              /* Joyful closed smiling eye arcs (^ ^) */
              <g className="transition-all duration-200">
                <path
                  d="M 154 142 Q 166 126 178 142"
                  stroke="#381D0B"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 202 142 Q 214 126 226 142"
                  stroke="#381D0B"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : (
              /* Open 3D eyes with cursor tracking & blinking */
              <g
                style={{
                  transform: isBlinking ? 'scaleY(0.08)' : 'scaleY(1)',
                  transformOrigin: '190px 140px',
                  transition: 'transform 75ms ease-in-out',
                }}
              >
                {/* ── Left Eye ── */}
                {/* White Sclera */}
                <ellipse cx="166" cy="140" rx="14" ry="15" fill="#FFFFFF" stroke="#E2DCD8" strokeWidth="0.8" />
                {/* Upper eyelid soft shadow */}
                <path d="M 152 135 Q 166 142 180 135" stroke="#D1C3BC" strokeWidth="2" fill="none" opacity="0.6" />

                {/* Left Pupil & Iris (clipped to eye bounds) */}
                <g clipPath="url(#leftEyeClip)">
                  <g
                    style={{
                      transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                      transition: 'transform 90ms linear',
                    }}
                  >
                    {/* Warm 3D Iris */}
                    <circle cx="166" cy="140" r="10" fill="url(#irisGrad)" />
                    {/* Iris radial texture / glow rim */}
                    <circle cx="166" cy="140" r="8.2" stroke="#A86235" strokeWidth="1.2" fill="none" opacity="0.4" />
                    {/* Deep black pupil */}
                    <circle cx="166" cy="140" r="5.2" fill="#120803" />

                    {/* Dual Specular Gloss Highlights */}
                    {/* Primary top-left glossy reflection */}
                    <circle cx="163" cy="136" r="2.8" fill="#FFFFFF" opacity="0.95" />
                    {/* Secondary bottom-right reflection */}
                    <circle cx="169" cy="143" r="1.4" fill="#FFFFFF" opacity="0.75" />
                    {/* Soft liquid crescent along lower iris */}
                    <path d="M 160 144 Q 166 148 172 144" stroke="#D18758" strokeWidth="1.2" fill="none" opacity="0.55" />
                  </g>
                </g>
                {/* Upper lash contour */}
                <path d="M 152 133 Q 166 124 180 133" stroke="#2F1709" strokeWidth="2.8" strokeLinecap="round" fill="none" />

                {/* ── Right Eye ── */}
                {/* White Sclera */}
                <ellipse cx="214" cy="140" rx="14" ry="15" fill="#FFFFFF" stroke="#E2DCD8" strokeWidth="0.8" />
                {/* Upper eyelid soft shadow */}
                <path d="M 200 135 Q 214 142 228 135" stroke="#D1C3BC" strokeWidth="2" fill="none" opacity="0.6" />

                {/* Right Pupil & Iris (clipped to eye bounds) */}
                <g clipPath="url(#rightEyeClip)">
                  <g
                    style={{
                      transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                      transition: 'transform 90ms linear',
                    }}
                  >
                    {/* Warm 3D Iris */}
                    <circle cx="214" cy="140" r="10" fill="url(#irisGrad)" />
                    {/* Iris radial texture / glow rim */}
                    <circle cx="214" cy="140" r="8.2" stroke="#A86235" strokeWidth="1.2" fill="none" opacity="0.4" />
                    {/* Deep black pupil */}
                    <circle cx="214" cy="140" r="5.2" fill="#120803" />

                    {/* Dual Specular Gloss Highlights */}
                    {/* Primary top-left glossy reflection */}
                    <circle cx="211" cy="136" r="2.8" fill="#FFFFFF" opacity="0.95" />
                    {/* Secondary bottom-right reflection */}
                    <circle cx="217" cy="143" r="1.4" fill="#FFFFFF" opacity="0.75" />
                    {/* Soft liquid crescent along lower iris */}
                    <path d="M 208 144 Q 214 148 220 144" stroke="#D18758" strokeWidth="1.2" fill="none" opacity="0.55" />
                  </g>
                </g>
                {/* Upper lash contour */}
                <path d="M 200 133 Q 214 124 228 133" stroke="#2F1709" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              </g>
            )}
          </g>

          {/* ── CUTE 3D BUTTON NOSE ── */}
          <g id="button-nose">
            {/* Soft rounded nose tip highlight */}
            <ellipse cx="190" cy="155" rx="3.5" ry="2.2" fill="#FFEFE7" opacity="0.8" />
            {/* Soft peach curve under nose */}
            <path
              d="M 186 157 Q 190 161 194 157"
              stroke="#D3927C"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* ── MOUTH (Boyish Smirk / Morphing per emotion) ── */}
          <g id="mouth-group">
            {mouthElement}
          </g>
        </g>

        {/* ── 7. ARMS & HANDS (Interactive layer) ── */}
        {/*
          Idle: Both hands casually tucked in kangaroo pocket (matching reference image!).
          Peek: Hands lift up to cover eyes with spring easing.
          Thinking: Right hand touches chin.
          Success: Right hand gives thumbs up.
          Missing input: Hand gestures towards the form.
        */}
        {mood === 'peek' ? (
          /* Peek Mode: Hands slide up out of pockets and cover the eyes */
          <g
            id="peek-arms"
            className="transition-transform duration-350 ease-out"
            style={{
              transform: isPasswordVisible
                ? 'translate(-12px, -12px)' // Peeking slightly through fingers
                : 'translate(0px, 0px)',
            }}
          >
            {/* Left Arm Lifting */}
            <path
              d="M 126 230 C 108 265 118 190 160 142"
              stroke="#CBCBD4"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 126 230 C 108 265 118 190 160 142"
              stroke="#E5E5EB"
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Hand covering left eye */}
            <g transform="translate(166, 140)">
              <ellipse cx="0" cy="0" rx="16" ry="11" fill="#FAD8C7" stroke="#D8A087" strokeWidth="1.2" />
              <rect x="-14" y="-12" width="6" height="12" rx="3" fill="#FFF2EB" stroke="#D8A087" strokeWidth="0.8" />
              <rect x="-6" y="-14" width="6" height="14" rx="3" fill="#FFF2EB" stroke="#D8A087" strokeWidth="0.8" />
              <rect x="2" y="-13" width="6" height="13" rx="3" fill="#FFF2EB" stroke="#D8A087" strokeWidth="0.8" />
              <rect x="10" y="-11" width="6" height="11" rx="3" fill="#FFF2EB" stroke="#D8A087" strokeWidth="0.8" />
            </g>

            {/* Right Arm Lifting */}
            <path
              d="M 254 230 C 272 265 262 190 220 142"
              stroke="#CBCBD4"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 254 230 C 272 265 262 190 220 142"
              stroke="#E5E5EB"
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Hand covering right eye */}
            <g transform="translate(214, 140)">
              <ellipse cx="0" cy="0" rx="16" ry="11" fill="#FAD8C7" stroke="#D8A087" strokeWidth="1.2" />
              <rect x="-14" y="-11" width="6" height="11" rx="3" fill="#FFF2EB" stroke="#D8A087" strokeWidth="0.8" />
              <rect x="-6" y="-13" width="6" height="13" rx="3" fill="#FFF2EB" stroke="#D8A087" strokeWidth="0.8" />
              <rect x="2" y="-14" width="6" height="14" rx="3" fill="#FFF2EB" stroke="#D8A087" strokeWidth="0.8" />
              <rect x="10" y="-12" width="6" height="12" rx="3" fill="#FFF2EB" stroke="#D8A087" strokeWidth="0.8" />
            </g>
          </g>
        ) : mood === 'thinking' ? (
          /* Thinking Mode: Hand on chin, left arm resting */
          <g id="thinking-arms">
            {/* Left Arm resting naturally towards pocket */}
            <path
              d="M 126 230 C 112 270 114 320 145 348"
              stroke="#CBCBD4"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 126 230 C 112 270 114 320 145 348"
              stroke="#E5E5EB"
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Arm up to chin */}
            <path
              d="M 254 230 C 270 270 255 240 212 188"
              stroke="#CBCBD4"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 254 230 C 270 270 255 240 212 188"
              stroke="#E5E5EB"
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hand under chin */}
            <ellipse cx="206" cy="182" rx="8" ry="7" fill="#FAD8C7" stroke="#D8A087" strokeWidth="1.2" />
            <circle cx="202" cy="178" r="3.2" fill="#FFF2EB" />
          </g>
        ) : mood === 'success' ? (
          /* Success Mode: Cheerful thumbs-up gesture */
          <g id="success-arms">
            {/* Left Arm slightly swung out in joy */}
            <path
              d="M 126 230 C 105 270 110 320 138 346"
              stroke="#CBCBD4"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 126 230 C 105 270 110 320 138 346"
              stroke="#E5E5EB"
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Arm with thumbs up */}
            <path
              d="M 254 230 C 272 260 275 250 260 240"
              stroke="#CBCBD4"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 254 230 C 272 260 275 250 260 240"
              stroke="#E5E5EB"
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="260" cy="236" rx="9" ry="8" fill="#FAD8C7" stroke="#D8A087" strokeWidth="1.2" />
            <rect x="256" y="220" width="5.5" height="11" rx="2.5" fill="#FFF2EB" stroke="#D8A087" strokeWidth="1" />
          </g>
        ) : mood === 'missing_input' ? (
          /* Missing Input: Hand gesturing towards the form */
          <g id="prompt-arms">
            {/* Left Arm tucked */}
            <path
              d="M 126 230 C 114 270 118 320 145 348"
              stroke="#CBCBD4"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 126 230 C 114 270 118 320 145 348"
              stroke="#E5E5EB"
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Arm gesturing right */}
            <path
              d="M 254 230 C 272 260 285 265 300 255"
              stroke="#CBCBD4"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 254 230 C 272 260 285 265 300 255"
              stroke="#E5E5EB"
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="304" cy="252" rx="10" ry="7.5" fill="#FAD8C7" stroke="#D8A087" strokeWidth="1.2" transform="rotate(-15 304 252)" />
            <rect x="309" y="248" width="8" height="4" rx="2" fill="#FFF2EB" transform="rotate(-10 309 248)" />
            <rect x="310" y="254" width="7" height="3.5" rx="1.5" fill="#FFF2EB" transform="rotate(-5 310 254)" />
          </g>
        ) : (
          /* Default Idle: BOTH hands tucked into kangaroo pouch (exact reference match!) */
          <g id="idle-tucked-arms">
            {/* Left Arm curving down into left pocket opening */}
            <path
              d="M 126 230 C 112 268 112 312 144 346"
              stroke="#CBCBD4"
              strokeWidth="21"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 126 230 C 112 268 112 312 144 346"
              stroke="#E5E5EB"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* Sleeve wrinkle folds at elbow */}
            <path d="M 112 290 Q 118 296 126 292" stroke="#A9A9B6" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 114 298 Q 120 304 128 300" stroke="#A9A9B6" strokeWidth="1.5" fill="none" opacity="0.7" />
            {/* Left Sleeve ribbed cuff entering pocket */}
            <ellipse cx="143" cy="346" rx="7.5" ry="9" fill="#B3B3BF" />
            {/* Hand tucked into pocket with thumb knuckle subtly showing at opening */}
            <ellipse cx="147" cy="346" rx="4.5" ry="5.5" fill="#FAD8C7" stroke="#D8A087" strokeWidth="1" />

            {/* Right Arm curving down into right pocket opening */}
            <path
              d="M 254 230 C 268 268 268 312 236 346"
              stroke="#CBCBD4"
              strokeWidth="21"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 254 230 C 268 268 268 312 236 346"
              stroke="#E5E5EB"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* Sleeve wrinkle folds at elbow */}
            <path d="M 268 290 Q 262 296 254 292" stroke="#A9A9B6" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 266 298 Q 260 304 252 300" stroke="#A9A9B6" strokeWidth="1.5" fill="none" opacity="0.7" />
            {/* Right Sleeve ribbed cuff entering pocket */}
            <ellipse cx="237" cy="346" rx="7.5" ry="9" fill="#B3B3BF" />
            {/* Hand tucked into pocket with thumb knuckle subtly showing at opening */}
            <ellipse cx="233" cy="346" rx="4.5" ry="5.5" fill="#FAD8C7" stroke="#D8A087" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
}
