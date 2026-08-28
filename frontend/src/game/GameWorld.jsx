import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, Database, Shield, ChevronRight, Lock, BookOpen } from 'lucide-react';
import QuizRunner from './QuizRunner';

export default function GameWorld() {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/levels/meta/subjects')
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load subjects:", err);
        setLoading(false);
      });
  }, []);

  const getIcon = (id) => {
    switch(id) {
      case 'ds': return <Database size={24} className="text-blue-400" />;
      case 'algo': return <Code2 size={24} className="text-orange-400" />;
      default: return <BookOpen size={24} className="text-purple-400" />;
    }
  };

  const getColor = (id) => {
    switch(id) {
      case 'ds': return 'bg-blue-500/10 border-blue-500/20';
      case 'algo': return 'bg-orange-500/10 border-orange-500/20';
      default: return 'bg-purple-500/10 border-purple-500/20';
    }
  };

  if (activeQuiz) {
    return (
      <div className="w-full min-h-screen bg-[#0f172a] font-sans">
        <QuizRunner 
          subject={activeQuiz.subject}
          levelId={activeQuiz.level}
          onBack={() => setActiveQuiz(null)}
          onLevelComplete={() => setActiveQuiz(null)}
        />
      </div>
    );
  }

  if (loading) {
    return <div className="w-full min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading Challenges...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#0f172a] font-sans text-slate-100 p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-6xl flex items-center mb-12">
        <button 
          onClick={() => navigate('/')}
          className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700 mr-6"
        >
          <ArrowLeft size={24} className="text-slate-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Challenge Academy</h1>
          <p className="text-slate-400 mt-1">Master computer science concepts through interactive problem solving.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {subjects.map(subject => (
          <div key={subject.id} className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            
            {/* Card Header */}
            <div className="p-6 border-b border-slate-700 flex items-center gap-4 bg-slate-800/50">
              <div className={`p-3 rounded-lg border ${getColor(subject.id)}`}>
                {getIcon(subject.id)}
              </div>
              <h2 className="text-xl font-bold text-white">{subject.title}</h2>
            </div>

            {/* Level List */}
            <div className="flex-1 p-4 flex flex-col gap-2">
              {subject.levels.map((level, idx) => (
                <div 
                  key={level.id}
                  onClick={() => !level.locked && setActiveQuiz({ subject: subject.id, level: level.id })}
                  className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all ${
                    level.locked 
                      ? 'bg-slate-800/30 border-transparent opacity-50 cursor-not-allowed' 
                      : 'bg-slate-800 border-slate-600 hover:border-slate-400 cursor-pointer group'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-mono text-sm">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="font-semibold text-slate-200">{level.title}</span>
                  </div>
                  
                  {level.locked ? (
                    <Lock size={18} className="text-slate-500" />
                  ) : (
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                  )}
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
