import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Cpu, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAppStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email: formData.email.trim(), password: formData.password }
      : { username: formData.username.trim(), email: formData.email.trim(), password: formData.password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      if (data.token && data.user) {
        login(data.user, data.token);
        setSuccessMsg(isLogin ? 'Authentication verified! Entering the Grid...' : 'Identity initialized! Directing to Code Nova...');
        setTimeout(() => {
          navigate('/game');
        }, 600);
      } else {
        setIsLogin(true);
        setSuccessMsg('Account registered successfully! Please log in.');
      }
    } catch (err) {
      setError(err.message || 'Network error connecting to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setSuccessMsg('');
    setIsDemoLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@algoverse.io', password: 'demo1234' })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Demo authentication failed');
      }

      login(data.user, data.token);
      setSuccessMsg('Demo credentials approved! Entering Code Nova...');
      setTimeout(() => {
        navigate('/game');
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 relative overflow-hidden bg-[#0A0A0A]">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#AB526B] rounded-full blur-[140px] opacity-25 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#C5CEAE] rounded-full blur-[140px] opacity-15 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#121212] border border-[#BCA297]/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Header */}
          <div className="p-8 text-center border-b border-[#252525] relative">
            <div className="w-16 h-16 mx-auto bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-4 border border-[#AB526B]/50 shadow-[0_0_25px_rgba(171,82,107,0.35)]">
              <ShieldCheck size={34} className="text-[#AB526B]" />
            </div>
            <h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">
              {isLogin ? 'Access Portal' : 'Create Identity'}
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-sans">
              {isLogin ? 'Authenticate credentials to enter the Code Nova system.' : 'Initialize your new developer identity.'}
            </p>

            {/* Quick Demo Access pill */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isDemoLoading || isLoading}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#AB526B]/20 to-[#C5CEAE]/20 border border-[#AB526B]/40 text-[#C5CEAE] hover:bg-[#AB526B]/30 hover:border-[#AB526B] transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Sparkles size={13} className="text-[#F0E2A4]" />
                {isDemoLoading ? 'Authorizing Demo...' : '1-Click Demo Login (Instant)'}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-5">
            {/* Error banner */}
            {error && (
              <div className="p-4 rounded-xl text-xs font-semibold bg-[#AB526B]/15 border border-[#AB526B]/60 text-[#fca5a5] flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle size={16} className="text-[#AB526B] shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success banner */}
            {successMsg && (
              <div className="p-4 rounded-xl text-xs font-semibold bg-[#C5CEAE]/15 border border-[#C5CEAE]/60 text-[#C5CEAE] flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 size={16} className="text-[#C5CEAE] shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <User size={14} className="text-[#BCA297]" /> Developer Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-[#181818] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#AB526B] focus:ring-1 focus:ring-[#AB526B] transition-all text-sm"
                    placeholder="e.g. CodeNinja"
                  />
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={14} className="text-[#BCA297]" /> Email Designation
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#181818] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#AB526B] focus:ring-1 focus:ring-[#AB526B] transition-all text-sm"
                  placeholder="agent@matrix.com"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Lock size={14} className="text-[#BCA297]" /> Passcode
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={4}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[#181818] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#AB526B] focus:ring-1 focus:ring-[#AB526B] transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || isDemoLoading}
                className="w-full mt-2 bg-gradient-to-r from-[#AB526B] via-[#c4617e] to-[#8e4257] hover:brightness-110 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 uppercase tracking-widest text-sm shadow-[0_4px_20px_rgba(171,82,107,0.3)] cursor-pointer active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2"><Cpu className="animate-spin" size={18} /> Processing Credentials...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? 'Authenticate Session' : 'Register Identity'} <ArrowRight size={17} />
                  </span>
                )}
              </button>
            </form>
          </div>
          
          {/* Footer toggle */}
          <div className="bg-[#181818] p-5 text-center border-t border-[#262626]">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have access credentials?" : "Already registered identity?"}{' '}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                className="text-[#C5CEAE] font-bold hover:underline cursor-pointer ml-1"
              >
                {isLogin ? 'Request Access' : 'Authenticate Here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
