import React, { useState } from 'react';
import { ArrowLeft, Lock, CheckCircle2, Play } from 'lucide-react';

const levels = [
  { id: 1, title: 'Level 1: Arrays', description: 'Master contiguous memory allocation.', question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], answer: 0 },
  { id: 2, title: 'Level 2: Linked Lists', description: 'Understand node-based sequential data.', question: 'Which is a primary advantage of a Linked List over an Array?', options: ['Faster random access', 'Dynamic size without reallocation', 'Less memory usage', 'Better cache locality'], answer: 1 },
  { id: 3, title: 'Level 3: Trees', description: 'Explore hierarchical data structures.', question: 'In a Binary Search Tree, where are smaller values placed relative to a parent node?', options: ['Right child', 'Left child', 'Root', 'Any leaf'], answer: 1 }
];

export default function DataStructuresGame({ onBack }) {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleLevelClick = (level) => {
    if (level.id <= unlockedLevel) {
      setActiveQuiz(level);
      setSelectedAnswer(null);
      setFeedback('');
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === activeQuiz.answer) {
      setFeedback('Correct! Level Passed!');
      if (activeQuiz.id === unlockedLevel && unlockedLevel < 3) {
        setUnlockedLevel(prev => prev + 1);
      }
    } else {
      setFeedback('Incorrect. Try again!');
    }
  };

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
      {!activeQuiz ? (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {levels.map(level => {
            const isUnlocked = level.id <= unlockedLevel;
            const isCompleted = level.id < unlockedLevel;

            return (
              <div 
                key={level.id}
                onClick={() => handleLevelClick(level)}
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
      ) : (
        /* Quiz Interface */
        <div className="w-full max-w-3xl bg-slate-800 border-2 border-blue-500/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">{activeQuiz.title} Challenge</h2>
          <p className="text-xl text-slate-200 mb-8">{activeQuiz.question}</p>
          
          <div className="flex flex-col gap-4 mb-8">
            {activeQuiz.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAnswer(idx)}
                className={`p-4 rounded-xl text-left font-medium transition-colors border-2 ${
                  selectedAnswer === idx 
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300' 
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-slate-700 pt-6">
            <button 
              onClick={() => setActiveQuiz(null)}
              className="px-6 py-3 rounded-xl font-bold bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              Back to Levels
            </button>
            
            <div className="flex items-center gap-4">
              {feedback && (
                <span className={`font-bold ${feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback}
                </span>
              )}
              <button 
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="px-8 py-3 rounded-xl font-bold bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors shadow-lg shadow-blue-500/30"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
