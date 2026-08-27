import React, { useState } from 'react';
import { ArrowLeft, Lock, CheckCircle2, Play } from 'lucide-react';
import QuizRunner from './QuizRunner';

const levels = [
  { id: 1, title: 'Level 1: Arrays', description: 'Master contiguous memory allocation.' },
  { id: 2, title: 'Level 2: Linked Lists', description: 'Understand node-based sequential data.' },
  { id: 3, title: 'Level 3: Trees', description: 'Explore hierarchical data structures.' }
];

export default function DataStructuresGame({ onBack }) {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeLevel, setActiveLevel] = useState(null); // Which level is currently running

  const handleLevelComplete = (levelId) => {
    // If they beat the highest unlocked level, unlock the next
    if (levelId === unlockedLevel && unlockedLevel < 3) {
      setUnlockedLevel(prev => prev + 1);
    }
    setActiveLevel(null); // Go back to level select
  };

  if (activeLevel) {
    return (
      <div className="w-full min-h-screen bg-slate-900 font-sans text-slate-100 p-8 flex flex-col items-center">
        <QuizRunner 
          subject="ds" 
          levelId={activeLevel.id} 
          levelTitle={activeLevel.title}
          onBack={() => setActiveLevel(null)}
          onLevelComplete={handleLevelComplete}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 font-sans text-slate-100 p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center mb-12">
        <button onClick={onBack} className="bg-slate-800 p-3 rounded-full hover:bg-slate-700 transition-colors border border-slate-700 mr-6">
          <ArrowLeft size={24} className="text-blue-400" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-400">Data Structures Challenges</h1>
          <p className="text-slate-400">Complete each level to unlock the next.</p>
        </div>
      </div>

      {/* Level List */}
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {levels.map(level => {
          const isUnlocked = level.id <= unlockedLevel;
          const isCompleted = level.id < unlockedLevel;

          return (
            <div 
              key={level.id}
              onClick={() => { if(isUnlocked) setActiveLevel(level) }}
              className={`w-full p-6 rounded-2xl flex items-center justify-between border-2 transition-all ${
                isUnlocked 
                  ? 'bg-slate-800 border-blue-500/30 cursor-pointer hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/20' 
                  : 'bg-slate-800/50 border-slate-700 opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  {level.title}
                  {isCompleted && <CheckCircle2 size={24} className="text-green-400" />}
                </h2>
                <p className="text-slate-400">{level.description}</p>
              </div>
              
              <div className={`p-4 rounded-full ${isUnlocked ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                {isUnlocked ? <Play size={32} /> : <Lock size={32} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
