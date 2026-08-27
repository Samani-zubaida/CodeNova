import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Box, Key, Lock, Unlock } from 'lucide-react';
import DataStructuresGame from './DataStructuresGame';
import OOPGame from './OOPGame';
import CryptoGame from './CryptoGame';

export default function GameWorld() {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState(null);

  if (activeSubject === 'ds') {
    return <DataStructuresGame onBack={() => setActiveSubject(null)} />;
  }
  if (activeSubject === 'oop') {
    return <OOPGame onBack={() => setActiveSubject(null)} />;
  }
  if (activeSubject === 'crypto') {
    return <CryptoGame onBack={() => setActiveSubject(null)} />;
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 font-sans text-slate-100 p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/')}
          className="bg-slate-800 p-3 rounded-full hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ALGOVERSE CHALLENGES
        </h1>
        <div className="w-12"></div> {/* Spacer for centering */}
      </div>

      <p className="text-xl text-slate-400 mb-12 text-center max-w-2xl">
        Select a subject below to begin your training. Pass the quizzes in each level to unlock the next challenge!
      </p>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        
        {/* Data Structures */}
        <div 
          onClick={() => setActiveSubject('ds')}
          className="bg-slate-800 border-2 border-blue-500/50 rounded-2xl p-8 cursor-pointer hover:scale-105 hover:border-blue-400 transition-all shadow-lg shadow-blue-900/20 flex flex-col items-center text-center group"
        >
          <div className="bg-blue-500/20 p-6 rounded-full mb-6 group-hover:bg-blue-500/30 transition-colors">
            <Database size={64} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Data Structures</h2>
          <p className="text-slate-400">Master Arrays, Linked Lists, and Trees.</p>
        </div>

        {/* OOP */}
        <div 
          onClick={() => setActiveSubject('oop')}
          className="bg-slate-800 border-2 border-green-500/50 rounded-2xl p-8 cursor-pointer hover:scale-105 hover:border-green-400 transition-all shadow-lg shadow-green-900/20 flex flex-col items-center text-center group"
        >
          <div className="bg-green-500/20 p-6 rounded-full mb-6 group-hover:bg-green-500/30 transition-colors">
            <Box size={64} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Object-Oriented</h2>
          <p className="text-slate-400">Master Classes, Inheritance, and Polymorphism.</p>
        </div>

        {/* Cryptography */}
        <div 
          onClick={() => setActiveSubject('crypto')}
          className="bg-slate-800 border-2 border-yellow-500/50 rounded-2xl p-8 cursor-pointer hover:scale-105 hover:border-yellow-400 transition-all shadow-lg shadow-yellow-900/20 flex flex-col items-center text-center group"
        >
          <div className="bg-yellow-500/20 p-6 rounded-full mb-6 group-hover:bg-yellow-500/30 transition-colors">
            <Key size={64} className="text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Cryptography</h2>
          <p className="text-slate-400">Master Ciphers, Encryption, and Security.</p>
        </div>

      </div>
    </div>
  );
}
