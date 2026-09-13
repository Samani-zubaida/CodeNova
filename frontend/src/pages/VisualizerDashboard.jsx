import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Code2, 
  Gamepad2, 
  Sparkles, 
  Search, 
  Sun, 
  Circle, 
  Moon, 
  ChevronDown, 
  ArrowRight,
  LogOut,
  LogIn
} from 'lucide-react';
import useAppStore from '../store/useAppStore';

/* ========================================================================= */
/* 1. HERO 3D ISOMETRIC ILLUSTRATION                                        */
/* ========================================================================= */
const HeroIllustration = () => (
  <svg viewBox="0 0 520 220" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hillGradLight" x1="200" y1="0" x2="500" y2="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C5CEAE" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="hillGradDark" x1="200" y1="0" x2="500" y2="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#30382D" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#331921" stopOpacity="0.2" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#331921" floodOpacity="0.2" />
      </filter>
    </defs>

    {/* Smooth Sage Green Hill (Adapts to #30382D in dark mode) */}
    <path 
      d="M120 220 C 180 120, 290 60, 520 70 L 520 220 Z" 
      className="fill-[url(#hillGradLight)] dark:fill-[url(#hillGradDark)]"
    />

    {/* Floating Isometric 3D Cube 1 (Sage: #C5CEAE in light, #30382D in dark) */}
    <g transform="translate(195, 80)">
      <polygon points="18,0 36,10 18,20 0,10" className="fill-[#E2E8D2] dark:fill-[#434F3F]" />
      <polygon points="0,10 18,20 18,40 0,30" className="fill-[#C5CEAE] dark:fill-[#30382D]" />
      <polygon points="18,20 36,10 36,30 18,40" className="fill-[#A9B58E] dark:fill-[#252C23]" />
    </g>

    {/* Floating Isometric 3D Cube 2 (Rose: #AB526B in light, #331921 in dark) */}
    <g transform="translate(205, 30)">
      <polygon points="14,0 28,8 14,16 0,8" className="fill-[#C5637D] dark:fill-[#48232F]" />
      <polygon points="0,8 14,16 14,32 0,24" className="fill-[#AB526B] dark:fill-[#331921]" />
      <polygon points="14,16 28,8 28,24 14,32" className="fill-[#8E3B53] dark:fill-[#251218]" />
    </g>

    {/* Floating Isometric 3D Cube 3 (Rosy Brown: #BCA297 in light, #423834 in dark) */}
    <g transform="translate(180, 120)">
      <polygon points="14,0 28,8 14,16 0,8" className="fill-[#E8D1CB] dark:fill-[#5C4E49]" />
      <polygon points="0,8 14,16 14,30 0,22" className="fill-[#BCA297] dark:fill-[#423834]" />
      <polygon points="14,16 28,8 28,22 14,30" className="fill-[#A4877B] dark:fill-[#322A27]" />
    </g>

    {/* 3D Laptop */}
    <g transform="translate(230, 80)" filter="url(#softShadow)">
      {/* Keyboard Base Shadow */}
      <ellipse cx="110" cy="115" rx="90" ry="18" fill="#000" opacity="0.1" />

      {/* Keyboard Surface */}
      <polygon points="20,95 160,75 220,115 80,135" className="fill-[#E5D9D2] dark:fill-[#423834] stroke-[#BCA297] dark:stroke-[#5C4E49]" strokeWidth="1" />
      <polygon points="20,95 80,135 80,138 20,98" className="fill-[#A4877B] dark:fill-[#322A27]" />
      <polygon points="80,135 220,115 220,118 80,138" className="fill-[#8C7064] dark:fill-[#251F1D]" />

      {/* Trackpad */}
      <polygon points="85,122 120,117 132,126 97,131" className="fill-[#FDFBF7] dark:fill-[#5C4E49]" opacity="0.5" />

      {/* Laptop Screen */}
      <g transform="translate(30, -35)">
        <polygon points="30,30 145,15 145,95 30,110" className="fill-[#BCA297] dark:fill-[#423834]" />
        <polygon points="32,28 147,13 147,93 32,108" className="fill-[#2C1820] dark:fill-[#251218]" />
        {/* Screen Interior: #24141A in light, #331921 in dark */}
        <polygon points="36,33 143,19 143,89 36,103" className="fill-[#24141A] dark:fill-[#331921]" />

        {/* Code Lines on Screen */}
        <line x1="42" y1="42" x2="65" y2="39" stroke="#AB526B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="38" x2="105" y2="34" stroke="#F0E2A4" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="85" y2="45" stroke="#C5CEAE" strokeWidth="2" strokeLinecap="round" />
        <line x1="90" y1="45" x2="125" y2="40" stroke="#F4EBC3" strokeWidth="2" strokeLinecap="round" />
        <line x1="58" y1="58" x2="110" y2="51" stroke="#AB526B" strokeWidth="2" strokeLinecap="round" />
        <line x1="58" y1="66" x2="95" y2="61" stroke="#F0E2A4" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="74" x2="75" y2="70" stroke="#C5CEAE" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>

    {/* Floating Graph Visualizer Card (Beside screen) */}
    <g transform="translate(360, 60)" filter="url(#softShadow)">
      <rect x="0" y="0" width="85" height="65" rx="8" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#EBE0D3] dark:stroke-[#5C4E49]" strokeWidth="1.5" />
      <g stroke="#AB526B" strokeWidth="1.2" opacity="0.75">
        <line x1="20" y1="20" x2="50" y2="15" />
        <line x1="50" y1="15" x2="70" y2="35" />
        <line x1="20" y1="20" x2="35" y2="48" />
        <line x1="35" y1="48" x2="70" y2="35" />
        <line x1="20" y1="20" x2="70" y2="35" strokeDasharray="2 2" stroke="#C5CEAE" />
      </g>
      <circle cx="20" cy="20" r="4.5" fill="#AB526B" />
      <circle cx="50" cy="15" r="3.5" fill="#C5CEAE" />
      <circle cx="70" cy="35" r="4" fill="#F0E2A4" />
      <circle cx="35" cy="48" r="3.5" fill="#BCA297" />
    </g>

    {/* Potted Plant */}
    <g transform="translate(450, 110)">
      <polygon points="12,45 32,45 36,65 8,65" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#EBE0D3] dark:stroke-[#5C4E49]" strokeWidth="1" />
      <ellipse cx="22" cy="45" rx="10" ry="3" className="fill-[#BCA297] dark:fill-[#5C4E49]" />
      <path d="M22 45 Q 15 25 10 18" stroke="#A9B58E" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="10" cy="18" rx="5" ry="8" transform="rotate(-30 10 18)" className="fill-[#C5CEAE] dark:fill-[#30382D]" />
      <path d="M22 45 Q 22 20 22 10" stroke="#8E9B73" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="10" rx="5" ry="9" className="fill-[#A9B58E] dark:fill-[#434F3F]" />
      <path d="M22 45 Q 30 25 35 20" stroke="#A9B58E" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="35" cy="20" rx="5" ry="8" transform="rotate(35 35 20)" className="fill-[#C5CEAE] dark:fill-[#30382D]" />
    </g>
  </svg>
);

/* ========================================================================= */
/* 2. CARD GRAPHIC SVGS WITH EXACT DARK SHADES                               */
/* ========================================================================= */

// Array Suite: Light #E8C5C8 -> Dark #331921 (Indian Red Dark)
const ArrayCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#E8C5C8] dark:fill-[#331921]" fillOpacity="0.85" />
    <g transform="translate(14, 20)">
      <rect x="0" y="0" width="20" height="28" rx="4" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <text x="10" y="19" fontSize="13" fontWeight="bold" className="fill-[#2D1F23] dark:fill-[#F4EBC3]" textAnchor="middle" fontFamily="monospace">0</text>
      
      <rect x="24" y="0" width="20" height="28" rx="4" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <text x="34" y="19" fontSize="13" fontWeight="bold" className="fill-[#2D1F23] dark:fill-[#F4EBC3]" textAnchor="middle" fontFamily="monospace">1</text>
      
      <rect x="48" y="0" width="20" height="28" rx="4" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <text x="58" y="19" fontSize="13" fontWeight="bold" className="fill-[#2D1F23] dark:fill-[#F4EBC3]" textAnchor="middle" fontFamily="monospace">2</text>
      
      <rect x="72" y="0" width="20" height="28" rx="4" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <text x="82" y="19" fontSize="13" fontWeight="bold" className="fill-[#2D1F23] dark:fill-[#F4EBC3]" textAnchor="middle" fontFamily="monospace">3</text>
    </g>
  </svg>
);

// Graph Suite: Light #C5CEAE -> Dark #30382D (Silver / Sage Dark)
const GraphCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#C5CEAE] dark:fill-[#30382D]" fillOpacity="0.85" />
    <g className="stroke-[#2D1F23] dark:stroke-[#F4EBC3]" strokeWidth="1.2">
      <line x1="30" y1="36" x2="60" y2="20" />
      <line x1="60" y1="20" x2="90" y2="35" />
      <line x1="30" y1="36" x2="48" y2="55" />
      <line x1="48" y1="55" x2="90" y2="35" />
    </g>
    <circle cx="30" cy="36" r="7.5" fill="#AB526B" className="stroke-[#2D1F23] dark:stroke-[#30382D]" strokeWidth="1.2" />
    <circle cx="60" cy="20" r="7" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#2D1F23] dark:stroke-[#30382D]" strokeWidth="1.2" />
    <circle cx="90" cy="35" r="8" className="fill-[#FDFBF7] dark:fill-[#F0E2A4] stroke-[#2D1F23] dark:stroke-[#30382D]" strokeWidth="1.2" />
    <circle cx="48" cy="55" r="7" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#2D1F23] dark:stroke-[#30382D]" strokeWidth="1.2" />
  </svg>
);

// String: Light #F0E2A4 -> Dark #5B3E18 (Wheat Dark)
const StringCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#F0E2A4] dark:fill-[#5B3E18]" fillOpacity="0.85" />
    <text x="32" y="32" fontSize="22" fontWeight="bold" className="fill-[#8C6E2E] dark:fill-[#F0E2A4]" fontFamily="serif">“</text>
    <text x="82" y="32" fontSize="22" fontWeight="bold" className="fill-[#8C6E2E] dark:fill-[#F0E2A4]" fontFamily="serif">”</text>
    <g className="stroke-[#8C6E2E] dark:stroke-[#F0E2A4]" strokeWidth="2.5" strokeLinecap="round">
      <line x1="38" y1="46" x2="52" y2="46" />
      <line x1="58" y1="46" x2="72" y2="46" />
      <line x1="78" y1="46" x2="92" y2="46" />
    </g>
  </svg>
);

// Stack: Light #E8D1CB -> Dark #423834 (Rosy Brown Dark)
const StackCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#E8D1CB] dark:fill-[#423834]" fillOpacity="0.85" />
    <g transform="translate(38, 12)">
      {/* Bottom Layer */}
      <polygon points="18,34 36,26 54,34 36,42" fill="#AB526B" className="stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1" />
      <polygon points="18,34 36,42 36,47 18,39" fill="#8E3B53" className="stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1" />
      <polygon points="36,42 54,34 54,39 36,47" fill="#8E3B53" className="stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1" />

      {/* Middle Layer */}
      <polygon points="18,22 36,14 54,22 36,30" className="fill-[#FDFBF7] dark:fill-[#5C4E49] stroke-[#2D1F23] dark:stroke-[#331921]" strokeWidth="1" />
      <polygon points="18,22 36,30 36,35 18,27" className="fill-[#BCA297] dark:fill-[#48232F] stroke-[#2D1F23] dark:stroke-[#331921]" strokeWidth="1" />
      <polygon points="36,30 54,22 54,27 36,35" className="fill-[#BCA297] dark:fill-[#48232F] stroke-[#2D1F23] dark:stroke-[#331921]" strokeWidth="1" />

      {/* Top Layer */}
      <polygon points="18,10 36,2 54,10 36,18" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#2D1F23] dark:stroke-[#331921]" strokeWidth="1" />
      <polygon points="18,10 36,18 36,23 18,15" className="fill-[#BCA297] dark:fill-[#5C4E49] stroke-[#2D1F23] dark:stroke-[#331921]" strokeWidth="1" />
      <polygon points="36,18 54,10 54,15 36,23" className="fill-[#BCA297] dark:fill-[#5C4E49] stroke-[#2D1F23] dark:stroke-[#331921]" strokeWidth="1" />
      
      {/* Upward Arrow */}
      <g className="stroke-[#AB526B] dark:stroke-[#F0E2A4]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(62, 5)">
        <line x1="0" y1="36" x2="0" y2="10" />
        <polyline points="-4,15 0,9 4,15" fill="none" />
      </g>
    </g>
  </svg>
);

// Queue: Light #C5CEAE -> Dark #30382D (Silver / Sage Dark)
const QueueCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#C5CEAE] dark:fill-[#30382D]" fillOpacity="0.85" />
    <g transform="translate(18, 22)">
      <rect x="18" y="0" width="18" height="24" rx="3" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <circle cx="27" cy="12" r="2.5" className="fill-[#2D1F23] dark:fill-[#F4EBC3]" />

      <rect x="38" y="0" width="18" height="24" rx="3" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <circle cx="47" cy="12" r="2.5" className="fill-[#2D1F23] dark:fill-[#F4EBC3]" />

      <rect x="58" y="0" width="18" height="24" rx="3" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <circle cx="67" cy="12" r="2.5" className="fill-[#2D1F23] dark:fill-[#F4EBC3]" />

      <g className="stroke-[#2D1F23] dark:stroke-[#F4EBC3]" strokeWidth="1.5" strokeLinecap="round">
        <line x1="0" y1="12" x2="12" y2="12" />
        <polyline points="8,8 12,12 8,16" fill="none" />
      </g>

      <g className="stroke-[#AB526B] dark:stroke-[#F0E2A4]" strokeWidth="2" strokeLinecap="round">
        <line x1="80" y1="12" x2="94" y2="12" />
        <polyline points="89,8 94,12 89,16" fill="none" />
      </g>
    </g>
  </svg>
);

// Linked List: Light #E8C5C8 -> Dark #331921 (Indian Red Dark)
const LinkedListCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#E8C5C8] dark:fill-[#331921]" fillOpacity="0.85" />
    <g transform="translate(20, 22)">
      <rect x="0" y="0" width="30" height="24" rx="4" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <line x1="18" y1="0" x2="18" y2="24" className="stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1" />
      <circle cx="9" cy="12" r="2.5" fill="#AB526B" />
      <circle cx="24" cy="12" r="2" className="fill-[#2D1F23] dark:fill-[#F4EBC3]" />

      <g className="stroke-[#2D1F23] dark:stroke-[#F4EBC3]" strokeWidth="1.5" strokeLinecap="round">
        <line x1="30" y1="12" x2="48" y2="12" />
        <polyline points="44,8 48,12 44,16" fill="none" />
      </g>

      <rect x="50" y="0" width="30" height="24" rx="4" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <line x1="68" y1="0" x2="68" y2="24" className="stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1" />
      <circle cx="59" cy="12" r="2.5" fill="#AB526B" />
      <line x1="72" y1="7" x2="76" y2="17" stroke="#BCA297" strokeWidth="1.5" />
    </g>
  </svg>
);

// Tree: Light #F0E2A4 -> Dark #5B3E18 (Wheat Dark)
const TreeCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#F0E2A4] dark:fill-[#5B3E18]" fillOpacity="0.85" />
    <g className="stroke-[#8C6E2E] dark:stroke-[#F0E2A4]" strokeWidth="1.2">
      <line x1="60" y1="18" x2="42" y2="36" />
      <line x1="60" y1="18" x2="78" y2="36" />
      <line x1="42" y1="36" x2="32" y2="52" />
      <line x1="42" y1="36" x2="50" y2="52" />
      <line x1="78" y1="36" x2="70" y2="52" />
      <line x1="78" y1="36" x2="88" y2="52" />
    </g>
    <circle cx="60" cy="18" r="6.5" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#8C6E2E] dark:stroke-[#5B3E18]" strokeWidth="1.2" />
    <circle cx="42" cy="36" r="5.5" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#8C6E2E] dark:stroke-[#5B3E18]" strokeWidth="1.2" />
    <circle cx="78" cy="36" r="5.5" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#8C6E2E] dark:stroke-[#5B3E18]" strokeWidth="1.2" />
    <circle cx="32" cy="52" r="4" fill="#AB526B" className="stroke-[#8C6E2E] dark:stroke-[#5B3E18]" strokeWidth="1" />
    <circle cx="50" cy="52" r="4" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#8C6E2E] dark:stroke-[#5B3E18]" strokeWidth="1" />
    <circle cx="70" cy="52" r="4" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#8C6E2E] dark:stroke-[#5B3E18]" strokeWidth="1" />
    <circle cx="88" cy="52" r="4" fill="#AB526B" className="stroke-[#8C6E2E] dark:stroke-[#5B3E18]" strokeWidth="1" />
  </svg>
);

// Heap: Light #E8D1CB -> Dark #625233 (Bisque Dark)
const HeapCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#E8D1CB] dark:fill-[#625233]" fillOpacity="0.85" />
    <g className="stroke-[#2D1F23] dark:stroke-[#F4EBC3]" strokeWidth="1.2">
      <line x1="60" y1="18" x2="46" y2="38" />
      <line x1="60" y1="18" x2="74" y2="38" />
      <line x1="46" y1="38" x2="38" y2="54" />
      <line x1="46" y1="38" x2="54" y2="54" />
      <line x1="74" y1="38" x2="66" y2="54" />
      <line x1="74" y1="38" x2="82" y2="54" />
    </g>
    <circle cx="60" cy="18" r="7" fill="#AB526B" className="stroke-[#2D1F23] dark:stroke-[#625233]" strokeWidth="1.2" />
    <circle cx="46" cy="38" r="6" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#2D1F23] dark:stroke-[#625233]" strokeWidth="1.2" />
    <circle cx="74" cy="38" r="6" className="fill-[#FDFBF7] dark:fill-[#F4EBC3] stroke-[#2D1F23] dark:stroke-[#625233]" strokeWidth="1.2" />
    <circle cx="38" cy="54" r="4.5" className="fill-[#FDFBF7] dark:fill-[#F0E2A4] stroke-[#2D1F23] dark:stroke-[#625233]" strokeWidth="1" />
    <circle cx="54" cy="54" r="4.5" className="fill-[#FDFBF7] dark:fill-[#F0E2A4] stroke-[#2D1F23] dark:stroke-[#625233]" strokeWidth="1" />
    <circle cx="66" cy="54" r="4.5" className="fill-[#FDFBF7] dark:fill-[#F0E2A4] stroke-[#2D1F23] dark:stroke-[#625233]" strokeWidth="1" />
    <circle cx="82" cy="54" r="4.5" className="fill-[#FDFBF7] dark:fill-[#F0E2A4] stroke-[#2D1F23] dark:stroke-[#625233]" strokeWidth="1" />
  </svg>
);


// OOP: Light #C5CEAE -> Dark #30382D (Soft Sage Dark)
const OOPCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#C5CEAE] dark:fill-[#30382D]" fillOpacity="0.85" />
    <g transform="translate(18, 14)">
      <rect x="0" y="0" width="38" height="42" rx="8" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#2D1F23] dark:stroke-[#5C4E49]" strokeWidth="1.2" />
      <text x="19" y="14" fontSize="7" fill="#AB526B" textAnchor="middle" fontWeight="bold">Class</text>
      <line x1="6" y1="20" x2="32" y2="20" stroke="#BCA297" strokeWidth="1" />
      <circle cx="12" cy="28" r="2" fill="#AB526B" />
      <text x="17" y="30.5" fontSize="6.5" fill="#2D1F23" className="dark:fill-[#F4EBC3]" fontFamily="monospace">data</text>
      
      <g className="stroke-[#AB526B] dark:stroke-[#F0E2A4]" strokeWidth="1.5" strokeLinecap="round">
        <line x1="42" y1="21" x2="56" y2="21" />
        <polyline points="52,17 56,21 52,25" fill="none" />
      </g>

      <rect x="60" y="6" width="26" height="30" rx="6" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#AB526B] dark:stroke-[#F0E2A4]" strokeWidth="1.2" />
      <text x="73" y="18" fontSize="6" fill="#2D1F23" className="dark:fill-[#F4EBC3]" textAnchor="middle" fontWeight="bold">Object</text>
      <circle cx="73" cy="27" r="4" fill="#AB526B" />
    </g>
  </svg>
);

// Cryptography: Light #E8C5C8 -> Dark #331921 (Rose/Dark)
const CryptoCardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="70" rx="14" className="fill-[#E8C5C8] dark:fill-[#331921]" fillOpacity="0.9" />
    <g transform="translate(38, 12)">
      <path d="M22 6 L 40 14 V 28 C 40 38, 22 46, 22 46 C 22 46, 4 38, 4 28 V 14 Z" className="fill-[#FDFBF7] dark:fill-[#423834] stroke-[#AB526B] dark:stroke-[#F0E2A4]" strokeWidth="1.5" />
      <rect x="16" y="24" width="12" height="10" rx="2" fill="#AB526B" />
      <path d="M18 24 V 20 C 18 17.5, 26 17.5, 26 20 V 24" stroke="#AB526B" strokeWidth="1.8" fill="none" />
      <circle cx="22" cy="28" r="1.2" fill="#FAF7F2" />
    </g>
  </svg>
);

/* ========================================================================= */
/* 3. ALGORITHM CARDS DATA                                                   */
/* ========================================================================= */
const ALGO_CARDS = [
  {
    id: 'array',
    title: 'Array Suite',
    subtitle: '16 Types & Algos • Dedicated 3D Spatial Simulator',
    path: '/visualizer/array',
    badge: '16 Algos',
    graphic: <ArrayCardGraphic />,
    tags: [
      { name: 'Binary Search', path: '/visualizer/array/binary_search' },
      { name: 'Quick Sort', path: '/visualizer/array/quicksort' },
      { name: '+14 more', path: '/visualizer/array' }
    ]
  },
  {
    id: 'graph',
    title: 'Graph Suite',
    subtitle: 'Network traversals, paths & structural analysis',
    path: '/visualizer/graph',
    badge: '15 Algos',
    graphic: <GraphCardGraphic />,
    tags: [
      { name: 'BFS', path: '/visualizer/graph/bfs' },
      { name: 'DFS', path: '/visualizer/graph/dfs' },
      { name: 'Dijkstra', path: '/visualizer/graph/dijkstra' },
      { name: '+11 more', path: '/visualizer/graph' }
    ]
  },
  {
    id: 'string',
    title: 'String',
    subtitle: 'Immutable vs Mutable',
    path: '/visualizer/string',
    badge: null,
    graphic: <StringCardGraphic />,
    tags: [
      { name: 'KMP', path: '/visualizer/string' },
      { name: 'Rabin-Karp', path: '/visualizer/string' },
      { name: '+2 more', path: '/visualizer/string' }
    ]
  },
  {
    id: 'stack',
    title: 'Stack',
    subtitle: 'LIFO principle',
    path: '/visualizer/stack',
    badge: null,
    graphic: <StackCardGraphic />,
    tags: [
      { name: 'Push', path: '/visualizer/stack' },
      { name: 'Pop', path: '/visualizer/stack' },
      { name: 'Top', path: '/visualizer/stack' },
      { name: '+1 more', path: '/visualizer/stack' }
    ]
  },
  {
    id: 'queue',
    title: 'Queue',
    subtitle: 'FIFO principle',
    path: '/visualizer/queue',
    badge: null,
    graphic: <QueueCardGraphic />,
    tags: []
  },
  {
    id: 'linkedlist',
    title: 'Linked List',
    subtitle: 'Nodes and pointers',
    path: '/visualizer/linkedlist',
    badge: null,
    graphic: <LinkedListCardGraphic />,
    tags: [
      { name: 'Insert', path: '/visualizer/linkedlist/singly_insert' },
      { name: 'Delete', path: '/visualizer/linkedlist/singly_delete' },
      { name: 'Reverse', path: '/visualizer/linkedlist/singly_reverse' },
      { name: '+1 more', path: '/visualizer/linkedlist' }
    ]
  },
  {
    id: 'tree',
    title: 'Tree',
    subtitle: 'Hierarchical nodes',
    path: '/visualizer/tree',
    badge: null,
    graphic: <TreeCardGraphic />,
    tags: [
      { name: 'Preorder', path: '/visualizer/tree' },
      { name: 'Inorder', path: '/visualizer/tree' },
      { name: 'Postorder', path: '/visualizer/tree' },
      { name: '+1 more', path: '/visualizer/tree' }
    ]
  },
  {
    id: 'heap',
    title: 'Heap',
    subtitle: 'Priority queues',
    path: '/visualizer/heap',
    badge: null,
    graphic: <HeapCardGraphic />,
    tags: [
      { name: 'Insert', path: '/visualizer/heap' },
      { name: 'Extract', path: '/visualizer/heap' },
      { name: 'Heapify', path: '/visualizer/heap' },
      { name: '+1 more', path: '/visualizer/heap' }
    ]
  }
,
  {
    id: 'oop',
    title: 'OOP Suite',
    subtitle: '4 Core Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism',
    path: '/visualizer/oop',
    category: 'oop',
    badge: '4 Pillars',
    graphic: <OOPCardGraphic />,
    tags: [
      { name: 'Encapsulation', path: '/visualizer/encapsulation' },
      { name: 'Inheritance', path: '/visualizer/inheritance' },
      { name: 'Polymorphism', path: '/visualizer/polymorphism' },
      { name: '+1 more', path: '/visualizer/oop' }
    ]
  },
  {
    id: 'crypto',
    title: 'Cryptography Suite',
    subtitle: '13 Ciphers & Protocols: AES, RSA, SHA-256, Diffie-Hellman, Enigma, Caesar',
    path: '/visualizer/crypto',
    category: 'crypto',
    badge: '13 Ciphers',
    graphic: <CryptoCardGraphic />,
    tags: [
      { name: 'AES-256', path: '/visualizer/aes' },
      { name: 'RSA', path: '/visualizer/rsa' },
      { name: 'Diffie-Hellman', path: '/visualizer/dh' },
      { name: '+10 more', path: '/visualizer/crypto' }
    ]
  },
];

/* ========================================================================= */
/* 4. MAIN DASHBOARD COMPONENT                                              */
/* ========================================================================= */
export default function VisualizerDashboard() {
  const navigate = useNavigate();
  const { theme, setTheme, user, logout } = useAppStore();
    const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'ds' | 'oop' | 'crypto'
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Live filter cards based on search input
  const filteredCards = ALGO_CARDS.filter(card => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'oop' && card.id === 'oop') ||
      (selectedCategory === 'crypto' && card.id === 'crypto') ||
      (selectedCategory === 'ds' && card.id !== 'oop' && card.id !== 'crypto');

    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(q) ||
      card.subtitle.toLowerCase().includes(q) ||
      card.tags.some(t => t.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen flex bg-[#FAF7F2] dark:bg-[#331921] text-[#2D1F23] dark:text-[#F4EBC3] font-sans selection:bg-[#AB526B] selection:text-white transition-colors duration-300">
      
      {/* =================================================================== */}
      {/* LEFT SIDEBAR (#AB526B in light, #28141B / #331921 in dark)        */}
      {/* =================================================================== */}
      <aside className="w-64 shrink-0 bg-[#AB526B] dark:bg-[#28141B] border-r border-transparent dark:border-[#48232F] flex flex-col justify-between p-6 select-none shadow-lg z-20 min-h-screen sticky top-0 transition-colors duration-300">
        
        {/* Top Part: Brand & Navigation Links */}
        <div>
          {/* Brand */}
          <Link to="/visualizer" className="flex items-center gap-3 mb-8 group">
            <div className="w-9 h-9 rounded-xl bg-white/20 dark:bg-[#AB526B] flex items-center justify-center text-white font-mono font-bold text-base shadow-xs group-hover:bg-white/30 dark:group-hover:bg-[#8E3B53] transition-all">
              &lt;/&gt;
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-95 transition-opacity">
              Code Nova
            </span>
          </Link>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-2">
            {/* Visualizers (Active Pill) */}
            <Link
              to="/visualizer"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/20 dark:bg-[#AB526B] text-white font-medium shadow-xs transition-all"
            >
              <LayoutGrid size={18} />
              <span className="text-sm">Visualizers</span>
            </Link>

            {/* Sandbox */}
            <Link
              to="/sandbox"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/75 hover:text-white hover:bg-white/10 dark:hover:bg-[#423834] font-medium transition-all"
            >
              <Code2 size={18} />
              <span className="text-sm">Sandbox</span>
            </Link>

            {/* 3D Game */}
            <Link
              to="/game"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/75 hover:text-white hover:bg-white/10 dark:hover:bg-[#423834] font-medium transition-all"
            >
              <Gamepad2 size={18} />
              <span className="text-sm">3D Game</span>
            </Link>

            {/* Direct Section Quick Jump */}
            <div className="pt-2 flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 px-4">
                Categories
              </span>
              <Link
                to="/visualizer/oop"
                className="flex items-center justify-between px-4 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
              >
                <span>OOP Pillars</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20">4</span>
              </Link>
              <Link
                to="/visualizer/crypto"
                className="flex items-center justify-between px-4 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
              >
                <span>Cryptography</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20">13</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Divider line */}
        <div className="my-auto pt-6 pb-6">
          <div className="w-full h-px bg-white/15 dark:bg-[#48232F]" />
        </div>

        {/* Bottom Card: Better Algorithms Bigger Dreams with wavy background */}
        <div className="relative overflow-hidden rounded-2xl bg-white/10 dark:bg-[#423834]/60 border border-white/15 dark:border-[#5C4E49] p-4 shadow-sm backdrop-blur-xs">
          {/* Decorative Wavy Lines Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 200 120" preserveAspectRatio="none" fill="none">
            <path d="M-20 90 C 40 70, 100 110, 220 80" stroke="#FFF" strokeWidth="1.5" />
            <path d="M-20 100 C 50 80, 110 120, 220 90" stroke="#FFF" strokeWidth="1.5" />
            <path d="M-20 110 C 60 90, 120 130, 220 100" stroke="#FFF" strokeWidth="1.5" />
          </svg>

          {/* Sparkle Icon */}
          <div className="w-8 h-8 rounded-lg bg-white/20 dark:bg-[#AB526B] flex items-center justify-center text-white mb-3 shadow-xs">
            <Sparkles size={16} />
          </div>

          {/* Headline */}
          <h4 className="text-sm font-bold text-white leading-tight">
            Better Algorithms<br />Bigger Dreams
          </h4>

          {/* Subtitle */}
          <p className="text-[11px] text-white/60 dark:text-[#F0E2A4] mt-1 font-medium tracking-wide">
            Visualize • Practice • Build
          </p>
        </div>

      </aside>

      {/* =================================================================== */}
      {/* MAIN CONTENT AREA                                                   */}
      {/* =================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* ----------------------------------------------------------------- */}
        {/* Top Header Bar: Search, 3-mode theme toggle, Profile Badge        */}
        {/* ----------------------------------------------------------------- */}
        <header className="px-8 py-5 flex items-center justify-between gap-6 border-b border-[#EBE0D3]/60 dark:border-[#48232F] bg-[#FAF7F2]/80 dark:bg-[#331921]/80 backdrop-blur-md sticky top-0 z-10">
          
          {/* Search Bar: #423834 in dark mode */}
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#BCA297]" />
            <input 
              type="text"
              placeholder="Search algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full text-xs md:text-sm bg-white/80 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] placeholder-gray-400 dark:placeholder-[#BCA297] text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:ring-2 focus:ring-[#AB526B]/50 transition-all shadow-2xs"
            />
          </div>

          {/* Right Controls: 3-mode theme switcher + Profile pill */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* 3-Mode Theme Switcher: Sun, Warm Sepia circle, Moon */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] p-1 rounded-full shadow-2xs">
              <button
                onClick={() => setTheme('light')}
                title="Light mode"
                className={`p-1.5 rounded-full transition-all ${
                  theme === 'light'
                    ? 'bg-[#AB526B] text-white shadow-xs'
                    : 'text-[#2D1F23]/60 dark:text-[#F4EBC3]/60 hover:text-[#AB526B]'
                }`}
              >
                <Sun size={15} />
              </button>
              <button
                onClick={() => setTheme('warm')}
                title="Warm Sepia mode"
                className={`p-1.5 rounded-full transition-all ${
                  theme === 'warm'
                    ? 'bg-[#AB526B] text-[#F0E2A4] shadow-xs'
                    : 'text-[#2D1F23]/60 dark:text-[#F4EBC3]/60 hover:text-[#AB526B]'
                }`}
              >
                <Circle size={15} className="fill-[#F0E2A4] stroke-[#BCA297]" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                title="Warm Dark mode"
                className={`p-1.5 rounded-full transition-all ${
                  theme === 'dark'
                    ? 'bg-[#AB526B] text-white shadow-xs'
                    : 'text-[#2D1F23]/60 dark:text-[#F4EBC3]/60 hover:text-[#AB526B]'
                }`}
              >
                <Moon size={15} />
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-white/80 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] pl-1.5 pr-3 py-1.5 rounded-full shadow-2xs hover:border-[#AB526B] transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#AB526B] text-white font-bold text-xs flex items-center justify-center">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'D'}
                </div>
                <span className="text-xs font-semibold text-[#2D1F23] dark:text-[#F4EBC3]">
                  {user?.username || 'DemoExplorer'}
                </span>
                <ChevronDown size={14} className="text-gray-400 dark:text-[#BCA297]" />
              </button>

              {/* Profile dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl shadow-lg p-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-[#5C4E49] mb-1">
                    <p className="text-xs font-bold text-[#2D1F23] dark:text-[#F4EBC3] truncate">{user?.username || 'DemoExplorer'}</p>
                    <p className="text-[10px] text-gray-400 dark:text-[#BCA297] truncate">{user?.email || 'explorer@codenova.dev'}</p>
                  </div>
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#48232F] rounded-lg transition-colors"
                    >
                      <LogOut size={13} />
                      <span>Log Out</span>
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#AB526B] hover:bg-[#AB526B]/10 rounded-lg transition-colors"
                    >
                      <LogIn size={13} />
                      <span>Sign In</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

          </div>

        </header>

        {/* ----------------------------------------------------------------- */}
        {/* Main Content: Hero Banner + Algorithm Visualizers Grid            */}
        {/* ----------------------------------------------------------------- */}
        <main className="p-8 max-w-7xl w-full mx-auto flex flex-col gap-8">
          
          {/* =============================================================== */}
          {/* HERO BANNER (#423834 in dark mode)                              */}
          {/* =============================================================== */}
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] p-8 md:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between min-h-[220px]">
            
            {/* Left Content */}
            <div className="z-10 max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#AB526B]/10 dark:bg-[#AB526B]/25 text-[#AB526B] dark:text-[#F0E2A4] text-xs font-semibold mb-3">
                Welcome to Code Nova
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#2D1F23] dark:text-[#F4EBC3] tracking-tight leading-tight">
                Visualize Algorithms
              </h1>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#AB526B] dark:text-[#F0E2A4] tracking-tight leading-tight mb-3">
                Build Stronger Logic
              </h2>

              {/* Subtitle */}
              <p className="text-xs md:text-sm text-[#2D1F23]/70 dark:text-[#BCA297] leading-relaxed max-w-md">
                Explore interactive visualizations for popular algorithms and data structures. Understand, experiment, and master.
              </p>
            </div>

            {/* Right 3D Isometric Illustration */}
            <div className="w-full md:w-[480px] h-[190px] md:h-[210px] shrink-0 mt-4 md:mt-0">
              <HeroIllustration />
            </div>

          </div>

          {/* =============================================================== */}
          {/* SECTION HEADER: | Algorithm Visualizers       [ 16 Algorithms ] */}
          {/* =============================================================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-[#AB526B] rounded-full" />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#2D1F23] dark:text-[#F4EBC3]">
                  Interactive Visualizer Catalog
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-[#BCA297]">
                  Data Structures • Object-Oriented Programming • Cryptography
                </p>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white/80 dark:bg-[#423834] p-1.5 rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-xs">
              {[
                { id: 'all', label: 'All (10 Suites)' },
                { id: 'ds', label: 'Data Structures (8)' },
                { id: 'oop', label: 'OOP Concepts (4)' },
                { id: 'crypto', label: 'Cryptography (13)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-[#AB526B] text-white shadow-xs'
                      : 'text-[#2D1F23]/70 dark:text-[#F4EBC3]/70 hover:text-[#AB526B] dark:hover:text-[#F0E2A4]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* =============================================================== */}
          {/* 8 ALGORITHM CARDS GRID (#423834 in dark mode)                   */}
          {/* =============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-12">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white dark:bg-[#423834] rounded-2xl p-5 border border-[#EBE0D3] dark:border-[#5C4E49] shadow-2xs hover:shadow-md hover:border-[#AB526B]/50 dark:hover:border-[#AB526B]/70 transition-all duration-300 flex flex-col group"
              >
                {/* Graphic Header with Top Right Badge */}
                <div className="relative w-full h-24 mb-4 rounded-xl overflow-hidden flex items-center justify-center">
                  {card.graphic}

                  {card.badge && (
                    <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-[#331921] text-[#AB526B] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49] shadow-2xs">
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <Link to={card.path} className="block group-hover:text-[#AB526B] transition-colors">
                  <h4 className="text-base font-bold text-[#2D1F23] dark:text-[#F4EBC3] mb-1">
                    {card.title}
                  </h4>
                  <p className="text-xs text-[#2D1F23]/60 dark:text-[#BCA297] mb-4 line-clamp-2 min-h-[32px]">
                    {card.subtitle}
                  </p>
                </Link>

                {/* Tags and Action Arrow Footer */}
                <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {card.tags.map((tag, idx) => (
                      <Link
                        key={idx}
                        to={tag.path}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#FAF7F2] dark:bg-[#331921] text-[#2D1F23]/70 dark:text-[#F4EBC3] border border-[#EBE0D3]/80 dark:border-[#5C4E49] hover:border-[#AB526B] hover:text-[#AB526B] transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>

                  {/* Arrow Action Button */}
                  <Link
                    to={card.path}
                    className="w-8 h-8 rounded-full border border-[#EBE0D3] dark:border-[#5C4E49] bg-white dark:bg-[#331921] flex items-center justify-center text-[#2D1F23]/70 dark:text-[#F4EBC3] group-hover:bg-[#AB526B] group-hover:text-white group-hover:border-[#AB526B] transition-all shadow-2xs shrink-0"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </main>

      </div>

    </div>
  );
}
