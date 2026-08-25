import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { GitMerge, Crosshair, Settings, Database, Binary, KeyRound, Layers, Hash, Network, Type, Lock, Shield, ListTree, ArrowRight } from 'lucide-react';

const splashIcons = {
  ds: (color) => (
    <motion.svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <motion.ellipse cx="12" cy="5" rx="9" ry="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
      <motion.path d="M3 5V19A9 3 0 0 0 21 19V5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }} />
      <motion.path d="M3 12A9 3 0 0 0 21 12" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }} />
    </motion.svg>
  ),
  oop: (color) => (
    <motion.svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <motion.rect x="14" y="14" width="4" height="6" rx="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
      <motion.rect x="6" y="4" width="4" height="6" rx="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }} />
      <motion.path d="M6 20h4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
      <motion.path d="M14 10h4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
      <motion.path d="M6 14h2v6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 }} />
      <motion.path d="M14 4h2v6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 }} />
    </motion.svg>
  ),
  crypto: (color) => (
    <motion.svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <motion.path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
      <motion.circle cx="16.5" cy="7.5" r="1.5" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 1.5 }} fill="currentColor" />
    </motion.svg>
  )
};

const TypewriterText = ({ text, color }) => {
  return (
    <motion.h1 
      className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-center mt-8"
      style={{ color }}
    >
      {text.split('').map((char, index) => {
        // Stable random delay per character position
        const randomDelay = ((index * 13) % 10) * 0.05 + Math.random() * 0.2;
        
        return (
          <motion.span
            key={`${char}-${index}`}
            initial={{ opacity: 0, filter: 'brightness(2)' }}
            animate={{ 
              opacity: [0, 0.8, 0.3, 1],
              filter: ['brightness(2)', 'brightness(1.5)', 'brightness(1)', 'brightness(1)']
            }}
            transition={{ 
              duration: 0.8, 
              delay: randomDelay,
              times: [0, 0.4, 0.7, 1],
              ease: "easeInOut"
            }}
            style={{ whiteSpace: 'pre', display: 'inline-block' }}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.h1>
  );
};

const categories = [
  {
    id: 'ds',
    title: 'Data Structures & Algorithms',
    shortTitle: 'DS',
    description: 'Master memory allocation, pointers, and algorithmic efficiency with interactive visualizers.',
    color: 'var(--color-nova-red)',
    bgGlow: 'from-[var(--color-nova-red)] to-transparent',
    dialIcon: <Database size={28} />,
    items: [
      { name: 'Array', path: '/visualizer/array', icon: <Layers size={28}/>, desc: 'Contiguous memory blocks', color: 'text-blue-400', border: 'hover:border-blue-400/50', shadow: 'hover:shadow-blue-400/20' },
      { name: 'String', path: '/visualizer/string', icon: <Type size={28}/>, desc: 'Immutable vs Mutable', color: 'text-purple-400', border: 'hover:border-purple-400/50', shadow: 'hover:shadow-purple-400/20' },
      { name: 'Stack', path: '/visualizer/stack', icon: <Layers size={28}/>, desc: 'LIFO principle', color: 'text-orange-400', border: 'hover:border-orange-400/50', shadow: 'hover:shadow-orange-400/20' },
      { name: 'Queue', path: '/visualizer/queue', icon: <ListTree size={28}/>, desc: 'FIFO principle', color: 'text-green-400', border: 'hover:border-green-400/50', shadow: 'hover:shadow-green-400/20' },
      { name: 'Linked List', path: '/visualizer/linkedlist', icon: <Network size={28}/>, desc: 'Nodes and pointers', color: 'text-teal-400', border: 'hover:border-teal-400/50', shadow: 'hover:shadow-teal-400/20' },
      { name: 'Tree', path: '/visualizer/tree', icon: <ListTree size={28}/>, desc: 'Hierarchical nodes', color: 'text-emerald-400', border: 'hover:border-emerald-400/50', shadow: 'hover:shadow-emerald-400/20' },
      { name: 'Heap', path: '/visualizer/heap', icon: <Layers size={28}/>, desc: 'Priority queues', color: 'text-yellow-400', border: 'hover:border-yellow-400/50', shadow: 'hover:shadow-yellow-400/20' },
      { name: 'Hash Map', path: '/visualizer/map', icon: <Hash size={28}/>, desc: 'O(1) lookups', color: 'text-pink-400', border: 'hover:border-pink-400/50', shadow: 'hover:shadow-pink-400/20' },
    ]
  },
  {
    id: 'oop',
    title: 'Object-Oriented Programming',
    shortTitle: 'OOP',
    description: 'Visualize the four foundational pillars of Object-Oriented Programming architecture.',
    color: 'var(--color-nova-brown)',
    bgGlow: 'from-[var(--color-nova-brown)] to-transparent',
    dialIcon: <Binary size={28} />,
    items: [
      { name: 'Encapsulation', path: '/visualizer/encapsulation', icon: <Lock size={28}/>, desc: 'Protecting internal state', color: 'text-indigo-400', border: 'hover:border-indigo-400/50', shadow: 'hover:shadow-indigo-400/20' },
      { name: 'Abstraction', path: '/visualizer/abstraction', icon: <Shield size={28}/>, desc: 'Hiding complexity', color: 'text-rose-400', border: 'hover:border-rose-400/50', shadow: 'hover:shadow-rose-400/20' },
      { name: 'Inheritance', path: '/visualizer/inheritance', icon: <Network size={28}/>, desc: 'Hierarchy and code reuse', color: 'text-amber-400', border: 'hover:border-amber-400/50', shadow: 'hover:shadow-amber-400/20' },
      { name: 'Polymorphism', path: '/visualizer/polymorphism', icon: <Layers size={28}/>, desc: 'Many forms, one interface', color: 'text-cyan-400', border: 'hover:border-cyan-400/50', shadow: 'hover:shadow-cyan-400/20' },
    ]
  },
  {
    id: 'crypto',
    title: 'Cryptography',
    shortTitle: 'Crypto',
    description: 'Interactive ciphers demonstrating historic data transformations and encryption.',
    color: 'var(--color-nova-green)',
    bgGlow: 'from-[var(--color-nova-green)] to-transparent',
    dialIcon: <KeyRound size={28} />,
    items: [
      { name: 'Caesar Cipher', path: '/visualizer/caesar', icon: <Lock size={28}/>, desc: 'Shift substitution', color: 'text-emerald-400', border: 'hover:border-emerald-400/50', shadow: 'hover:shadow-emerald-400/20' },
      { name: 'Vigenère Cipher', path: '/visualizer/vigenere', icon: <Layers size={28}/>, desc: 'Polyalphabetic substitution', color: 'text-emerald-500', border: 'hover:border-emerald-500/50', shadow: 'hover:shadow-emerald-500/20' },
      { name: 'Playfair Cipher', path: '/visualizer/playfair', icon: <Network size={28}/>, desc: '5x5 grid substitution', color: 'text-emerald-600', border: 'hover:border-emerald-600/50', shadow: 'hover:shadow-emerald-600/20' },
      { name: 'Rail Fence', path: '/visualizer/railfence', icon: <Network size={28}/>, desc: 'Zig-zag transposition', color: 'text-teal-400', border: 'hover:border-teal-400/50', shadow: 'hover:shadow-teal-400/20' },
      { name: 'Columnar', path: '/visualizer/columnar', icon: <Hash size={28}/>, desc: 'Grid transposition', color: 'text-teal-500', border: 'hover:border-teal-500/50', shadow: 'hover:shadow-teal-500/20' },
      { name: 'AES-256', path: '/visualizer/aes', icon: <Shield size={28}/>, desc: 'Advanced Encryption Standard', color: 'text-cyan-400', border: 'hover:border-cyan-400/50', shadow: 'hover:shadow-cyan-400/20' },
      { name: 'RSA Key Gen', path: '/visualizer/rsa', icon: <KeyRound size={28}/>, desc: 'Asymmetric cryptography', color: 'text-blue-400', border: 'hover:border-blue-400/50', shadow: 'hover:shadow-blue-400/20' },
      { name: 'SHA-256', path: '/visualizer/hash', icon: <Hash size={28}/>, desc: 'Cryptographic hashing', color: 'text-pink-400', border: 'hover:border-pink-400/50', shadow: 'hover:shadow-pink-400/20' },
      { name: 'Digital Signatures', path: '/visualizer/signature', icon: <Lock size={28}/>, desc: 'Authentication & Integrity', color: 'text-indigo-400', border: 'hover:border-indigo-400/50', shadow: 'hover:shadow-indigo-400/20' },
      { name: 'Steganography', path: '/visualizer/steg', icon: <Layers size={28}/>, desc: 'Data obfuscation (LSB)', color: 'text-purple-400', border: 'hover:border-purple-400/50', shadow: 'hover:shadow-purple-400/20' },
      { name: 'Enigma Machine', path: '/visualizer/enigma', icon: <Settings size={28}/>, desc: 'WWII rotor cipher', color: 'text-amber-400', border: 'hover:border-amber-400/50', shadow: 'hover:shadow-amber-400/20' },
      { name: 'Hacker Mode', path: '/visualizer/hacker', icon: <Crosshair size={28}/>, desc: 'Cryptanalysis tools', color: 'text-rose-400', border: 'hover:border-rose-400/50', shadow: 'hover:shadow-rose-400/20' },
      { name: 'Diffie-Hellman', path: '/visualizer/dh', icon: <GitMerge size={28}/>, desc: 'Key Exchange Protocol', color: 'text-emerald-400', border: 'hover:border-emerald-400/50', shadow: 'hover:shadow-emerald-400/20' }
    ]
  }
];

const variants = {
  enter: (direction) => ({
    y: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    y: direction < 0 ? 50 : -50,
    opacity: 0,
  })
};

const itemVariants = {
  hidden: { opacity: 0, x: 30, scale: 0.95 },
  show: i => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  })
};

export default function VisualizerDashboard() {
  const location = useLocation();
  const initialPage = location.state?.activeTab === 'crypto' ? 2 : (location.state?.activeTab === 'oop' ? 1 : 0);
  
  const [rotationIndex, setRotationIndex] = useState(initialPage);
  const [direction, setDirection] = useState(0);
  const [splashCategory, setSplashCategory] = useState(null);

  const page = ((rotationIndex % 3) + 3) % 3;
  const currentCategory = categories[page];

  const currentDialRotation = -rotationIndex * 35; // Dial rotates opposite to bring selected item to equator

  const handleCategoryChange = (clickedIndex, category) => {
    if (clickedIndex !== rotationIndex) {
      setDirection(clickedIndex > rotationIndex ? 1 : -1);
      setRotationIndex(clickedIndex);
      setSplashCategory(category);
      setTimeout(() => {
        setSplashCategory(null);
      }, 2500);
    }
  };

  const dialItems = [-2, -1, 0, 1, 2].map(offset => {
    const itemIndex = rotationIndex + offset;
    const catIndex = ((itemIndex % 3) + 3) % 3;
    return {
      index: itemIndex,
      category: categories[catIndex]
    };
  });

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 overflow-hidden bg-gray-50 dark:bg-[#09090b] flex">
      
      {/* Decorative Background Blob tied to current category */}
      <motion.div 
        key={page}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 1 }}
        className={`absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] pointer-events-none -z-10 bg-gradient-to-tr ${currentCategory.bgGlow}`}
        style={{ transform: 'translate(20%, -20%)' }}
      />

      {/* Radial Menu Dial */}
      <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-24 md:w-32 z-40 pointer-events-none flex items-center shadow-[10px_0_40px_rgba(0,0,0,0.05)] dark:shadow-[10px_0_40px_rgba(0,0,0,0.4)]">
        <motion.div
          className="absolute pointer-events-auto rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-3xl flex items-center justify-center shadow-[inset_-10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[inset_-10px_0_30px_rgba(255,255,255,0.02)]"
          style={{
            width: '600px',
            height: '600px',
            left: '-480px', // Leaves 120px exposed on the screen (dial edge)
            transformOrigin: 'center center'
          }}
          animate={{ rotate: currentDialRotation }}
          transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
        >
          {dialItems.map((item) => {
            const itemAngle = item.index * 35;
            const isSelected = item.index === rotationIndex;
            const absoluteRotation = currentDialRotation + itemAngle;
            
            return (
              <div
                key={item.index}
                className="absolute top-1/2 left-1/2 w-0 h-0"
                style={{
                  transform: `rotate(${itemAngle}deg)`,
                }}
              >
                <div 
                  className="absolute"
                  style={{ transform: 'translate(280px, -50%)' }} // Positioned near the right edge of the 300px radius
                >
                  <motion.button
                    onClick={() => handleCategoryChange(item.index, item.category)}
                    className={`flex flex-col items-center justify-center gap-1 group transition-colors px-4 py-2 ${isSelected ? '' : 'cursor-pointer'}`}
                    animate={{ 
                      rotate: -absoluteRotation, // Counter-rotate so it stays upright
                      scale: isSelected ? 1.2 : 0.9,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{
                      transformOrigin: 'center center'
                    }}
                  >
                    <div 
                      className={`p-3 rounded-full transition-all duration-300 ${isSelected ? 'bg-black/5 dark:bg-white/10 shadow-lg' : 'group-hover:bg-black/5 dark:group-hover:bg-white/5 opacity-60 group-hover:opacity-100'}`}
                      style={{ color: isSelected ? item.category.color : undefined }}
                    >
                      {item.category.dialIcon}
                    </div>
                    <span 
                      className={`font-bold tracking-wider text-xs uppercase transition-all duration-300 ${isSelected ? 'opacity-100 drop-shadow-md' : 'opacity-40 group-hover:opacity-80 text-gray-500'}`}
                      style={{ color: isSelected ? item.category.color : undefined }}
                    >
                      {item.category.shortTitle}
                    </span>
                  </motion.button>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[120px] md:ml-[160px] pl-2 md:pl-8 pr-4 md:pr-12 lg:pr-16 pt-8 pb-12 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10 flex justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {!splashCategory && (
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30, opacity: { duration: 0.2 } }}
              className="w-full max-w-screen-xl flex flex-col items-center pt-4 md:pt-12"
            >
              {/* Interactive Grid (Full Width) */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-start content-start">
                {currentCategory.items.map((item, i) => (
                  <Link key={item.name} to={item.path} className="block w-full">
                    <motion.div
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`glass-card p-5 h-full flex flex-col justify-between cursor-pointer transition-all duration-300 border-2 border-transparent ${item.border} ${item.shadow} hover:shadow-2xl group`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`p-2.5 bg-gray-50 dark:bg-black/50 rounded-lg shadow-inner border border-gray-100 dark:border-gray-800 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-end justify-between mt-2">
                        <p className="text-gray-500 text-sm font-medium">
                          {item.desc}
                        </p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                          <ArrowRight className={item.color} size={18} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Splash Screen */}
      <AnimatePresence>
        {splashCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/90 dark:bg-[#09090b]/90 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center gap-8">
              {splashIcons[splashCategory.id](splashCategory.color)}
              <TypewriterText text={splashCategory.title} color={splashCategory.color} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
