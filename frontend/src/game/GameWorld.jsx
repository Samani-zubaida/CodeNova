import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, Database, Shield, BookOpen, Star, Clock, Trophy, FileText, BarChart2, Medal, User, Play, Swords, Menu, X } from 'lucide-react';
import QuizRunner from './QuizRunner';
import DuelMode from './DuelMode';
import CompetitionModal from './CompetitionModal';
import ActivityHeatmap from './ActivityHeatmap';
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
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('Assessment');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, leadRes, compRes, actRes] = await Promise.all([
          fetch('http://localhost:5000/api/levels/meta/subjects'),
          fetch('http://localhost:5000/api/dashboard/leaderboard'),
          fetch('http://localhost:5000/api/dashboard/competitions'),
          fetch('http://localhost:5000/api/users/record-activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'Hacker1' })
          })
        ]);
        
        setSubjects(await subRes.json());
        setLeaderboard(await leadRes.json());
        setCompetitions(await compRes.json());
        setUserProfile(await actRes.json());
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/leaderboard");
        setLeaderboard(await res.json());
      } catch(e) {}
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (activeQuiz) {
    return (
      <div className="w-full min-h-screen bg-[#FDFBF7] dark:bg-[#121212] font-sans">
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
    return <div className="w-full min-h-screen bg-[#FDFBF7] dark:bg-[#121212] flex items-center justify-center text-gray-900 dark:text-white">Loading Assessment Center...</div>;
  }

  // Sidebar navigation items
  const navItems = [
    { name: 'Assessment', icon: <FileText size={18} /> },
    { name: '1v1 Duel', icon: <Swords size={18} /> },
    { name: 'In-Progress Tests', icon: <Clock size={18} /> },
    { name: 'Past Results', icon: <BarChart2 size={18} /> },
    { name: 'Coding Challenges', icon: <Code2 size={18} /> },
    { name: 'Leaderboards', icon: <Trophy size={18} /> }
  ];

  return (
    <div className="flex h-screen bg-[#FDFBF7] dark:bg-[#121212] text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* Left Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-[#1A1A1A] border-r border-[#EBE0D3] dark:border-[#333] flex-col shrink-0">
        <div className="p-6 border-b border-[#EBE0D3] dark:border-[#333] flex items-center gap-3">
          <div className="bg-[#BC4A54] p-2 rounded-lg">
            <Code2 size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-[#BC4A54] dark:text-white tracking-wide">Code Nova</span>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2">
          {navItems.map((item, i) => (
            <div 
              key={i} 
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                activeTab === item.name ? 'bg-[#FDFBF7] dark:bg-[#252525] border-l-4 border-[#BC4A54] text-[#BC4A54] font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#252525]'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-[#EBE0D3] dark:border-[#333] mt-auto">
          <button onClick={() => window.location.href="/host"} className="w-full bg-[#BC4A54] hover:bg-[#a03e48] text-white font-bold py-3 rounded-lg transition-colors text-sm shadow-lg shadow-[#BC4A54]/20">Host Competition</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-[#1A1A1A] border-b border-[#EBE0D3] dark:border-[#333] flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-2 md:gap-6 text-sm font-medium">
            <button 
              className="md:hidden text-gray-900 dark:text-white p-2" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <span className="text-[#BC4A54] cursor-pointer hidden md:flex items-center gap-2 border-b-2 border-[#BC4A54] h-16"><Database size={16}/> Visualizers</span>
            <span className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:text-gray-100 hidden md:flex items-center gap-2 h-16"><Code2 size={16}/> Sandbox</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => navigate('/')} className="text-[#BC4A54] hover:text-[#BCA297] text-sm font-bold hidden md:flex items-center gap-2">
              <ArrowLeft size={16} /> Exit
            </button>
            <div className="flex items-center gap-2 md:gap-3 bg-[#FDFBF7] dark:bg-[#252525] px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-[#EBE0D3] dark:border-[#333]">
              <div className="bg-[#D3DFC8] dark:bg-[#3A4A2F] p-1 rounded-full"><Star size={12} md:size={14} className="text-gray-900 dark:text-white fill-gray-900 dark:fill-white" /></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase leading-none">Total XP</span>
                <span className="text-xs md:text-sm font-black text-gray-900 dark:text-[#D3DFC8] leading-tight">{totalXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className="w-64 bg-white dark:bg-[#1A1A1A] border-r border-[#EBE0D3] dark:border-[#333] flex flex-col h-full relative z-10 shadow-2xl">
              <div className="p-6 border-b border-[#EBE0D3] dark:border-[#333] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#BC4A54] p-2 rounded-lg">
                    <Code2 size={24} className="text-white" />
                  </div>
                  <span className="text-xl font-bold text-[#BC4A54] dark:text-white tracking-wide">Code Nova</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto">
                {navItems.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                      activeTab === item.name ? 'bg-[#FDFBF7] dark:bg-[#252525] border-l-4 border-[#BC4A54] text-[#BC4A54] font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#252525]'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                ))}
              </nav>
              <div className="px-6 py-4 border-t border-[#EBE0D3] dark:border-[#333]">
                <button onClick={() => navigate('/')} className="w-full bg-[#333] hover:bg-[#444] text-white font-bold py-3 rounded-lg transition-colors text-sm mb-2 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Exit Game
                </button>
                <button onClick={() => window.location.href="/host"} className="w-full bg-[#BC4A54] hover:bg-[#a03e48] text-white font-bold py-3 rounded-lg transition-colors text-sm shadow-lg shadow-[#BC4A54]/20">Host Competition</button>
              </div>
            </aside>
          </div>
        )}

        {/* Dynamic Tab Content */}
        {activeTab === '1v1 Duel' ? (
          <DuelMode onBack={() => setActiveTab('Assessment')} />
        ) : (
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{activeTab}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your progression and activities.</p>
              </div>

          {activeTab === 'Assessment' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map(subject => {
                const isDs = subject.id === 'ds';
                const isAlgo = subject.id === 'algo';
                const currentLevelId = unlockedLevels[subject.id] || 1;
                
                return (
                  <div key={subject.id} className="bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-xl p-6 flex flex-col h-[320px] transition-all hover:border-[#BC4A54]/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${isDs ? 'bg-[#BC4A54]/20 text-[#BC4A54]' : isAlgo ? 'bg-[#F0E2A4]/20 text-[#F0E2A4]' : 'bg-[#D3DFC8] dark:bg-[#3A4A2F]/20 text-[#BCA297]'}`}>
                        {isDs ? <Database size={24} /> : isAlgo ? <Code2 size={24} /> : <BookOpen size={24} />}
                      </div>
                      <div className="bg-[#FDFBF7] dark:bg-[#252525] px-3 py-1 rounded text-xs font-bold text-gray-700 dark:text-gray-300">
                        Level {currentLevelId}/6
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{subject.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1">
                      {isDs ? "Master fundamental data structures." : isAlgo ? "Learn essential algorithmic patterns." : "Understand Object-Oriented paradigms."}
                    </p>
                    
                    <button 
                      onClick={() => setActiveQuiz({ subject: subject.id, level: currentLevelId })}
                      className="mt-auto w-full py-2.5 rounded-lg font-bold transition-colors bg-[#C5CEAE] text-[#121212] hover:bg-[#F0E2A4]"
                    >
                      START LEVEL {currentLevelId}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'In-Progress Tests' && (
            <div className="border border-[#EBE0D3] dark:border-[#333] rounded-xl bg-white dark:bg-[#1A1A1A] overflow-hidden p-12 flex flex-col items-center justify-center text-center">
              <Clock size={48} className="text-slate-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No In-Progress Tests</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">You currently have no paused or ongoing assessments. Go to the Assessment tab to start a new level.</p>
              <button onClick={() => setActiveTab('Assessment')} className="mt-6 bg-[#C5CEAE] text-[#121212] px-6 py-2 rounded-lg font-bold hover:bg-[#F0E2A4] transition-colors">
                Go to Assessments
              </button>
            </div>
          )}

          {activeTab === 'Past Results' && (
            <div className="border border-[#EBE0D3] dark:border-[#333] rounded-xl bg-white dark:bg-[#1A1A1A] overflow-hidden">
              <div className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FDFBF7] dark:bg-[#252525] text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-[#EBE0D3] dark:border-[#333]">
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Completion Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedLevels.map((lvl, idx) => (
                      <tr key={idx} className="border-b border-[#BCA297]/10 hover:bg-[#202020] transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{lvl.title}</td>
                        <td className="px-6 py-4"><span className="text-xs font-bold text-[#BC4A54] bg-[#C5CEAE]/10 px-2 py-1 rounded">Passed</span></td>
                        <td className="px-6 py-4 text-sm text-[#BCA297]">{lvl.date}</td>
                      </tr>
                    ))}
                    {completedLevels.length === 0 && (
                      <tr><td colSpan="3" className="px-6 py-12 text-sm text-slate-500 text-center">No assessments completed yet. Complete a level to see it here.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Coding Challenges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitions.map((comp, idx) => {
                const isActive = comp.status === 'Active';
                return (
                  <div key={comp._id || idx} className="bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-xl p-5 flex flex-col relative">
                    {isActive && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div> LIVE NOW
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2 pr-16">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{comp.title}</h3>
                    </div>
                    {comp.type === 'Global' && (
                      <span className="inline-block bg-[#BC4A54] text-white text-[10px] font-bold px-2 py-0.5 rounded w-max mb-3">Global</span>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-4 flex-1">
                      <p>Date: <span className="text-gray-900 dark:text-[#D3DFC8]">{comp.dateString}</span></p>
                      {comp.prizePool && <p>Prize Pool: <span className="text-[#F0E2A4] font-bold">{comp.prizePool}</span></p>}
                      {comp.difficulty && <p>Difficulty: <span className="text-[#BC4A54]">{comp.difficulty}</span></p>}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-[#333]">
                      <button onClick={() => setSelectedComp(comp)} className={`w-full text-xs font-bold py-2 px-3 rounded transition-colors ${comp.type === 'Global' ? 'bg-[#BC4A54] hover:bg-[#8e4257] text-white' : 'border border-[#BCA297] text-[#BCA297] hover:bg-[#D3DFC8] dark:bg-[#3A4A2F]/10'}`}>
                        {comp.type === 'Global' ? 'View Competition' : 'Details'}
                      </button>
                    </div>
                  </div>
                );
              })}
              {competitions.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  No upcoming coding challenges or competitions.
                </div>
              )}
            </div>
          )}

          {activeTab === 'Leaderboards' && (
            <div className="border border-[#EBE0D3] dark:border-[#333] rounded-xl bg-white dark:bg-[#1A1A1A] overflow-hidden">
              <div className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FDFBF7] dark:bg-[#252525] text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-[#EBE0D3] dark:border-[#333]">
                      <th className="px-6 py-4 font-semibold w-24 text-center">Rank</th>
                      <th className="px-6 py-4 font-semibold">Username</th>
                      <th className="px-6 py-4 font-semibold text-right">Total XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((user, idx) => (
                      <tr key={idx} className="border-b border-[#BCA297]/10 hover:bg-[#202020] transition-colors">
                        <td className="px-6 py-4 text-center font-bold text-gray-700 dark:text-gray-300">
                          {idx === 0 ? <Medal size={18} className="inline text-yellow-400" /> : idx === 1 ? <Medal size={18} className="inline text-gray-700 dark:text-gray-300" /> : idx === 2 ? <Medal size={18} className="inline text-orange-400" /> : `#${idx + 1}`}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <User size={14} className="text-slate-500" />
                          {user.username}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#F0E2A4] font-black">{user.xp.toLocaleString()}</td>
                      </tr>
                    ))}
                    {leaderboard.length === 0 && (
                      <tr><td colSpan="3" className="px-6 py-12 text-sm text-slate-500 text-center">Leaderboard data unavailable.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
            </div>
            
            {/* Right Sidebar for Streaks & Profile Stats */}
            <div className="w-80 shrink-0 flex flex-col gap-6">
              {userProfile && (
                <>
                  <ActivityHeatmap 
                    activityLog={userProfile.activityLog} 
                    currentStreak={userProfile.currentStreak} 
                    longestStreak={userProfile.longestStreak} 
                  />
                  
                  {/* Skill Badges */}
                  <div className="bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-xl p-5">
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Medal size={18} className="text-yellow-500" />
                      Skill Badges
                    </h3>
                    {(!userProfile.earnedBadges || userProfile.earnedBadges.length === 0) ? (
                      <p className="text-sm text-slate-500">Complete assessments to earn badges!</p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {userProfile.earnedBadges.map((badge, idx) => (
                          <div key={idx} className="flex flex-col items-center bg-[#FDFBF7] dark:bg-[#252525] p-3 rounded-lg border border-slate-700/50 w-[100px] text-center" title={new Date(badge.awardedAt).toLocaleDateString()}>
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                              <Trophy size={24} className="text-gray-900 dark:text-white" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 leading-tight">{badge.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      {selectedComp && (
        <CompetitionModal 
          comp={selectedComp} 
          onClose={() => setSelectedComp(null)} 
          onEnter={(comp) => {
             setSelectedComp(null);
             setActiveQuiz({ type: 'competition', data: comp });
          }} 
        />
      )}
    </div>
  );
}
