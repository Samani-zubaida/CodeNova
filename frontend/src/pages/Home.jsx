import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   PALETTE
   ───────────────────────────────────────────────────────────── */
const P = {
  red:   '#AB526B',
  brown: '#BCA297',
  sage:  '#C5CEAE',
  wheat: '#F0E2A4',
  bisq:  '#F4EBC3',
  dark1: '#2D1F23',  // deepest dark
  dark2: '#331921',  // Indian Red dark
  dark3: '#2A2E25',  // sage dark
  dark4: '#2A211C',  // brown dark
  dark5: '#2A2615',  // wheat dark
};

/* ─────────────────────────────────────────────────────────────
   CARDS — each represents a major section of the app
   ───────────────────────────────────────────────────────────── */
const CARDS = [
  {
    id: 'visualizer',
    title: 'Visualizer',
    sub: 'Algorithms & Data Structures',
    route: '/visualizer',
    bg: P.red,
    darkBg: P.dark2,
    text: P.bisq,
    Thumb: VisualizerThumb,
  },
  {
    id: 'oop',
    title: 'OOP Studio',
    sub: 'Encapsulation · Inheritance · Polymorphism',
    route: '/visualizer/oop',
    bg: P.sage,
    darkBg: P.dark3,
    text: P.dark1,
    Thumb: OopThumb,
  },
  {
    id: 'crypto',
    title: 'Cryptography',
    sub: 'Ciphers · Protocols · Encryption',
    route: '/visualizer/crypto',
    bg: P.brown,
    darkBg: P.dark4,
    text: P.bisq,
    Thumb: CryptoThumb,
  },
  {
    id: 'sandbox',
    title: 'Sandbox',
    sub: 'Write · Run · Debug live code',
    route: '/sandbox',
    bg: P.wheat,
    darkBg: P.dark5,
    text: P.dark1,
    Thumb: SandboxThumb,
  },
  {
    id: 'game',
    title: '3D Game',
    sub: 'Explore the Algorithm Universe',
    route: '/game',
    bg: P.dark1,
    darkBg: '#0D0A0B',
    text: P.bisq,
    Thumb: GameThumb,
  },
];

/* ─────────────────────────────────────────────────────────────
   THUMBNAIL SVGs — simple, palette-only art
   ───────────────────────────────────────────────────────────── */

function VisualizerThumb({ text, bg }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full">
      {/* Array */}
      {[0,1,2,3].map(i => (
        <g key={i} transform={`translate(${28 + i*46}, 22)`}>
          <rect width="38" height="38" rx="7" fill={i===1?text:'none'} stroke={text} strokeWidth="2" opacity={i===1?1:0.6}/>
          <text x="19" y="26" textAnchor="middle" fontSize="14" fontFamily="monospace"
            fontWeight="bold" fill={i===1?bg:text} opacity={i===1?1:0.7}>{i}</text>
        </g>
      ))}
      {/* Tree */}
      <line x1="120" y1="85" x2="82"  y2="118" stroke={text} strokeWidth="1.8" opacity="0.5"/>
      <line x1="120" y1="85" x2="158" y2="118" stroke={text} strokeWidth="1.8" opacity="0.5"/>
      <line x1="82"  y1="118" x2="62" y2="150" stroke={text} strokeWidth="1.3" opacity="0.35"/>
      <line x1="82"  y1="118" x2="102"y2="150" stroke={text} strokeWidth="1.3" opacity="0.35"/>
      <line x1="158" y1="118" x2="138"y2="150" stroke={text} strokeWidth="1.3" opacity="0.35"/>
      <line x1="158" y1="118" x2="178"y2="150" stroke={text} strokeWidth="1.3" opacity="0.35"/>
      <circle cx="120" cy="85"  r="14" fill={text}/>
      <circle cx="82"  cy="118" r="10" fill="none" stroke={text} strokeWidth="1.8" opacity="0.8"/>
      <circle cx="158" cy="118" r="10" fill="none" stroke={text} strokeWidth="1.8" opacity="0.8"/>
      {[62,102,138,178].map(x=><circle key={x} cx={x} cy="150" r="7" fill="none" stroke={text} strokeWidth="1.5" opacity="0.5"/>)}
    </svg>
  );
}

function OopThumb({ text, bg }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full">
      <rect x="80" y="12" width="80" height="46" rx="6" stroke={text} strokeWidth="2" fill="none"/>
      <line x1="80" y1="28" x2="160" y2="28" stroke={text} strokeWidth="1.5"/>
      <text x="120" y="23" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill={text}>Animal</text>
      <text x="88" y="42" fontSize="6.5" fontFamily="monospace" fill={text} opacity="0.65">+ name: String</text>
      <text x="88" y="52" fontSize="6.5" fontFamily="monospace" fill={text} opacity="0.65">+ speak(): void</text>
      <line x1="100" y1="58" x2="66"  y2="96" stroke={text} strokeWidth="1.5"/>
      <line x1="140" y1="58" x2="174" y2="96" stroke={text} strokeWidth="1.5"/>
      <polygon points="66,96 60,84 72,84" fill={text}/>
      <polygon points="174,96 168,84 180,84" fill={text}/>
      <rect x="20"  y="96" width="92" height="44" rx="6" stroke={text} strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="112" x2="112" y2="112" stroke={text} strokeWidth="1"/>
      <text x="66" y="109" textAnchor="middle" fontSize="7" fontFamily="monospace" fontWeight="bold" fill={text}>Dog</text>
      <text x="27" y="125" fontSize="6" fontFamily="monospace" fill={text} opacity="0.6">speak() → "Woof"</text>
      <rect x="128" y="96" width="92" height="44" rx="6" stroke={text} strokeWidth="1.5" fill="none"/>
      <line x1="128" y1="112" x2="220" y2="112" stroke={text} strokeWidth="1"/>
      <text x="174" y="109" textAnchor="middle" fontSize="7" fontFamily="monospace" fontWeight="bold" fill={text}>Cat</text>
      <text x="135" y="125" fontSize="6" fontFamily="monospace" fill={text} opacity="0.6">speak() → "Meow"</text>
      <rect x="90" y="155" width="60" height="16" rx="8" fill="none" stroke={text} strokeWidth="1" opacity="0.4"/>
      <text x="120" y="167" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill={text} opacity="0.4">«interface»</text>
    </svg>
  );
}

function CryptoThumb({ text, bg }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full">
      <rect x="80" y="72" width="80" height="70" rx="10" stroke={text} strokeWidth="2" fill="none"/>
      <path d="M100 72 V52 C100 34 140 34 140 52 V72" stroke={text} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="120" cy="106" r="10" fill="none" stroke={text} strokeWidth="2"/>
      <line x1="120" y1="116" x2="120" y2="130" stroke={text} strokeWidth="2.5" strokeLinecap="round"/>
      {['A','E','S'].map((c,i)=><text key={c} x="16" y={30+i*32} fontSize="18" fontFamily="monospace" fontWeight="bold" fill={text} opacity={0.25+i*0.15}>{c}</text>)}
      {['R','S','A'].map((c,i)=><text key={c} x="210" y={30+i*32} fontSize="18" fontFamily="monospace" fontWeight="bold" fill={text} opacity={0.25+i*0.15}>{c}</text>)}
      <line x1="42" y1="90" x2="78" y2="100" stroke={text} strokeWidth="1" strokeDasharray="4 3" opacity="0.45"/>
      <line x1="162" y1="100" x2="198" y2="90" stroke={text} strokeWidth="1" strokeDasharray="4 3" opacity="0.45"/>
      <text x="120" y="170" textAnchor="middle" fontSize="7" fontFamily="monospace" fill={text} opacity="0.35">SHA · AES · RSA · DH · Enigma</text>
    </svg>
  );
}

function SandboxThumb({ text, bg }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full">
      <rect x="14" y="14" width="212" height="152" rx="12" stroke={text} strokeWidth="1.8" fill="none"/>
      <rect x="14" y="14" width="212" height="26" rx="12" fill={text} opacity="0.12"/>
      <line x1="14" y1="40" x2="226" y2="40" stroke={text} strokeWidth="1"/>
      <circle cx="32" cy="27" r="5" fill={text} opacity="0.35"/>
      <circle cx="48" cy="27" r="5" fill={text} opacity="0.35"/>
      <circle cx="64" cy="27" r="5" fill={text} opacity="0.35"/>
      {[
        {y:62, t:'def bubble_sort(arr):'},
        {y:78, t:'  for i in range(n):'},
        {y:94, t:'    for j in range(i):',hi:true},
        {y:110,t:'      if arr[j]>arr[j+1]:'},
        {y:126,t:'        swap(arr,j,j+1)'},
        {y:142,t:'  return arr'},
      ].map((l,i)=>(
        <text key={i} x="26" y={l.y} fontSize="8" fontFamily="monospace"
          fill={text} opacity={l.hi?1:0.45} fontWeight={l.hi?'bold':'normal'}>{l.t}</text>
      ))}
      <rect x="26" y="148" width="5" height="10" rx="1" fill={text} opacity="0.7">
        <animate attributeName="opacity" values="0.7;0;0.7" dur="1.2s" repeatCount="indefinite"/>
      </rect>
      <rect x="170" y="150" width="52" height="13" rx="6" fill={text} opacity="0.75"/>
      <text x="196" y="161" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fontWeight="bold" fill={bg}>▶ Run</text>
    </svg>
  );
}

function GameThumb({ text, bg }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full">
      {/* Grid floor */}
      {[0,1,2,3,4].map(i=>(
        <line key={i} x1={20+i*48} y1="50" x2={60+i*36} y2="160" stroke={text} strokeWidth="0.8" opacity="0.18"/>
      ))}
      {[0,1,2,3].map(i=>(
        <line key={i} x1="20" y1={75+i*26} x2="220" y2={75+i*26} stroke={text} strokeWidth="0.8" opacity="0.18"/>
      ))}
      {/* Isometric cube */}
      <g transform="translate(80,40)">
        <polygon points="40,0 80,20 40,40 0,20" fill={text} opacity="0.22"/>
        <polygon points="0,20 40,40 40,80 0,60" fill={text} opacity="0.14"/>
        <polygon points="40,40 80,20 80,60 40,80" fill={text} opacity="0.18"/>
        <polygon points="40,0 80,20 40,40 0,20" fill="none" stroke={text} strokeWidth="1.5" opacity="0.6"/>
        <polygon points="0,20 40,40 40,80 0,60" fill="none" stroke={text} strokeWidth="1.5" opacity="0.6"/>
        <polygon points="40,40 80,20 80,60 40,80" fill="none" stroke={text} strokeWidth="1.5" opacity="0.6"/>
      </g>
      {/* Small cubes */}
      <g transform="translate(24,80)" opacity="0.5">
        <polygon points="16,0 32,8 16,16 0,8" fill="none" stroke={text} strokeWidth="1"/>
        <polygon points="0,8 16,16 16,28 0,20" fill="none" stroke={text} strokeWidth="1"/>
        <polygon points="16,16 32,8 32,20 16,28" fill="none" stroke={text} strokeWidth="1"/>
      </g>
      <g transform="translate(170,90)" opacity="0.5">
        <polygon points="12,0 24,6 12,12 0,6" fill="none" stroke={text} strokeWidth="1"/>
        <polygon points="0,6 12,12 12,22 0,16" fill="none" stroke={text} strokeWidth="1"/>
        <polygon points="12,12 24,6 24,16 12,22" fill="none" stroke={text} strokeWidth="1"/>
      </g>
      <text x="120" y="170" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={text} opacity="0.4">Algorithm Quest · 3D World</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   COVER FLOW MATH
   Given index distance from center, compute transform values.
   ───────────────────────────────────────────────────────────── */
function getCardStyle(offset, total) {
  const absOff = Math.abs(offset);
  const sign   = Math.sign(offset);

  const CARD_W   = 300;
  const SPREAD_X = 190;   // horizontal gap between cards
  const MAX_ROT  = 52;    // degrees of Y-rotation for side cards
  const Z_BACK   = 180;   // how far side cards recede

  const translateX = sign * Math.min(absOff, 3) * SPREAD_X + (absOff > 3 ? sign * 60 : 0);
  const translateZ = absOff === 0 ? 60 : -Z_BACK * Math.min(absOff, 3);
  const rotateY    = absOff === 0 ? 0 : sign * -MAX_ROT;
  const scale      = absOff === 0 ? 1 : Math.max(0.55, 1 - absOff * 0.13);
  const opacity    = absOff > 3 ? 0 : Math.max(0.15, 1 - absOff * 0.25);
  const zIndex     = 100 - absOff * 10;

  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    zIndex,
    pointerEvents: absOff > 3 ? 'none' : 'auto',
  };
}

/* ─────────────────────────────────────────────────────────────
   MAIN HOME PAGE
   ───────────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);  // center card index
  const [entering, setEntering] = useState(false);
  const touchStartX = useRef(null);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  setActive(a => Math.max(0, a - 1));
      if (e.key === 'ArrowRight') setActive(a => Math.min(CARDS.length - 1, a + 1));
      if (e.key === 'Enter' || e.key === ' ') handleEnter();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  /* Touch swipe */
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) setActive(a => Math.min(CARDS.length - 1, a + 1));
    if (dx >  40) setActive(a => Math.max(0, a - 1));
    touchStartX.current = null;
  };

  const handleEnter = useCallback(() => {
    if (entering) return;
    setEntering(true);
    setTimeout(() => navigate(CARDS[active].route), 600);
  }, [active, entering, navigate]);

  const card = CARDS[active];

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ background: '#0C0A0D' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── BACKGROUND COLOUR WASH — tinted by active card ── */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${card.bg}22 0%, transparent 65%)`,
        }}
      />

      {/* ── TOP LABEL ── */}
      <div className="absolute top-8 left-0 right-0 flex flex-col items-center z-20 pointer-events-none">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs"
            style={{ background: P.red, color: P.bisq }}>
            &lt;/&gt;
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: P.bisq, opacity: 0.9 }}>
            Code Nova
          </span>
        </div>

        {/* Counter label */}
        <div className="font-mono text-[11px] tracking-[0.25em] uppercase"
          style={{ color: P.bisq, opacity: 0.35 }}>
          &lt; {String(active + 1).padStart(2,'0')} SELC. &gt;
        </div>
      </div>

      {/* ── COVER FLOW STAGE ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
      >
        <div className="relative" style={{ width: 320, height: 420 }}>
          {CARDS.map((c, i) => {
            const offset = i - active;
            const style  = getCardStyle(offset, CARDS.length);

            return (
              <div
                key={c.id}
                onClick={() => {
                  if (offset !== 0) { setActive(i); return; }
                  handleEnter();
                }}
                className="absolute inset-0 rounded-3xl overflow-hidden cursor-pointer"
                style={{
                  ...style,
                  transition: entering
                    ? 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.55s ease'
                    : 'transform 0.45s cubic-bezier(0.34,1.2,0.64,1), opacity 0.35s ease',
                  backgroundColor: c.bg,
                  ...(entering && offset === 0 ? {
                    transform: 'translateX(0) translateZ(600px) scale(1.6)',
                    opacity: 0,
                  } : {}),
                }}
              >
                {/* Inner layout */}
                <div className="w-full h-full flex flex-col p-6">
                  {/* Thumb */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full" style={{ maxHeight: '220px' }}>
                      <c.Thumb text={c.text} bg={c.bg} />
                    </div>
                  </div>

                  {/* Bottom text */}
                  <div className="shrink-0">
                    <div
                      className="text-[9px] font-mono tracking-[0.18em] uppercase mb-1"
                      style={{ color: c.text, opacity: 0.5 }}
                    >
                      {c.id.toUpperCase()}
                    </div>
                    <div className="font-black text-xl leading-tight mb-1" style={{ color: c.text }}>
                      {c.title}
                    </div>
                    <div className="text-[11px] font-mono leading-snug" style={{ color: c.text, opacity: 0.55 }}>
                      {c.sub}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PREV / NEXT BUTTONS ── */}
      <button
        onClick={() => setActive(a => Math.max(0, a - 1))}
        disabled={active === 0}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: P.bisq,
          opacity: active === 0 ? 0.2 : 0.7,
        }}
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={() => setActive(a => Math.min(CARDS.length - 1, a + 1))}
        disabled={active === CARDS.length - 1}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: P.bisq,
          opacity: active === CARDS.length - 1 ? 0.2 : 0.7,
        }}
      >
        <ChevronRight size={18} />
      </button>

      {/* ── BOTTOM: DOT TRACK + ENTER BUTTON ── */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-5 z-20">

        {/* Enter CTA */}
        <button
          onClick={handleEnter}
          className="font-bold text-sm px-8 py-3 rounded-full transition-all"
          style={{
            background: card.bg,
            color: card.text,
            boxShadow: `0 8px 28px ${card.bg}60`,
            transform: entering ? 'scale(0.9)' : 'scale(1)',
          }}
        >
          Enter {card.title} →
        </button>

        {/* Dot track */}
        <div className="flex items-center gap-2">
          {CARDS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              className="rounded-full transition-all"
              style={{
                width:  i === active ? 24 : 8,
                height: 8,
                background: i === active ? card.bg : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* Hint */}
        <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: P.bisq, opacity: 0.22 }}>
          ← Arrow keys or swipe · Click center to enter →
        </p>
      </div>

    </div>
  );
}
