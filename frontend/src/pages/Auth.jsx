import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAppStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        login(data.user, data.token);
        navigate('/game');
      } else {
        // Auto-login after registration or just switch to login mode
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 relative overflow-hidden bg-[#0A0A0A]">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#AB526B] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C5CEAE] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#121212] border border-[#BCA297]/20 rounded-2xl shadow-2xl overflow-hidden clip-angled">
          
          {/* Header */}
          <div className="p-8 text-center border-b border-[#333]">
            <div className="w-16 h-16 mx-auto bg-[#252525] rounded-xl flex items-center justify-center mb-4 border border-[#AB526B]/50 shadow-[0_0_15px_rgba(171,82,107,0.3)]">
              <ShieldCheck size={32} className="text-[#AB526B]" />
            </div>
            <h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">
              {isLogin ? 'Access Portal' : 'Initialize User'}
            </h1>
            <p className="text-slate-400 mt-2 font-scifi">
              {isLogin ? 'Authenticate to enter the Code Nova system.' : 'Create a new identity in the system.'}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-bold border ${error.includes('successful') ? 'bg-[#C5CEAE]/10 border-[#C5CEAE]/50 text-[#C5CEAE]' : 'bg-[#AB526B]/10 border-[#AB526B]/50 text-[#AB526B]'}`}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User size={14} /> Username
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BCA297] transition-colors"
                    placeholder="e.g. Neo"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={14} /> Email Designation
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BCA297] transition-colors"
                  placeholder="agent@matrix.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Lock size={14} /> Passcode
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BCA297] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-gradient-to-r from-[#AB526B] to-[#8e4257] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 uppercase tracking-widest"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2"><Cpu className="animate-spin" size={18} /> Processing...</span>
                ) : (
                  <span className="flex items-center gap-2">{isLogin ? 'Authenticate' : 'Register'} <ArrowRight size={18} /></span>
                )}
              </button>
            </form>
          </div>
          
          {/* Footer toggle */}
          <div className="bg-[#181818] p-6 text-center border-t border-[#333]">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have access credentials?" : "Already hold an identity?"}{' '}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-[#C5CEAE] font-bold hover:underline"
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
