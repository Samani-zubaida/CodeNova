import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import { config } from './phaser/GameConfig';
import { EventBus } from './phaser/EventBus';
import QuizModal from './QuizModal';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Coins, HardHat } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function GameWorld() {
  const navigate = useNavigate();
  const gameRef = useRef(null);
  
  // React State for UI
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [coins, setCoins] = useState(37200);

  useEffect(() => {
    // 1. Mount Phaser Game exactly once
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    // 2. Setup Event Bus listeners for communication FROM Phaser
    const handleQuizTrigger = (quizData) => {
      // Phaser tells React to show the quiz
      setActiveQuiz(quizData);
    };

    EventBus.on('quiz:trigger', handleQuizTrigger);

    // Cleanup on unmount
    return () => {
      EventBus.off('quiz:trigger', handleQuizTrigger);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleQuizPass = () => {
    setActiveQuiz(null);
    setCoins(prev => prev + 500); // Reward for passing!
    EventBus.emit('quiz:complete', { success: true });
  };

  const handleQuizClose = () => {
    setActiveQuiz(null);
    EventBus.emit('quiz:complete', { success: false });
  };

  return (
    <div className="w-full h-screen relative bg-[#87ceeb] font-sans select-none overflow-hidden">
      
      {/* Phaser Canvas Container */}
      <div id="phaser-game-container" className="absolute inset-0 w-full h-full z-0" />

      {/* --- UI OVERLAY --- */}

      {/* Top Banner (Wood Texture Simulation) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-16 bg-gradient-to-b from-[#a85f34] to-[#874b29] rounded-b-3xl border-b-4 border-[#5a321b] shadow-2xl z-10 flex items-center justify-center">
        <h1 className="text-white text-3xl font-extrabold tracking-wider drop-shadow-md" style={{ textShadow: '2px 2px 0px #5a321b' }}>
          BUILD YOUR DREAM CITY!
        </h1>
        
        {/* Exit Button positioned inside banner */}
        <button 
          onClick={() => navigate('/visualizer')}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors border border-white/50"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
      </div>

      {/* Top Right: Coin Counter */}
      <div className="absolute top-20 right-6 z-10 flex items-center gap-0">
        <div className="bg-[#facc15] w-12 h-12 rounded-full border-4 border-[#ca8a04] shadow-lg flex items-center justify-center z-20 shadow-inner">
          <Coins size={24} className="text-[#854d0e]" />
        </div>
        <div className="bg-black/40 backdrop-blur -ml-6 pl-10 pr-6 py-2 rounded-r-full border-t border-b border-r border-white/20 shadow-md">
          <span className="text-white font-bold text-xl drop-shadow">{coins.toLocaleString()}</span>
        </div>
        <button className="ml-2 bg-[#22c55e] w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-white font-bold text-2xl pb-1">
          +
        </button>
      </div>

      {/* Bottom Left: Character Avatars */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
        <div className="bg-[#fefce8] p-2 rounded-2xl shadow-xl border-4 border-[#fef08a] flex gap-2 items-center">
          <div className="w-16 h-16 bg-[#fbbf24] rounded-xl flex items-center justify-center overflow-hidden border-2 border-white/50">
            {/* Placeholder for Boy */}
            <User size={40} className="text-[#b45309]" />
          </div>
          <div className="w-16 h-16 bg-[#f472b6] rounded-xl flex items-center justify-center overflow-hidden border-2 border-white/50">
            {/* Placeholder for Girl */}
            <User size={40} className="text-[#831843]" />
          </div>
        </div>
      </div>

      {/* Bottom Right: Build Menu Button */}
      <div className="absolute bottom-6 right-6 z-10">
        <button className="w-24 h-24 bg-[#fefce8] rounded-3xl shadow-xl border-4 border-[#fef08a] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group">
          <HardHat size={56} className="text-[#eab308] group-hover:-rotate-12 transition-transform" />
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeQuiz && (
          <QuizModal 
            quiz={activeQuiz} 
            onPass={handleQuizPass} 
            onClose={handleQuizClose} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
