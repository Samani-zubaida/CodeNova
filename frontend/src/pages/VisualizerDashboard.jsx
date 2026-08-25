import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, BookOpen, Layers, Type, ListTree, Network, Hash, Shield, Lock, Cpu, Search, KeyRound, Crosshair, Settings } from 'lucide-react';

const categories = [
  {
    id: 'ds',
    title: 'Data Structures',
    description: 'Master memory allocation, pointers, and algorithmic efficiency with interactive visualizers.',
    color: 'var(--color-nova-red)',
    bgGlow: 'from-[var(--color-nova-red)] to-transparent',
    icon: <Database size={64} className="text-[var(--color-nova-red)] drop-shadow-2xl" />,
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
      { name: 'Hacker Mode', path: '/visualizer/hacker', icon: <Crosshair size={28}/>, desc: 'Cryptanalysis tools', color: 'text-rose-400', border: 'hover:border-rose-400/50', shadow: 'hover:shadow-rose-400/20' }
    ]
  },
  {
    id: 'oop',
    title: 'Object-Oriented',
    description: 'Visualize the four foundational pillars of Object-Oriented Programming architecture.',
    color: 'var(--color-nova-brown)',
    bgGlow: 'from-[var(--color-nova-brown)] to-transparent',
    icon: <Binary size={64} className="text-[var(--color-nova-brown)] drop-shadow-2xl" />,
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
      { name: 'Hacker Mode', path: '/visualizer/hacker', icon: <Crosshair size={28}/>, desc: 'Cryptanalysis tools', color: 'text-rose-400', border: 'hover:border-rose-400/50', shadow: 'hover:shadow-rose-400/20' }
    ]
  },
  {
    id: 'crypto',
    title: 'Cryptography',
    description: 'Interactive ciphers demonstrating historic data transformations and encryption.',
    color: 'var(--color-nova-green)',
    bgGlow: 'from-[var(--color-nova-green)] to-transparent',
    icon: <KeyRound size={64} className="text-[var(--color-nova-green)] drop-shadow-2xl" />,
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
      { name: 'Hacker Mode', path: '/visualizer/hacker', icon: <Crosshair size={28}/>, desc: 'Cryptanalysis tools', color: 'text-rose-400', border: 'hover:border-rose-400/50', shadow: 'hover:shadow-rose-400/20' }
    ]
  }
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95
  })
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: i => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  })
};

export default function VisualizerDashboard() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection) => {
    let newPage = page + newDirection;
    if (newPage < 0) newPage = 0;
    if (newPage >= categories.length) newPage = categories.length - 1;
    
    if (newPage !== page) {
      setDirection(newDirection);
      setPage(newPage);
    }
  };

  const currentCategory = categories[page];

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 overflow-hidden bg-gray-50 dark:bg-[#09090b] flex flex-col items-center justify-center">
      
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset }) => {
            // Simplify drag logic: if dragged more than 100px, trigger page change
            if (offset.x < -100) {
              paginate(1);
            } else if (offset.x > 100) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full flex flex-col px-4 sm:px-8 md:px-12 lg:px-16 pt-8 pb-48 overflow-y-auto overflow-x-hidden scrollbar-hide"
        >
          {/* Decorative Background Blob */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`absolute top-0 right-0 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] md:blur-[120px] opacity-30 dark:opacity-40 pointer-events-none -z-10 bg-gradient-to-tr ${currentCategory.bgGlow}`}
            style={{ transform: 'translate(20%, -20%)' }}
          />

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 w-full max-w-screen-xl mx-auto h-full pt-8">
            
            {/* Category Header Area */}
            <div className="lg:w-1/3 flex flex-col gap-4 text-center lg:text-left mt-8 lg:mt-16 xl:mt-24">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center lg:justify-start"
              >
                {currentCategory.icon}
              </motion.div>
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-tight"
                style={{ color: currentCategory.color }}
              >
                {currentCategory.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto lg:mx-0">
                {currentCategory.description}
              </p>
            </div>

            {/* Interactive Grid of Items */}
            <div className="lg:w-2/3 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-0 items-start content-start">
              {currentCategory.items.map((item, i) => (
                <Link key={item.name} to={item.path} className="block w-full">
                  <motion.div
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    whileHover={{ scale: 1.03, y: -6 }}
                    whileTap={{ scale: 0.96 }}
                    className={`glass-panel p-5 h-full flex flex-col justify-between cursor-pointer transition-all duration-300 border-2 border-transparent ${item.border} ${item.shadow} hover:shadow-2xl group bg-white/60 dark:bg-black/60`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`p-2.5 bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 ${item.color} group-hover:scale-110 transition-transform`}>
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

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls Overlay */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 flex justify-start items-center gap-4 md:gap-8 z-50 pointer-events-none">
        
        <button 
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className={`pointer-events-auto p-2 md:p-3 rounded-full glass-card transition-all hover:scale-110 ${page === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white dark:hover:bg-gray-800 shadow-xl'}`}
        >
          <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex gap-2 md:gap-4 pointer-events-auto bg-black/5 dark:bg-white/10 px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-md border border-gray-200 dark:border-white/20 shadow-sm">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > page ? 1 : -1);
                setPage(idx);
              }}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                page === idx 
                  ? 'scale-150' 
                  : 'bg-gray-400 dark:bg-gray-500 hover:bg-gray-500 dark:hover:bg-gray-400'
              }`}
              style={{ backgroundColor: page === idx ? cat.color : undefined }}
            />
          ))}
        </div>

        <button 
          onClick={() => paginate(1)}
          disabled={page === categories.length - 1}
          className={`pointer-events-auto p-2 md:p-3 rounded-full glass-card transition-all hover:scale-110 ${page === categories.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white dark:hover:bg-gray-800 shadow-xl'}`}
        >
          <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

    </div>
  );
}
