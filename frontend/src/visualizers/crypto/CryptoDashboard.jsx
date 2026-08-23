import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock, Hash, Key, Shield, Columns, Network, ChevronDown, ChevronUp, Crosshair, Settings, Grid3X3, KeyRound } from 'lucide-react';

import CaesarVisualizer from './components/CaesarVisualizer';
import VigenereVisualizer from './components/VigenereVisualizer';
import RailFenceVisualizer from './components/RailFenceVisualizer';
import ColumnarVisualizer from './components/ColumnarVisualizer';
import RSAVisualizer from './components/RSAVisualizer';
import HashVisualizer from './components/HashVisualizer';
import DHVisualizer from './components/DHVisualizer';
import DigitalSignatureVisualizer from './components/DigitalSignatureVisualizer';
import SteganographyVisualizer from './components/SteganographyVisualizer';
import HackerModeVisualizer from './components/HackerModeVisualizer';
import EnigmaVisualizer from './components/EnigmaVisualizer';
import RSAKeyGenVisualizer from './components/RSAKeyGenVisualizer';
import PlayfairVisualizer from './components/PlayfairVisualizer';
import { EyeOff, Fingerprint } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'substitution',
    title: 'Substitution Ciphers',
    items: [
      { id: 'caesar', name: 'Caesar Cipher', icon: Lock },
      { id: 'vigenere', name: 'Vigenère Cipher', icon: Key }
    ]
  },
  {
    id: 'transposition',
    title: 'Transposition Ciphers',
    items: [
      { id: 'railfence', name: 'Rail Fence', icon: Network },
      { id: 'columnar', name: 'Columnar', icon: Columns }
    ]
  },
  {
    id: 'modern',
    title: 'Modern Cryptography',
    items: [
      { id: 'aes', name: 'AES-256', icon: Shield },
      { id: 'rsa', name: 'RSA', icon: Unlock },
      { id: 'rsagen', name: 'RSA Key Gen', icon: KeyRound }
    ]
  },
  {
    id: 'keyexchange',
    title: 'Key Exchange',
    items: [
      { id: 'dh', name: 'Diffie-Hellman', icon: Key }
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication',
    items: [
      { id: 'signature', name: 'Digital Signatures', icon: Fingerprint }
    ]
  },
  {
    id: 'obfuscation',
    title: 'Obfuscation',
    items: [
      { id: 'steg', name: 'Steganography', icon: EyeOff }
    ]
  },
  {
    id: 'oneway',
    title: 'One-Way Functions',
    items: [
      { id: 'hash', name: 'SHA-256', icon: Hash }
    ]
  },
  {
    id: 'historical',
    title: 'Historical Ciphers',
    items: [
      { id: 'enigma', name: 'Enigma Machine', icon: Settings },
      { id: 'playfair', name: 'Playfair Cipher', icon: Grid3X3 }
    ]
  },
  {
    id: 'cryptanalysis',
    title: 'Cryptanalysis',
    items: [
      { id: 'hacker', name: 'Hacker Mode', icon: Crosshair }
    ]
  }
];

export default function CryptoDashboard() {
  const location = useLocation();
  
  // Initialize state based on router location state if available
  const initialAlgo = location.state?.algo || 'caesar';
  const initialCategory = CATEGORIES.find(c => c.items.some(i => i.id === initialAlgo))?.id || 'substitution';

  const [activeAlgo, setActiveAlgo] = useState(initialAlgo);
  const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'
  const [openCategories, setOpenCategories] = useState([initialCategory]); 

  // If the user clicks a different link from the main dashboard while already on this component
  useEffect(() => {
    if (location.state?.algo) {
      setActiveAlgo(location.state.algo);
      const cat = CATEGORIES.find(c => c.items.some(i => i.id === location.state.algo))?.id;
      if (cat && !openCategories.includes(cat)) {
        setOpenCategories(prev => [...prev, cat]);
      }
    }
  }, [location.state]);

  const toggleCategory = (categoryId) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter(id => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
    }
  };

  const renderVisualizer = () => {
    switch (activeAlgo) {
      case 'caesar': return <CaesarVisualizer mode={mode} />;
      case 'vigenere': return <VigenereVisualizer mode={mode} />;
      case 'railfence': return <RailFenceVisualizer mode={mode} />;
      case 'columnar': return <ColumnarVisualizer mode={mode} />;
      case 'aes': return <AESVisualizer mode={mode} />;
      case 'rsa': return <RSAVisualizer mode={mode} />;
      case 'rsagen': return <RSAKeyGenVisualizer />;
      case 'dh': return <DHVisualizer />;
      case 'signature': return <DigitalSignatureVisualizer mode={mode} />;
      case 'steg': return <SteganographyVisualizer mode={mode} />;
      case 'hash': return <HashVisualizer />;
      case 'enigma': return <EnigmaVisualizer />;
      case 'playfair': return <PlayfairVisualizer mode={mode} />;
      case 'hacker': return <HackerModeVisualizer />;
      default: return null;
    }
  };

  const isHashing = activeAlgo === 'hash' || activeAlgo === 'rsagen' || activeAlgo === 'hacker';
  const isKeyExchange = activeAlgo === 'dh' || activeAlgo === 'enigma';

  // Find the active algorithm details for the top bar
  let activeAlgoDetails = null;
  CATEGORIES.forEach(cat => {
    const found = cat.items.find(item => item.id === activeAlgo);
    if (found) activeAlgoDetails = { ...found, categoryTitle: cat.title };
  });

  return (
    <div className="w-full min-h-screen bg-[#050505] flex text-white overflow-hidden font-mono selection:bg-nova-green/30">
      
      {/* Sidebar Navigation */}
      <div className="w-72 border-r border-white/5 bg-[#0a0a0a] flex flex-col z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-6 border-b border-white/5">
          <Link to="/visualizer" className="text-gray-500 hover:text-[var(--color-nova-red)] transition-colors flex items-center gap-2 font-semibold mb-6">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h1 className="text-xl font-bold tracking-widest text-[var(--color-nova-green)] uppercase">
            Crypto <span className="text-white/50">Lab</span>
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {CATEGORIES.map((category) => {
            const isOpen = openCategories.includes(category.id);
            return (
              <div key={category.id} className="flex flex-col gap-1">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300">
                    {category.title}
                  </span>
                  {isOpen ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                </button>

                {/* Category Items (Accordion) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-1"
                    >
                      {category.items.map((algo) => {
                        const Icon = algo.icon;
                        const isActive = activeAlgo === algo.id;
                        return (
                          <button
                            key={algo.id}
                            onClick={() => setActiveAlgo(algo.id)}
                            className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                              isActive 
                                ? 'bg-white/10 shadow-lg' 
                                : 'hover:bg-white/5 opacity-60 hover:opacity-100'
                            }`}
                          >
                            {isActive && (
                              <motion.div 
                                layoutId="activeIndicator"
                                className="absolute inset-0 border border-[var(--color-nova-green)] rounded-xl"
                              />
                            )}
                            <Icon size={16} className={isActive ? 'text-[var(--color-nova-green)]' : 'text-gray-400'} />
                            <span className="font-semibold text-sm">{algo.name}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-screen overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-nova-green)] opacity-[0.02] rounded-full blur-[100px] pointer-events-none" />

        {/* Topbar (Mode Toggle) */}
        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 z-20 bg-[#0a0a0a]/50 backdrop-blur-md">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold tracking-widest text-white/90">
              {activeAlgoDetails?.name}
            </h2>
            <p className="text-xs text-gray-500">{activeAlgoDetails?.categoryTitle}</p>
          </div>

          {!isHashing && !isKeyExchange && (
            <div className="flex items-center bg-black rounded-full p-1 border border-white/10 shadow-inner">
              <button
                onClick={() => setMode('encrypt')}
                className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-colors z-10 ${
                  mode === 'encrypt' ? 'text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode === 'encrypt' && (
                  <motion.div layoutId="modeToggleBg" className="absolute inset-0 bg-[var(--color-nova-green)] rounded-full -z-10 shadow-[0_0_15px_rgba(197,206,174,0.5)]" />
                )}
                ENCRYPT
              </button>
              <button
                onClick={() => setMode('decrypt')}
                className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-colors z-10 ${
                  mode === 'decrypt' ? 'text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode === 'decrypt' && (
                  <motion.div layoutId="modeToggleBg" className="absolute inset-0 bg-[var(--color-nova-red)] rounded-full -z-10 shadow-[0_0_15px_rgba(171,82,107,0.5)]" />
                )}
                DECRYPT
              </button>
            </div>
          )}
          {isKeyExchange && (
            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-[var(--color-nova-brown)] uppercase tracking-widest">
              Key Exchange Protocol
            </div>
          )}
          {isHashing && (
            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-[var(--color-nova-brown)] uppercase tracking-widest">
              One-Way Function
            </div>
          )}
        </div>

        {/* Visualization Canvas */}
        <div className="flex-1 relative overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeAlgo}-${mode}`}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full"
            >
              {renderVisualizer()}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
