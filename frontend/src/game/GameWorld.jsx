import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { GameConfig } from './phaser/GameConfig';
import { EventBus } from './phaser/EventBus';
import QuizRunner from './QuizRunner';
import { ArrowLeft } from 'lucide-react';

export default function GameWorld() {
  const navigate = useNavigate();
  const gameRef = useRef(null);
  const [activeQuiz, setActiveQuiz] = useState(null); // { subject, level }

  useEffect(() => {
    // Initialize Phaser
    const game = new Phaser.Game(GameConfig);
    gameRef.current = game;

    // Listen for terminal collisions from MainScene
    EventBus.on('start-quiz', (data) => {
      setActiveQuiz(data);
    });

    return () => {
      EventBus.off('start-quiz');
      game.destroy(true);
    };
  }, []);

  const handleQuizComplete = () => {
    setActiveQuiz(null);
    EventBus.emit('resume-game');
  };

  const handleQuizFail = () => {
    setActiveQuiz(null);
    EventBus.emit('resume-game');
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="bg-slate-800 p-3 rounded-full hover:bg-slate-700 transition-colors border border-slate-700 shadow-xl"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 shadow-xl">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            ALGOVERSE PLATFORMER
          </h1>
          <p className="text-xs text-slate-400">Use Arrows to Move, Up to Jump. Find Terminals!</p>
        </div>
      </div>

      {/* Phaser Canvas Container */}
      <div id="phaser-container" className="w-full h-full flex-1 flex items-center justify-center" />

      {/* React UI Overlay (QuizRunner) */}
      {activeQuiz && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <QuizRunner 
            subject={activeQuiz.subject}
            levelId={activeQuiz.level}
            levelTitle={`Terminal Hacked: ${activeQuiz.subject.toUpperCase()}`}
            onBack={handleQuizFail}
            onLevelComplete={handleQuizComplete}
          />
        </div>
      )}
    </div>
  );
}
