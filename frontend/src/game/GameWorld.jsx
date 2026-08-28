import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, Database, Shield, BookOpen, Star, Clock, Trophy, FileText, BarChart2, Medal, User } from 'lucide-react';
import QuizRunner from './QuizRunner';
import CompetitionModal from './CompetitionModal';
import useAppStore from "../store/useAppStore.js"

export default function GameWorld() {
  const navigate = useNavigate();
  const totalXP = useAppStore(state => state.totalXP);
  const unlockedLevels = useAppStore(state => state.unlockedLevels);
  const completedLevels = useAppStore(state => state.completedLevels);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedComp, setSelectedComp] = useState(null);
  
  const [subjects, setSubjects] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, leadRes, compRes] = await Promise.all([
          fetch('http://localhost:5000/api/levels/meta/subjects'),
          fetch('http://localhost:5000/api/dashboard/leaderboard'),
          fetch('http://localhost:5000/api/dashboard/competitions')
        ]);
        
        setSubjects(await subRes.json());
        setLeaderboard(await leadRes.json());
        setCompetitions(await compRes.json());
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (activeQuiz) {
    return (
      <div className="w-full min-h-screen bg-[#121212] font-sans">
        <QuizRunner 
          subject={activeQuiz.subject}
          levelId={activeQuiz.level}
          competitionData={activeQuiz.type === "competition" ? activeQuiz.data : null}
          onBack={() => setActiveQuiz(null)}
          onLevelComplete={() => setActiveQuiz(null)}
        />
      </div>
    );
  }

  if (loading) {
    return <div className="w-full min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading Assessment Center...</div>;
  }

  // Sidebar navigation items
  const navItems = [
    { name: 'Assessment', icon: <FileText size={18} /> },
    { name: 'In-Progress Tests', icon: <FileText size={18} />, active: true },
    { name: 'Past Results', icon: <BarChart2 size={18} /> },
    { name: 'Coding Challenges', icon: <Code2 size={18} /> },
    { name: 'Leaderboards', icon: <Trophy size={18} /> },
    { name: 'Certifications', icon: <Medal size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#121212] text-slate-200 font-sans overflow-hidden">
      
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] border-r border-[#BCA297]/20 flex flex-col">
        <div className="p-6 border-b border-[#BCA297]/20 flex items-center gap-3">
          <div className="bg-[#AB526B] p-2 rounded-lg">
            <Code2 size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">Code Nova</span>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2">
          {navItems.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${item.active ? 'bg-[#333333] border-l-4 border-[#C5CEAE] text-white' : 'text-slate-400 hover:text-white hover:bg-[#252525]'}`}>
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-[#BCA297]/20 mt-auto">
          <button onClick={() => window.location.href="/host"} className="w-full bg-[#AB526B] hover:bg-[#8e4257] text-white font-bold py-3 rounded-lg transition-colors text-sm shadow-lg shadow-[#AB526B]/20">Host Competition</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 bg-[#1A1A1A] border-b border-[#BCA297]/20 flex items-center justify-between px-8">
          <div className="flex items-center gap-6 text-sm font-medium">
            <span className="text-[#C5CEAE] cursor-pointer flex items-center gap-2 border-b-2 border-[#C5CEAE] h-16"><Database size={16}/> Visualizers</span>
            <span className="text-slate-400 cursor-pointer hover:text-slate-200 flex items-center gap-2 h-16"><Code2 size={16}/> Sandbox</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="text-[#AB526B] hover:text-[#BCA297] text-sm font-bold flex items-center gap-2">
              <ArrowLeft size={16} /> Exit
            </button>
            <div className="flex items-center gap-3 bg-[#252525] px-4 py-2 rounded-full border border-[#BCA297]/30">
              <div className="bg-[#BCA297] p-1 rounded-full"><Star size={14} className="text-white fill-white" /></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase leading-none">Total XP</span>
                <span className="text-sm font-black text-[#F4EBC3] leading-tight">{totalXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-white mb-8">Nova Assessment Center</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Active Assessments */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className="border border-[#BCA297]/20 rounded-xl bg-[#1A1A1A] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#BCA297]/20">
                  <h2 className="text-lg font-bold text-[#C5CEAE] tracking-wider uppercase">Active Assessments</h2>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((subject, idx) => {
                    const currentLevelId = unlockedLevels[subject.id] || 1;
                    const isMain = idx === 0;
                    return (
                      <div key={subject.id} className={`rounded-xl border ${isMain ? 'border-[#C5CEAE]' : 'border-[#252525]'} bg-[#202020] p-5 flex flex-col relative`}>
                        <div className="absolute top-0 right-0 bg-[#333] text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg border-b border-l border-[#252525] text-slate-300">
                          {isMain ? 'Time-Limited' : 'Recommended'}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{subject.title}:</h3>
                        <h4 className="text-[#F0E2A4] font-medium mb-4">Level {currentLevelId}</h4>
                        
                        {isMain && (
                          <div className="flex items-center gap-2 mb-4">
                            <Clock size={16} className="text-[#C5CEAE]" />
                            <span className="text-slate-300 text-sm">Estimated: <strong className="text-[#C5CEAE]">15 mins</strong></span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-xs text-slate-400">Status:</span>
                          <span className="text-xs font-bold bg-[#C5CEAE]/20 text-[#C5CEAE] px-2 py-0.5 rounded">In-Progress</span>
                        </div>

                        <button 
                          onClick={() => setActiveQuiz({ subject: subject.id, level: currentLevelId })}
                          className={`mt-auto w-full py-2.5 rounded-lg font-bold transition-colors ${
                            isMain 
                              ? 'bg-[#C5CEAE] text-[#121212] hover:bg-[#F0E2A4]' 
                              : 'border border-[#C5CEAE] text-[#C5CEAE] hover:bg-[#C5CEAE]/10'
                          }`}
                        >
                          RESUME TEST
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Results */}
              <div className="border border-[#BCA297]/20 rounded-xl bg-[#1A1A1A] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#BCA297]/20">
                  <h2 className="text-lg font-bold text-[#F4EBC3] tracking-wider uppercase">Recent Assessment Results</h2>
                </div>
                <div className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#252525] text-xs uppercase text-slate-400 border-b border-[#BCA297]/20">
                        <th className="px-6 py-3 font-semibold">Title</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 font-semibold">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedLevels.map((lvl, idx) => (
                        <tr key={idx} className="border-b border-[#BCA297]/10 hover:bg-[#202020] transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-white">{lvl.title}</td>
                          <td className="px-6 py-4"><span className="text-xs font-bold text-[#C5CEAE]">Passed</span></td>
                          <td className="px-6 py-4 text-sm text-[#BCA297]">{lvl.date}</td>
                        </tr>
                      ))}
                      {completedLevels.length === 0 && (
                        <tr><td colSpan="3" className="px-6 py-4 text-sm text-slate-500 text-center">No assessments completed yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              
              {/* Competitions */}
              <div className="border border-[#BCA297]/20 rounded-xl bg-[#1A1A1A] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#BCA297]/20">
                  <h2 className="text-lg font-bold text-[#BCA297] tracking-wider uppercase">Upcoming Competitions</h2>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  {competitions.map((comp, idx) => (
                    <div key={comp._id || idx} className="bg-[#202020] border border-[#252525] rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white text-base leading-tight">{comp.title}</h3>
                        {comp.type === 'Global' && (
                          <span className="bg-[#AB526B] text-white text-[10px] font-bold px-2 py-0.5 rounded ml-2 whitespace-nowrap">Global</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 space-y-1 mb-4">
                        <p>Date: <span className="text-[#F4EBC3]">{comp.dateString}</span></p>
                        {comp.prizePool && <p>Prize Pool: <span className="text-[#F0E2A4] font-bold">{comp.prizePool}</span></p>}
                        {comp.difficulty && <p>Difficulty: <span className="text-[#C5CEAE]">{comp.difficulty}</span></p>}
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#333]">
                        {comp.type === 'Global' ? (
                           <button onClick={() => setSelectedComp(comp)} className="bg-[#AB526B] hover:bg-[#8e4257] text-white text-xs font-bold py-1.5 px-3 rounded transition-colors w-full">View Competition</button>
                        ) : (
                           <button onClick={() => setSelectedComp(comp)} className="border border-[#BCA297] text-[#BCA297] hover:bg-[#BCA297]/10 text-xs font-bold py-1.5 px-3 rounded transition-colors w-full">Details</button>
                        )}
                      </div>
                    </div>
                  ))}
                  {competitions.length === 0 && <p className="text-sm text-slate-500">No competitions found.</p>}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="border border-[#BCA297]/20 rounded-xl bg-[#1A1A1A] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#BCA297]/20">
                  <h2 className="text-lg font-bold text-[#BCA297] tracking-wider uppercase">Global Leaderboard (Live)</h2>
                </div>
                <div className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#252525] text-xs uppercase text-slate-400 border-b border-[#BCA297]/20">
                        <th className="px-4 py-2 font-semibold text-center">Rank</th>
                        <th className="px-4 py-2 font-semibold">Name</th>
                        <th className="px-4 py-2 font-semibold text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedLevels.map((lvl, idx) => (
                        <tr key={idx} className="border-b border-[#BCA297]/10 hover:bg-[#202020] transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-white">{lvl.title}</td>
                          <td className="px-6 py-4"><span className="text-xs font-bold text-[#C5CEAE]">Passed</span></td>
                          <td className="px-6 py-4 text-sm text-[#BCA297]">{lvl.date}</td>
                        </tr>
                      ))}
                      {completedLevels.length === 0 && (
                        <tr><td colSpan="3" className="px-6 py-4 text-sm text-slate-500 text-center">No assessments completed yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      {selectedComp && (
        <CompetitionModal 
          comp={selectedComp} 
          onClose={() => setSelectedComp(null)} 
          onEnter={(comp) => {
             setSelectedComp(null);
             // For now, launch it in QuizRunner as a special subject.
             // Normally we'd have a CompetitionRunner, but QuizRunner can handle dynamic questions if we adapt it.
             // Let's pass the competition ID to activeQuiz
             setActiveQuiz({ type: 'competition', data: comp });
          }} 
        />
      )}
    </div>
  );
}





