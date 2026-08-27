import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, Timer } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function QuizRunner({ subject, levelId, levelTitle, onBack, onLevelComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [codeValue, setCodeValue] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per level sequence
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/levels/${subject}/${levelId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch level data');
        return res.json();
      })
      .then(data => {
        setQuestions(data);
        if (data[0]?.type === 'code-editor') {
          setCodeValue(data[0].initialCode || '');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [subject, levelId]);

  // Timer logic
  useEffect(() => {
    if (loading || isTimedOut || feedback?.success || currentIndex >= questions.length) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isTimedOut, feedback, currentIndex, questions.length]);


  const currentQ = questions[currentIndex];

  const handleSubmit = () => {
    if (isTimedOut) return;

    if (currentQ.type === 'multiple-choice') {
      if (selectedOption === currentQ.answer) {
        setFeedback({ success: true, text: 'Correct!' });
        setTimeout(nextQuestion, 1500);
      } else {
        setFeedback({ success: false, text: 'Incorrect. Try again.' });
      }
    } else if (currentQ.type === 'code-editor') {
      const regex = new RegExp(currentQ.validationRegex);
      if (regex.test(codeValue)) {
        setFeedback({ success: true, text: currentQ.successMessage || 'Tests Passed!' });
        setTimeout(nextQuestion, 2000);
      } else {
        setFeedback({ success: false, text: 'Compilation failed or logic incorrect.' });
      }
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      if (nextQ.type === 'code-editor') {
        setCodeValue(nextQ.initialCode || '');
      }
      setCurrentIndex(prev => prev + 1);
    } else {
      // Level completed!
      onLevelComplete(levelId);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-8 font-bold text-xl bg-slate-900 rounded-2xl border border-red-500 shadow-2xl">Network Error: Is the backend server running?</div>;
  }

  if (isTimedOut) {
    return (
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-red-500 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
        <h2 className="text-5xl font-black text-red-500 mb-6">TIME OUT</h2>
        <p className="text-slate-300 text-xl mb-12">The system detected you and locked you out.</p>
        <button 
          onClick={onBack}
          className="px-8 py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700 w-full"
        >
          Disconnect & Run
        </button>
      </div>
    )
  }

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white bg-slate-800 px-6 py-3 rounded-full border border-slate-700">
          {levelTitle} - Challenge {currentIndex + 1} of {questions.length}
        </h2>
        
        {/* Timer */}
        <div className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xl border shadow-lg ${
          timeLeft <= 10 
            ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse' 
            : 'bg-slate-800 text-white border-slate-700'
        }`}>
          <Timer size={24} className={timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'} />
          {timeLeft}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-8">
        <div 
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="w-full relative overflow-hidden bg-slate-800 border-2 border-slate-700 rounded-2xl shadow-2xl min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute inset-0 p-8 flex flex-col"
          >
            <h3 className="text-2xl text-white mb-8 font-semibold">{currentQ.question}</h3>

            {currentQ.type === 'multiple-choice' && (
              <div className="flex flex-col gap-4 flex-1">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-5 rounded-xl text-left font-medium transition-all border-2 text-lg ${
                      selectedOption === idx 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 transform scale-[1.02]' 
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'code-editor' && (
              <div className="flex-1 rounded-xl overflow-hidden border-2 border-slate-700 mb-4 shadow-inner">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={codeValue}
                  onChange={(val) => setCodeValue(val)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    padding: { top: 24 }
                  }}
                />
              </div>
            )}

            {/* Footer / Submission */}
            <div className="mt-auto pt-6 border-t border-slate-700 flex items-center justify-between">
              <div className="flex-1">
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-bold flex items-center gap-2 text-lg ${feedback.success ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {feedback.success && <CheckCircle2 size={24} />}
                    {feedback.text}
                  </motion.div>
                )}
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={feedback?.success || (currentQ.type === 'multiple-choice' && selectedOption === null)}
                className="px-8 py-4 rounded-xl font-bold bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-3 text-lg"
              >
                Run System <Play size={20} fill="currentColor" />
              </button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
