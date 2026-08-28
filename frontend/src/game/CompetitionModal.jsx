import React, { useState, useEffect } from 'react';
import { X, Play, Trophy, Users, Clock, Calendar } from 'lucide-react';
import useAppStore from "../store/useAppStore.js"

export default function CompetitionModal({ comp, onClose, onEnter }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Fetch specific leaderboard for this comp
    fetch(`http://localhost:5000/api/competitions/${comp._id}/leaderboard`)
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data);
        setLoading(false);
      });

    // Simple countdown timer if upcoming
    if (comp.status === 'Upcoming' && comp.startTime) {
      const interval = setInterval(() => {
        const diff = new Date(comp.startTime) - new Date();
        if (diff <= 0) {
          setTimeLeft('Starting now!');
          clearInterval(interval);
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${m}m ${s}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [comp]);

  const isActive = comp.status === 'Active' || (comp.startTime && new Date() >= new Date(comp.startTime) && new Date() <= new Date(comp.endTime));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-[#BCA297]/30 rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#202020] p-6 border-b border-[#BCA297]/20 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{comp.title}</h2>
              <span className={`px-3 py-1 rounded text-xs font-bold ${
                isActive ? 'bg-[#C5CEAE] text-[#121212]' : 'bg-[#AB526B] text-white'
              }`}>
                {isActive ? 'LIVE NOW' : comp.status.toUpperCase()}
              </span>
            </div>
            <p className="text-[#BCA297] text-sm flex items-center gap-4">
              <span className="flex items-center gap-1"><Users size={14}/> Hosted by {comp.hostOrg}</span>
              <span className="flex items-center gap-1"><Calendar size={14}/> {comp.dateString}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-[#252525] p-2 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#121212]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5">
              <h3 className="text-[#C5CEAE] font-bold mb-4 flex items-center gap-2"><Trophy size={18}/> Competition Details</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex justify-between"><span>Format:</span> <strong className="text-white">{comp.questions?.length || 0} Coding Challenges</strong></li>
                <li className="flex justify-between"><span>Difficulty:</span> <strong className="text-white">{comp.difficulty || 'Mixed'}</strong></li>
                <li className="flex justify-between"><span>Prize Pool:</span> <strong className="text-[#F0E2A4]">{comp.prizePool || 'Glory & XP'}</strong></li>
              </ul>
              
              <div className="mt-6">
                {isActive ? (
                  <button onClick={() => onEnter(comp)} className="w-full bg-[#C5CEAE] hover:bg-[#F0E2A4] text-[#121212] font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Play size={18} /> ENTER COMPETITION
                  </button>
                ) : comp.status === 'Upcoming' ? (
                  <button disabled className="w-full bg-[#252525] border border-[#333] text-slate-400 font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                    <Clock size={18} /> Starts in: {timeLeft}
                  </button>
                ) : (
                  <button disabled className="w-full bg-[#252525] text-slate-500 font-bold py-3 rounded-lg">Competition Ended</button>
                )}
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden flex flex-col">
              <div className="bg-[#202020] px-4 py-3 border-b border-[#333]">
                <h3 className="text-[#F4EBC3] font-bold text-sm">Live Scoreboard</h3>
              </div>
              <div className="flex-1 p-0 overflow-y-auto max-h-64">
                {loading ? (
                  <div className="p-4 text-center text-slate-500 text-sm">Loading ranks...</div>
                ) : leaderboard.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No scores submitted yet.</div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {leaderboard.map((u, i) => (
                        <tr key={i} className="border-b border-[#333] hover:bg-[#252525]">
                          <td className="px-4 py-2 font-mono text-[#BCA297]">#{i+1}</td>
                          <td className="px-4 py-2 font-bold text-white">{u.username}</td>
                          <td className="px-4 py-2 text-right text-[#C5CEAE] font-mono">{u.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
