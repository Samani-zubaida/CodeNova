import React from 'react';
import { Flame } from 'lucide-react';

export default function ActivityHeatmap({ activityLog = [], currentStreak = 0, longestStreak = 0 }) {
  // Generate a basic 7x30 grid (approx last 7 months) or just a smaller grid for UI
  // For simplicity, let's generate the last 60 days
  const today = new Date();
  const days = [];
  
  for (let i = 59; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isActive = activityLog.includes(dateStr);
    days.push({ date: dateStr, isActive });
  }

  // Calculate weeks for grid (columns)
  const weeks = [];
  let currentWeek = [];
  days.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-xl p-5 mb-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-white font-bold text-lg mb-1">Activity Streak</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Log in daily to keep your streak alive.</p>
        </div>
        <div className="flex gap-4 text-center">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Current</div>
            <div className="text-[#F0E2A4] font-black flex items-center gap-1 justify-center">
              <Flame size={16} fill="currentColor" /> {currentStreak}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Longest</div>
            <div className="text-white font-black">{longestStreak}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-1">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((day, dIdx) => (
              <div 
                key={day.date} 
                title={day.date}
                className={`w-3 h-3 rounded-[2px] ${day.isActive ? 'bg-[#C5CEAE] shadow-[0_0_5px_#C5CEAE80]' : 'bg-[#FDFBF7] dark:bg-[#252525]'}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold">
        <span>60 Days Ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
