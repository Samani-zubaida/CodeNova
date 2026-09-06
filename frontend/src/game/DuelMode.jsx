import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Swords, Loader2, Trophy, AlertCircle, Play, X, User, CheckCircle2 } from 'lucide-react';
import useAppStore from "../store/useAppStore";

export default function DuelMode({ onBack }) {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('lobby'); // lobby, searching, active, finished
  const [duelData, setDuelData] = useState(null);
  
  // Gameplay State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentId, setOpponentId] = useState('');
  const [opponentName, setOpponentName] = useState('Opponent');
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState(null);
  
  const startTimeRef = useRef(Date.now());
  const user = useAppStore(state => state.user);
  const myUsername = user ? user.username : 'Guest'; // Use real user from store

  useEffect(() => {
    // Connect to Socket server
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Socket Event Listeners
    newSocket.on('waiting_for_opponent', () => {
      setStatus('searching');
    });

    newSocket.on('duel_started', (data) => {
      setDuelData(data);
      const opp = data.players.find(p => p.id !== newSocket.id);
      if (opp) {
        setOpponentId(opp.id);
        setOpponentName(opp.username);
      }
      setStatus('active');
      setCurrentQIndex(0);
      setMyProgress(0);
      setMyScore(0);
      setOpponentProgress(0);
      setOpponentScore(0);
      startTimeRef.current = Date.now();
    });

    newSocket.on('opponent_progress', (data) => {
      setOpponentProgress(data.progress);
      setOpponentScore(data.score);
    });

    newSocket.on('opponent_finished', () => {
      // Show some UI that opponent is done waiting for you
    });

    newSocket.on('duel_results', (data) => {
      setResults(data);
      setStatus('finished');
    });

    newSocket.on('opponent_disconnected', () => {
      alert("Opponent disconnected! You win by default.");
      setStatus('lobby');
    });

    return () => newSocket.disconnect();
  }, []);

  const joinMatchmaking = () => {
    if (socket) {
      setStatus('searching');
      socket.emit('join_matchmaking', { username: myUsername });
    }
  };

  const cancelSearch = () => {
    // In a real app we'd emit 'leave_matchmaking', for now just reset socket or state
    setStatus('lobby');
    socket.disconnect();
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
  };

  const handleOptionSelect = (index) => {
    if (feedback !== null || status !== 'active') return;
    setSelectedOption(index);

    const question = duelData.questions[currentQIndex];
    const isCorrect = index === question.correct;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    let newScore = myScore;
    if (isCorrect) {
      newScore += question.xp;
      setMyScore(newScore);
    }

    const newProgress = Math.round(((currentQIndex + 1) / duelData.questions.length) * 100);
    setMyProgress(newProgress);

    // Emit progress to opponent
    socket.emit('update_progress', {
      roomId: duelData.roomId,
      progress: newProgress,
      score: newScore
    });

    setTimeout(() => {
      if (currentQIndex < duelData.questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        // Finished local game!
        setStatus('waiting_for_results');
        const timeTakenMs = Date.now() - startTimeRef.current;
        socket.emit('duel_complete', {
          roomId: duelData.roomId,
          finalScore: newScore,
          timeTakenMs
        });
      }
    }, 1500);
  };

  // ------------------ UI RENDERS ------------------ //

  if (status === 'lobby' || status === 'searching') {
    return (
      <div className="flex-1 bg-[#FDFBF7] dark:bg-[#121212] p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#BCA297 1px, transparent 1px), linear-gradient(90deg, #BCA297 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 max-w-lg w-full bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-[#FDFBF7] dark:bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#BC4A54]">
            <Swords size={40} className="text-[#BC4A54]" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2">1v1 DUEL MODE</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Race against another hacker to solve 5 CS concepts. Speed and accuracy matter!</p>

          {status === 'lobby' ? (
            <button 
              onClick={joinMatchmaking}
              className="w-full bg-[#C5CEAE] hover:bg-[#F0E2A4] text-[#121212] font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-colors text-lg"
            >
              <Play fill="currentColor" /> FIND MATCH
            </button>
          ) : (
            <div className="w-full bg-[#FDFBF7] dark:bg-[#252525] border border-[#333] text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#BC4A54]" size={24} />
              Searching for opponent...
              <button onClick={cancelSearch} className="text-slate-500 text-xs hover:text-white mt-2 underline">Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === 'active' || status === 'waiting_for_results') {
    const question = duelData?.questions[currentQIndex];

    return (
      <div className="flex-1 bg-[#FDFBF7] dark:bg-[#121212] flex flex-col relative">
        {/* Duel Header: Progress Bars */}
        <div className="bg-white dark:bg-[#1A1A1A] border-b border-[#333] p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
          {/* My Progress */}
          <div className="flex-1 mr-3 md:mr-8">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-[#BC4A54]">YOU</span>
              <span className="text-white">{myScore} XP</span>
            </div>
            <div className="h-3 w-full bg-[#FDFBF7] dark:bg-[#252525] rounded-full overflow-hidden">
              <div className="h-full bg-[#C5CEAE] transition-all duration-300" style={{ width: `${myProgress}%` }}></div>
            </div>
          </div>
          
          <div className="w-8 h-8 md:w-12 md:h-12 shrink-0 bg-[#FDFBF7] dark:bg-[#252525] rounded-full border-2 border-[#BCA297]/50 flex items-center justify-center shadow-[0_0_15px_rgba(188,162,151,0.2)]">
            <Swords className="text-[#BCA297] w-4 h-4 md:w-5 md:h-5" />
          </div>

          {/* Opponent Progress */}
          <div className="flex-1 ml-3 md:ml-8">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-[#BC4A54]">{opponentName}</span>
              <span className="text-white">{opponentScore} XP</span>
            </div>
            <div className="h-3 w-full bg-[#FDFBF7] dark:bg-[#252525] rounded-full overflow-hidden flex justify-end">
              <div className="h-full bg-[#BC4A54] transition-all duration-300" style={{ width: `${opponentProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 p-4 md:p-12 overflow-y-auto flex justify-center">
          {status === 'waiting_for_results' ? (
             <div className="text-center mt-20">
               <Loader2 className="animate-spin text-[#BC4A54] mx-auto mb-4" size={48} />
               <h2 className="text-2xl font-bold text-white mb-2">You Finished!</h2>
               <p className="text-gray-500 dark:text-gray-400">Waiting for {opponentName} to finish...</p>
             </div>
          ) : (
            <div className="max-w-3xl w-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#FDFBF7] dark:bg-[#252525] text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full border border-[#333]">
                  Question {currentQIndex + 1} of {duelData.questions.length}
                </span>
                <span className="bg-[#C5CEAE]/10 text-[#BC4A54] text-xs font-bold px-3 py-1 rounded-full border border-[#BC4A54]/20">
                  +{question.xp} XP
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                {question.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((opt, idx) => {
                  let btnClass = "bg-white dark:bg-[#1A1A1A] border-[#333] hover:border-[#BCA297] text-gray-700 dark:text-gray-300";
                  let Icon = null;

                  if (selectedOption !== null) {
                    if (idx === question.correct) {
                      btnClass = "bg-[#C5CEAE]/20 border-[#BC4A54] text-[#BC4A54]";
                      Icon = CheckCircle2;
                    } else if (idx === selectedOption) {
                      btnClass = "bg-[#BC4A54]/20 border-[#AB526B] text-[#BC4A54]";
                      Icon = X;
                    } else {
                      btnClass = "bg-white dark:bg-[#1A1A1A] border-[#333] text-slate-500 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleOptionSelect(idx)}
                      className={`text-left p-5 rounded-xl border-2 font-medium transition-all duration-200 flex justify-between items-center ${btnClass}`}
                    >
                      {opt}
                      {Icon && <Icon size={20} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === 'finished') {
    const isWinner = results.winnerId === socket.id;
    const isTie = results.winnerId === 'tie';
    
    return (
      <div className="flex-1 bg-[#FDFBF7] dark:bg-[#121212] p-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-[#1A1A1A] border border-[#333] rounded-2xl p-8 text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${isWinner ? 'bg-[#C5CEAE]/20 border-4 border-[#BC4A54]' : isTie ? 'bg-[#D3DFC8] dark:bg-[#3A4A2F]/20 border-4 border-[#BCA297]' : 'bg-[#BC4A54]/20 border-4 border-[#AB526B]'}`}>
            {isWinner ? <Trophy size={48} className="text-[#BC4A54]" /> : <Swords size={48} className="text-[#BC4A54]" />}
          </div>
          
          <h2 className="text-4xl font-black text-white mb-2">
            {isWinner ? 'VICTORY!' : isTie ? 'DRAW' : 'DEFEAT'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {isWinner ? 'You proved your dominance.' : isTie ? 'A true stalemate.' : `${opponentName} was faster.`}
          </p>

          <div className="bg-[#FDFBF7] dark:bg-[#252525] rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#333]">
              <span className="font-bold text-[#BC4A54]">YOU</span>
              <span className="font-mono text-white">{results.results[socket.id]?.score} XP</span>
              <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{Math.floor(results.results[socket.id]?.time / 1000)}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#BC4A54]">{opponentName}</span>
              <span className="font-mono text-white">{results.results[opponentId]?.score} XP</span>
              <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{Math.floor(results.results[opponentId]?.time / 1000)}s</span>
            </div>
          </div>

          <button onClick={() => setStatus('lobby')} className="w-full bg-[#FDFBF7] dark:bg-[#252525] hover:bg-[#333] text-white font-bold py-3 rounded-lg mb-3 transition-colors">
            Play Again
          </button>
          <button onClick={onBack} className="w-full text-gray-500 dark:text-gray-400 hover:text-white font-bold py-3 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}
