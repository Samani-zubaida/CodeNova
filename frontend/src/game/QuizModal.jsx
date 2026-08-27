import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, ShieldQuestion } from 'lucide-react';

export default function QuizModal({ quiz, onPass, onClose }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = quiz.questions || [
    {
      question: `Which of the following best describes a key feature of ${quiz.title}?`,
      options: ['Constant time complexity', 'First-In-First-Out processing', 'Linear memory allocation', 'Sequential node linking'],
      correct: 3 
    },
    {
      question: `What is the primary drawback of a standard ${quiz.title}?`,
      options: ['Difficult to sort', 'Slow search operations', 'Excessive memory overhead', 'Requires contiguous memory'],
      correct: 1
    }
  ];

  const currentQ = questions[currentQuestionIndex];

  const handleSelect = (idx) => {
    if (!isAnswerChecked) setSelectedAnswer(idx);
  };

  const handleCheck = () => {
    if (selectedAnswer === currentQ.correct) {
      setScore(s => s + 1);
    }
    setIsAnswerChecked(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleFinish = () => {
    if (score === questions.length) {
      onPass();
    } else {
      onClose(); // Failed
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-sky-900/40 backdrop-blur-sm p-4 select-none font-sans"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="bg-white rounded-[2rem] w-full max-w-2xl relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-4 border-white"
      >
        {/* Header */}
        <div className="p-6 bg-blue-50 border-b-2 border-blue-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl shadow-inner text-white">
              <ShieldQuestion size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Challenge: {quiz.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 shadow-sm transition-all">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="p-8">
          {!quizFinished ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex gap-2">
                  {questions.map((_, i) => (
                    <div key={i} className={`h-2.5 w-8 rounded-full ${i <= currentQuestionIndex ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-800 mb-8 leading-snug">{currentQ.question}</h3>

              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentQ.correct;
                  
                  let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center font-bold text-lg ";
                  
                  if (!isAnswerChecked) {
                    btnClass += isSelected 
                      ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md transform scale-[1.02]" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm";
                  } else {
                    if (isCorrect) {
                      btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md";
                    } else if (isSelected && !isCorrect) {
                      btnClass += "bg-rose-50 border-rose-500 text-rose-800 shadow-md";
                    } else {
                      btnClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button 
                      key={idx} 
                      onClick={() => handleSelect(idx)}
                      disabled={isAnswerChecked}
                      className={btnClass}
                    >
                      <span>{opt}</span>
                      {isAnswerChecked && isCorrect && <CheckCircle2 size={24} className="text-emerald-500" strokeWidth={3} />}
                      {isAnswerChecked && isSelected && !isCorrect && <XCircle size={24} className="text-rose-500" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-end">
                {!isAnswerChecked ? (
                  <button 
                    onClick={handleCheck}
                    disabled={selectedAnswer === null}
                    className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] disabled:opacity-30 transition-all text-lg"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button 
                    onClick={handleNext}
                    className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-extrabold rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.3)] transition-all text-lg"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center bg-slate-50 shadow-inner border-2 border-slate-100">
                {score === questions.length ? (
                  <CheckCircle2 size={50} className="text-emerald-500 drop-shadow-sm" strokeWidth={3} />
                ) : (
                  <XCircle size={50} className="text-rose-500 drop-shadow-sm" strokeWidth={3} />
                )}
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 mb-2">
                {score === questions.length ? 'Perfect Score!' : 'Keep Practicing!'}
              </h3>
              <p className="text-slate-500 font-bold mb-10 text-lg">
                You got <span className={score === questions.length ? 'text-emerald-500' : 'text-rose-500'}>{score} out of {questions.length}</span> correct.
                {score !== questions.length && " You need all of them correct to unlock the next area!"}
              </p>
              <button 
                onClick={handleFinish}
                className={`px-12 py-5 font-extrabold rounded-2xl text-white transition-all shadow-xl text-xl ${
                  score === questions.length 
                    ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.3)]' 
                    : 'bg-slate-900 hover:bg-slate-800 shadow-[0_10px_25px_rgba(0,0,0,0.2)]'
                }`}
              >
                {score === questions.length ? 'Unlock Next Level' : 'Try Again Later'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
