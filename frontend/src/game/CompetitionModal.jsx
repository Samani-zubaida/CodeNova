import React, { useState, useEffect } from 'react';
import { X, Play, Trophy, Users, Clock, Calendar } from 'lucide-react';
import useAppStore from "../store/useAppStore.js";
import * as competitionService from "../services/competitionService";

export default function CompetitionModal({ comp, onClose, onEnter }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  const fetchLeaderboard = async () => {
    try {
      const data = await competitionService.getCompetitionLeaderboard(comp._id);
      setLeaderboard(data.participants || []);
      setEnrollmentCount(data.enrollmentCount || 0);
      setLoading(false);
    } catch (e) {
      console.error('Failed to fetch competition leaderboard:', e);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLeaderboard();

    // Live polling every 3 seconds for real-time leaderboard
    const pollInterval = setInterval(fetchLeaderboard, 3000);

    // Simple countdown timer if upcoming
    let countdownInterval;
    if (comp.status === 'Upcoming' && comp.startTime) {
      countdownInterval = setInterval(() => {
        const diff = new Date(comp.startTime) - new Date();
        if (diff <= 0) {
          setTimeLeft('Starting now!');
          clearInterval(countdownInterval);
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${m}m ${s}s`);
        }
      }, 1000);
    }
    
    return () => {
      clearInterval(pollInterval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [comp]);

  const isActive = comp.status === 'Active' || (comp.startTime && new Date() >= new Date(comp.startTime) && new Date() <= new Date(comp.endTime));

  // Function to format timeTakenMs to a readable string (e.g., 2m 14s)
  const formatTime = (ms) => {
    if (!ms) return '-';
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] dark:border-[#5C4E49] rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#202020] p-6 border-b border-[#EBE0D3] dark:border-[#5C4E49] dark:border-[#5C4E49] flex justify-between items-start">
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
              <span className="flex items-center gap-1"><Users size={14}/> {enrollmentCount} Enrolled</span>
            </p>
          </div>
          <button onClick={onClose} className="text-[#2D1F23]/60 dark:text-[#BCA297] hover:text-white bg-[#FAF7F2] dark:bg-[#5C4E49] p-2 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#FAF7F2] dark:bg-[#331921]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-[#423834] border border-[#5C4E49] rounded-xl p-5">
              <h3 className="text-[#AB526B] font-bold mb-4 flex items-center gap-2"><Trophy size={18}/> Competition Details</h3>
              <ul className="space-y-3 text-sm text-[#2D1F23] dark:text-[#F0E2A4]">
                <li className="flex justify-between"><span>Format:</span> <strong className="text-white">{comp.questions?.length || 0} Coding Challenges</strong></li>
                <li className="flex justify-between"><span>Difficulty:</span> <strong className="text-white">{comp.difficulty || 'Mixed'}</strong></li>
                <li className="flex justify-between"><span>Prize Pool:</span> <strong className="text-[#F0E2A4]">{comp.prizePool || 'Glory & XP'}</strong></li>
              </ul>
              
              <div className="mt-6">
                {isActive ? (
                  <button onClick={() => {
                      // Trigger enroll endpoint in the background before entering
                      competitionService.enrollInCompetition(comp._id).catch(console.error);
                      onEnter(comp);
                  }} className="w-full bg-[#C5CEAE] hover:bg-[#F0E2A4] text-[#121212] font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Play size={18} /> ENTER COMPETITION
                  </button>
                ) : comp.status === 'Upcoming' ? (
                  <button disabled className="w-full bg-[#FAF7F2] dark:bg-[#5C4E49] border border-[#5C4E49] text-[#2D1F23]/60 dark:text-[#BCA297] font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                    <Clock size={18} /> Starts in: {timeLeft}
                  </button>
                ) : (
                  <button disabled className="w-full bg-[#FAF7F2] dark:bg-[#5C4E49] text-slate-500 font-bold py-3 rounded-lg">Competition Ended</button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#423834] border border-[#5C4E49] rounded-xl overflow-hidden flex flex-col">
              <div className="bg-[#202020] px-4 py-3 border-b border-[#5C4E49] flex justify-between items-center">
                <h3 className="text-gray-900 dark:text-[#D3DFC8] font-bold text-sm">Live Scoreboard</h3>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live
                </div>
              </div>
              <div className="flex-1 p-0 overflow-y-auto max-h-64">
                {loading ? (
                  <div className="p-4 text-center text-slate-500 text-sm">Loading ranks...</div>
                ) : leaderboard.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No scores submitted yet.</div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#5C4E49] text-xs text-slate-500">
                        <th className="px-4 py-2 font-normal">Rank</th>
                        <th className="px-4 py-2 font-normal">Hacker</th>
                        <th className="px-4 py-2 font-normal text-right">Score</th>
                        <th className="px-4 py-2 font-normal text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((u, i) => (
                        <tr key={i} className="border-b border-[#5C4E49] hover:bg-[#FAF7F2] dark:bg-[#5C4E49]">
                          <td className="px-4 py-2 font-mono text-[#BCA297]">#{i+1}</td>
                          <td className="px-4 py-2 font-bold text-white">{u.username}</td>
                          <td className="px-4 py-2 text-right text-[#AB526B] font-mono">{u.score}</td>
                          <td className="px-4 py-2 text-right text-[#2D1F23]/60 dark:text-[#BCA297] text-xs">{formatTime(u.timeTakenMs)}</td>
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
