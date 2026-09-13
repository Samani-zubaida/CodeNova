import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Lock, Unlock, Key, Hash, Shield, Columns, Network, 
  ChevronDown, ChevronUp, Crosshair, Settings, Grid3X3, KeyRound, 
  EyeOff, Fingerprint, Search, LayoutGrid, MonitorPlay, Sparkles,
  Menu, X, ExternalLink, HelpCircle, Layers, ShieldCheck, CheckCircle
} from 'lucide-react';

// Dynamic Code-Splitting: Lazy load all 13 Crypto Algorithm Visualizers
const CaesarCipherVisualizer = lazy(() => import('./CaesarCipherVisualizer'));
const VigenereCipherVisualizer = lazy(() => import('./VigenereCipherVisualizer'));
const PlayfairCipherVisualizer = lazy(() => import('./PlayfairCipherVisualizer'));
const RailFenceVisualizer = lazy(() => import('./RailFenceVisualizer'));
const ColumnarVisualizer = lazy(() => import('./ColumnarVisualizer'));
const AESVisualizer = lazy(() => import('./AESVisualizer'));
const RSAVIsualizer = lazy(() => import('./RSAVIsualizer'));
const DHVisualizer = lazy(() => import('./DHVisualizer'));
const DigitalSignatureVisualizer = lazy(() => import('./DigitalSignatureVisualizer'));
const SHA256Visualizer = lazy(() => import('./SHA256Visualizer'));
const SteganographyVisualizer = lazy(() => import('./SteganographyVisualizer'));
const EnigmaVisualizer = lazy(() => import('./EnigmaVisualizer'));
const HackerModeVisualizer = lazy(() => import('./HackerModeVisualizer'));

// Sleek Warm Loading Skeleton for Dynamic Chunks
const CryptoLoadingFallback = () => (
  <div className="w-full h-96 flex flex-col items-center justify-center gap-4 text-[#8C7A70] dark:text-[#BCA297]">
    <div className="w-14 h-14 rounded-2xl bg-[#AB526B]/15 dark:bg-[#AB526B]/30 flex items-center justify-center text-[#AB526B] dark:text-[#F0E2A4] shadow-md border border-[#AB526B]/30 animate-pulse">
      <Shield size={28} className="animate-spin" style={{ animationDuration: '4s' }} />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm font-mono font-bold tracking-wider text-[#2D1F23] dark:text-[#F4EBC3]">
        Loading Cryptographic Engine...
      </span>
      <span className="text-xs text-[#8C7A70] dark:text-[#BCA297]">
        Compiling isolated mathematical visualizer chunk
      </span>
    </div>
  </div>
);

export const CRYPTO_CATEGORIES = [
  {
    id: 'substitution',
    title: 'Substitution Ciphers',
    desc: 'Systematically substitute plaintext characters with other characters or symbols.',
    color: '#AB526B',
    items: [
      { 
        id: 'caesar', 
        name: 'Caesar Cipher', 
        tag: 'Shift Cipher', 
        complexity: 'O(N)',
        icon: Lock, 
        supportsMode: true,
        desc: 'Shift each letter by a fixed key number k mod 26. Used by Julius Caesar for battlefield dispatches.' 
      },
      { 
        id: 'vigenere', 
        name: 'Vigenère Cipher', 
        tag: 'Polyalphabetic', 
        complexity: 'O(N)',
        icon: Key, 
        supportsMode: true,
        desc: 'Uses a repeating keyword and the Tabula Recta to defeat simple single-alphabet frequency analysis.' 
      },
      { 
        id: 'playfair', 
        name: 'Playfair Cipher', 
        tag: 'Digraph Cipher', 
        complexity: 'O(N)',
        icon: Grid3X3, 
        supportsMode: true,
        desc: 'First practical digraph cipher using a 5x5 key matrix to encrypt pairs of letters with geometric rules.' 
      }
    ]
  },
  {
    id: 'transposition',
    title: 'Transposition Ciphers',
    desc: 'Preserve character identity but scramble letter positions according to a systematic pattern.',
    color: '#C5CEAE',
    items: [
      { 
        id: 'railfence', 
        name: 'Rail Fence Cipher', 
        tag: 'Zigzag Transposition', 
        complexity: 'O(N)',
        icon: Network, 
        supportsMode: true,
        desc: 'Writes plaintext in a zigzag pattern across multiple rails, then reads off the ciphertext horizontally.' 
      },
      { 
        id: 'columnar', 
        name: 'Columnar Transposition', 
        tag: 'Keyed Matrix', 
        complexity: 'O(N log K)',
        icon: Columns, 
        supportsMode: true,
        desc: 'Fills a grid row-by-row and reorders columns alphabetically by an encryption keyword.' 
      }
    ]
  },
  {
    id: 'modern',
    title: 'Modern Cryptography',
    desc: 'Industry-standard cryptographic primitives securing the modern internet, TLS/SSL, and blockchain.',
    color: '#F0E2A4',
    items: [
      { 
        id: 'aes', 
        name: 'AES-256 (Rijndael)', 
        tag: 'Symmetric Block', 
        complexity: 'O(Rounds * 128b)',
        icon: Shield, 
        supportsMode: true,
        desc: 'Advanced Encryption Standard using 10/12/14 rounds of SubBytes, ShiftRows, MixColumns, and AddRoundKey.' 
      },
      { 
        id: 'rsa', 
        name: 'RSA Cryptosystem', 
        tag: 'Asymmetric KeyGen', 
        complexity: 'O(K^3)',
        icon: Unlock, 
        supportsMode: false,
        desc: 'Public-key cryptosystem based on the practical difficulty of factoring large prime products n = p * q.' 
      }
    ]
  },
  {
    id: 'keyexchange',
    title: 'Key Exchange & Authentication',
    desc: 'Protocols for establishing shared secrets over public channels and proving message authenticity.',
    color: '#BCA297',
    items: [
      { 
        id: 'dh', 
        name: 'Diffie-Hellman Key Exchange', 
        tag: 'Discrete Logarithm', 
        complexity: 'O(log P)',
        icon: KeyRound, 
        supportsMode: false,
        desc: 'Allows Alice and Bob to securely compute a shared secret key over an eavesdropped public network.' 
      },
      { 
        id: 'signature', 
        name: 'Digital Signatures', 
        tag: 'Integrity & Auth', 
        complexity: 'O(Sign + Verify)',
        icon: Fingerprint, 
        supportsMode: false,
        desc: 'Provides authenticity and tamper detection using asymmetric private signing and public verification.' 
      },
      { 
        id: 'hash', 
        name: 'SHA-256 Hash Function', 
        tag: 'One-Way Digest', 
        complexity: 'O(Blocks * 64)',
        icon: Hash, 
        supportsMode: false,
        desc: 'Produces an irreversible 256-bit hash. Demonstrates the avalanche effect where 1 bit alters 50% of the digest.' 
      }
    ]
  },
  {
    id: 'historical',
    title: 'Historical & Cryptanalysis',
    desc: 'Historic wartime machinery, covert steganography, and frequency analysis cryptanalysis tools.',
    color: '#AB526B',
    items: [
      { 
        id: 'enigma', 
        name: 'Enigma Machine (WWII)', 
        tag: 'Rotor Cipher', 
        complexity: 'Electro-mechanical',
        icon: Settings, 
        supportsMode: false,
        desc: 'Interactive simulation of the WWII 3-rotor Enigma with plugboard, stepping pawls, and reflector.' 
      },
      { 
        id: 'steg', 
        name: 'Image Steganography', 
        tag: 'LSB Bit Manipulation', 
        complexity: 'O(Pixels)',
        icon: EyeOff, 
        supportsMode: true,
        desc: 'Hides secret data inside the Least Significant Bit (LSB) of pixel RGB channels without visible distortion.' 
      },
      { 
        id: 'hacker', 
        name: 'Hacker Mode (Frequency)', 
        tag: 'Cryptanalysis Attack', 
        complexity: 'Frequency Attack',
        icon: Crosshair, 
        supportsMode: false,
        desc: 'Interactive cryptanalysis challenge: crack Caesar ciphertexts by matching English letter distributions!' 
      }
    ]
  }
];

export default function CryptoHub({ defaultAlgo }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine initial algorithm from prop, URL query (?algo=...), or location state
  const queryAlgo = searchParams.get('algo');
  const initialAlgo = defaultAlgo || queryAlgo || location.state?.algo || 'caesar';

  // Find initial category for initial algorithm
  const initialCat = useMemo(() => {
    for (const cat of CRYPTO_CATEGORIES) {
      if (cat.items.some(i => i.id === initialAlgo)) return cat.id;
    }
    return 'substitution';
  }, [initialAlgo]);

  const [activeAlgo, setActiveAlgo] = useState(initialAlgo);
  const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'
  const [viewMode, setViewMode] = useState('studio'); // 'studio' (visualizer) or 'catalog' (cards overview)
  const [openCategories, setOpenCategories] = useState([initialCat]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync state if prop, URL query param or navigation state changes
  useEffect(() => {
    const target = defaultAlgo || searchParams.get('algo') || location.state?.algo;
    if (target && target !== activeAlgo) {
      setActiveAlgo(target);
      setViewMode('studio');
      const foundCat = CRYPTO_CATEGORIES.find(c => c.items.some(i => i.id === target))?.id;
      if (foundCat && !openCategories.includes(foundCat)) {
        setOpenCategories(prev => [...prev, foundCat]);
      }
    }
  }, [defaultAlgo, searchParams, location.state]);

  // Handle switching algorithm
  const handleSelectAlgo = (algoId) => {
    setActiveAlgo(algoId);
    setViewMode('studio');
    setSearchParams({ algo: algoId });
    // Expand category if needed
    const foundCat = CRYPTO_CATEGORIES.find(c => c.items.some(i => i.id === algoId))?.id;
    if (foundCat && !openCategories.includes(foundCat)) {
      setOpenCategories(prev => [...prev, foundCat]);
    }
  };

  const toggleCategory = (catId) => {
    setOpenCategories(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  // Find active algo metadata
  const activeDetails = useMemo(() => {
    for (const cat of CRYPTO_CATEGORIES) {
      const item = cat.items.find(i => i.id === activeAlgo);
      if (item) return { ...item, categoryTitle: cat.title, categoryColor: cat.color };
    }
    return CRYPTO_CATEGORIES[0].items[0];
  }, [activeAlgo]);

  // Filtered categories for sidebar search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CRYPTO_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return CRYPTO_CATEGORIES.map(cat => ({
      ...cat,
      items: cat.items.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.tag.toLowerCase().includes(q) || 
        i.desc.toLowerCase().includes(q)
      )
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  // Dynamic component renderer with Suspense lazy loading
  const renderVisualizer = () => {
    return (
      <Suspense fallback={<CryptoLoadingFallback />}>
        {(() => {
          switch (activeAlgo) {
            case 'caesar': 
              return <CaesarCipherVisualizer mode={mode} />;
            case 'vigenere': 
              return <VigenereCipherVisualizer mode={mode} />;
            case 'playfair': 
              return <PlayfairCipherVisualizer mode={mode} />;
            case 'railfence': 
              return <RailFenceVisualizer mode={mode} />;
            case 'columnar': 
              return <ColumnarVisualizer mode={mode} />;
            case 'aes': 
              return <AESVisualizer mode={mode} />;
            case 'rsa': 
              return <RSAVIsualizer />;
            case 'dh': 
              return <DHVisualizer />;
            case 'signature': 
              return <DigitalSignatureVisualizer mode={mode} />;
            case 'hash': 
              return <SHA256Visualizer />;
            case 'steg': 
              return <SteganographyVisualizer mode={mode} />;
            case 'enigma': 
              return <EnigmaVisualizer />;
            case 'hacker': 
              return <HackerModeVisualizer />;
            default: 
              return <CaesarCipherVisualizer mode={mode} />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] dark:bg-[#331921] text-[#2D1F23] dark:text-[#F4EBC3] flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Header & Command Bar */}
      <header className="h-16 px-4 md:px-8 border-b border-[#BCA297]/30 dark:border-[#5C4E49] bg-white/85 dark:bg-[#423834]/90 backdrop-blur-md flex items-center justify-between z-30 sticky top-0 shadow-sm">
        
        {/* Left: Back Link & Suite Identity */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link 
            to="/visualizer" 
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#8C7A70] dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-[#F0E2A4] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[#BCA297]/15 dark:hover:bg-white/5"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Visualizers</span>
          </Link>
          
          <div className="h-4 w-px bg-[#BCA297]/30 dark:bg-[#5C4E49]" />

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-[#BCA297]/15 dark:hover:bg-white/5 text-[#8C7A70] dark:text-[#BCA297] hover:text-[#AB526B] transition-colors md:hidden"
            title="Toggle Algorithms Sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#AB526B]/15 dark:bg-[#AB526B]/30 flex items-center justify-center text-[#AB526B] dark:text-[#F0E2A4]">
              <Shield size={18} />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-[#2D1F23] dark:text-[#F4EBC3] leading-none flex items-center gap-2">
                Cryptography Studio
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#C5CEAE]/30 dark:bg-[#C5CEAE]/20 text-[#607345] dark:text-[#C5CEAE] font-bold border border-[#C5CEAE]/40">
                  13 Algorithms
                </span>
              </h1>
              <p className="text-[11px] text-[#8C7A70] dark:text-[#BCA297] hidden sm:block">
                {activeDetails.categoryTitle} &bull; {activeDetails.name}
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right: Mode Toggle & View Switcher */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Encrypt / Decrypt Toggle (For Ciphers supporting it) */}
          {activeDetails.supportsMode && viewMode === 'studio' && (
            <div className="flex items-center bg-[#FAF7F2] dark:bg-[#331921] p-1 rounded-xl border border-[#BCA297]/30 dark:border-[#5C4E49] shadow-inner">
              <button
                onClick={() => setMode('encrypt')}
                className={`relative px-3 md:px-4 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  mode === 'encrypt'
                    ? 'text-white shadow-sm'
                    : 'text-[#8C7A70] dark:text-[#BCA297] hover:text-[#2D1F23] dark:hover:text-[#F4EBC3]'
                }`}
              >
                {mode === 'encrypt' && (
                  <motion.div 
                    layoutId="cryptoModePill" 
                    className="absolute inset-0 bg-[#AB526B] rounded-lg -z-10 shadow-sm" 
                  />
                )}
                <Lock size={12} />
                <span>ENCRYPT</span>
              </button>
              <button
                onClick={() => setMode('decrypt')}
                className={`relative px-3 md:px-4 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  mode === 'decrypt'
                    ? 'text-white shadow-sm'
                    : 'text-[#8C7A70] dark:text-[#BCA297] hover:text-[#2D1F23] dark:hover:text-[#F4EBC3]'
                }`}
              >
                {mode === 'decrypt' && (
                  <motion.div 
                    layoutId="cryptoModePill" 
                    className="absolute inset-0 bg-[#AB526B] rounded-lg -z-10 shadow-sm" 
                  />
                )}
                <Unlock size={12} />
                <span>DECRYPT</span>
              </button>
            </div>
          )}

          {/* Special Algorithm Badges */}
          {!activeDetails.supportsMode && viewMode === 'studio' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/30 dark:border-[#5C4E49] text-[11px] font-semibold text-[#8C7A70] dark:text-[#BCA297]">
              <Sparkles size={12} className="text-[#AB526B] dark:text-[#F0E2A4]" />
              <span>{activeDetails.tag}</span>
            </div>
          )}

          {/* View Mode Toggle: Interactive Studio vs Catalog Grid */}
          <div className="flex items-center bg-[#FAF7F2] dark:bg-[#331921] p-1 rounded-xl border border-[#BCA297]/30 dark:border-[#5C4E49]">
            <button
              onClick={() => setViewMode('studio')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'studio'
                  ? 'bg-white dark:bg-[#423834] text-[#AB526B] dark:text-[#F0E2A4] shadow-sm font-bold'
                  : 'text-[#8C7A70] dark:text-[#BCA297] hover:text-[#2D1F23] dark:hover:text-[#F4EBC3]'
              }`}
              title="Studio Workspace Canvas"
            >
              <MonitorPlay size={14} />
              <span className="hidden sm:inline">Studio</span>
            </button>
            <button
              onClick={() => setViewMode('catalog')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'catalog'
                  ? 'bg-white dark:bg-[#423834] text-[#AB526B] dark:text-[#F0E2A4] shadow-sm font-bold'
                  : 'text-[#8C7A70] dark:text-[#BCA297] hover:text-[#2D1F23] dark:hover:text-[#F4EBC3]'
              }`}
              title="All Algorithms Catalog"
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Catalog</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Sidebar Navigation */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 768) && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-72 sm:w-80 flex-shrink-0 border-r border-[#BCA297]/30 dark:border-[#5C4E49] bg-white/95 dark:bg-[#423834]/95 flex flex-col z-20 shadow-lg md:shadow-none overflow-hidden"
            >
              {/* Sidebar Search Input */}
              <div className="p-3 border-b border-[#BCA297]/20 dark:border-[#5C4E49]/60">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A70] dark:text-[#BCA297]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter 13 ciphers & hashes..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/30 dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3] placeholder-[#8C7A70] dark:placeholder-[#BCA297]/60 focus:outline-none focus:border-[#AB526B] dark:focus:border-[#F0E2A4] transition-colors"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#AB526B]"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Sidebar Categories & Algorithm Accordions */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {filteredCategories.map((category) => {
                  const isOpen = openCategories.includes(category.id);

                  return (
                    <div 
                      key={category.id} 
                      className="rounded-xl border border-[#BCA297]/20 dark:border-[#5C4E49]/60 bg-[#FAF7F2]/60 dark:bg-[#331921]/40 overflow-hidden"
                    >
                      {/* Category Header Accordion Button */}
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-[#BCA297]/15 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: category.color }} 
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#2D1F23] dark:text-[#F4EBC3]">
                            {category.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#BCA297]/20 dark:bg-white/10 text-[#8C7A70] dark:text-[#BCA297] font-mono">
                            {category.items.length}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp size={14} className="text-[#8C7A70] dark:text-[#BCA297]" />
                        ) : (
                          <ChevronDown size={14} className="text-[#8C7A70] dark:text-[#BCA297]" />
                        )}
                      </button>

                      {/* Items inside Category */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden px-2 pb-2 space-y-1"
                          >
                            {category.items.map((item) => {
                              const Icon = item.icon;
                              const isActive = activeAlgo === item.id;

                              return (
                                <button
                                  key={item.id}
                                  onClick={() => handleSelectAlgo(item.id)}
                                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-all relative ${
                                    isActive
                                      ? 'bg-white dark:bg-[#423834] text-[#AB526B] dark:text-[#F0E2A4] font-bold shadow-sm border border-[#AB526B]/30 dark:border-[#F0E2A4]/30'
                                      : 'text-[#8C7A70] dark:text-[#BCA297] hover:text-[#2D1F23] dark:hover:text-[#F4EBC3] hover:bg-white/60 dark:hover:bg-[#423834]/60'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <Icon size={14} className={isActive ? 'text-[#AB526B] dark:text-[#F0E2A4]' : 'text-[#8C7A70] dark:text-[#BCA297]'} />
                                    <span className="truncate">{item.name}</span>
                                  </div>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-[#BCA297]/15 dark:bg-black/20 text-[#8C7A70] dark:text-[#BCA297] flex-shrink-0 ml-1">
                                    {item.tag}
                                  </span>
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

              {/* Sidebar Footer */}
              <div className="p-3 border-t border-[#BCA297]/20 dark:border-[#5C4E49]/60 bg-[#FAF7F2]/40 dark:bg-[#331921]/30 flex items-center justify-between text-[11px] text-[#8C7A70] dark:text-[#BCA297]">
                <span>Algoverse Cryptosuite</span>
                <span className="font-mono font-bold text-[#AB526B] dark:text-[#F0E2A4]">13 Modules</span>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-[#FAF7F2] dark:bg-[#331921]">
          
          {viewMode === 'studio' ? (
            /* ============================================================
               VIEW MODE 1: INTERACTIVE STUDIO CANVAS (ALGORITHM VISUALIZER)
               ============================================================ */
            <div className="flex-1 p-4 md:p-8 flex flex-col">
              
              {/* Algorithm Banner / Quick Switch Bar */}
              <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-[#423834] border border-[#BCA297]/30 dark:border-[#5C4E49] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#AB526B]/15 dark:bg-[#AB526B]/30 flex items-center justify-center text-[#AB526B] dark:text-[#F0E2A4] flex-shrink-0">
                    <activeDetails.icon size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg md:text-xl font-bold text-[#2D1F23] dark:text-[#F4EBC3]">
                        {activeDetails.name}
                      </h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#BCA297]/20 dark:bg-white/10 text-[#8C7A70] dark:text-[#BCA297] border border-[#BCA297]/30 dark:border-[#5C4E49]">
                        {activeDetails.complexity}
                      </span>
                    </div>
                    <p className="text-xs text-[#8C7A70] dark:text-[#BCA297] mt-0.5 max-w-2xl">
                      {activeDetails.desc}
                    </p>
                  </div>
                </div>

                {/* Quick Switch Dropdown for Mobile / Shortcuts */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setViewMode('catalog')}
                    className="px-3 py-1.5 rounded-xl border border-[#BCA297]/30 dark:border-[#5C4E49] text-xs font-semibold text-[#8C7A70] dark:text-[#BCA297] hover:text-[#AB526B] hover:bg-[#BCA297]/10 transition-colors flex items-center gap-1.5"
                  >
                    <LayoutGrid size={13} />
                    <span>Browse All 13</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Algorithm Visualizer Container */}
              <div className="flex-1 rounded-2xl bg-white/70 dark:bg-[#423834]/50 border border-[#BCA297]/25 dark:border-[#5C4E49]/60 shadow-sm p-4 sm:p-6 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeAlgo}-${mode}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="w-full h-full flex flex-col"
                  >
                    {renderVisualizer()}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          ) : (
            /* ============================================================
               VIEW MODE 2: ALGORITHM CATALOG (ALL 13 CARDS GALLERY)
               ============================================================ */
            <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
              <div className="mb-8 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-extrabold text-[#2D1F23] dark:text-[#F4EBC3] mb-2">
                  Algoverse Cryptography Suite
                </h2>
                <p className="text-sm text-[#8C7A70] dark:text-[#BCA297]">
                  Explore and interact with classical ciphers, modern symmetric & asymmetric standards, key exchange protocols, and cryptanalytic challenges.
                </p>
              </div>

              {/* Categories Grid */}
              <div className="space-y-10">
                {CRYPTO_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-[#BCA297]/20 dark:border-[#5C4E49]/50 pb-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <h3 className="text-lg font-bold text-[#2D1F23] dark:text-[#F4EBC3]">
                        {cat.title}
                      </h3>
                      <span className="text-xs text-[#8C7A70] dark:text-[#BCA297]">
                        &bull; {cat.desc}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = activeAlgo === item.id;

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectAlgo(item.id)}
                            className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                              isCurrent
                                ? 'bg-white dark:bg-[#423834] border-[#AB526B] dark:border-[#F0E2A4] shadow-md'
                                : 'bg-white/80 dark:bg-[#423834]/70 border-[#BCA297]/30 dark:border-[#5C4E49] hover:border-[#AB526B]/50 hover:shadow-md'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[#AB526B]/15 dark:bg-[#AB526B]/30 text-[#AB526B] dark:text-[#F0E2A4] flex items-center justify-center group-hover:scale-105 transition-transform">
                                  <Icon size={20} />
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#BCA297]/20 dark:bg-white/10 text-[#8C7A70] dark:text-[#BCA297]">
                                  {item.tag}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-[#2D1F23] dark:text-[#F4EBC3] mb-1 group-hover:text-[#AB526B] dark:group-hover:text-[#F0E2A4] transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-xs text-[#8C7A70] dark:text-[#BCA297] leading-relaxed">
                                {item.desc}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#BCA297]/20 dark:border-[#5C4E49]/50 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-[#8C7A70] dark:text-[#BCA297]">
                                {item.complexity}
                              </span>
                              <span className="text-xs font-bold text-[#AB526B] dark:text-[#F0E2A4] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Open Studio &rarr;
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}