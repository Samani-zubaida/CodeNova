import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import DevBuddy from '../components/auth/DevBuddy';
import HoldingCardBuddy from '../components/auth/HoldingCardBuddy';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Responsive Breakpoint: Trigger the "Holding the Card" fused pose on all viewports
  // where the buddy cannot be cleanly aligned horizontally side-by-side (< 1024px width OR < 680px height)
  const [isHeldCardLayout, setIsHeldCardLayout] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024 || window.innerHeight < 680;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsHeldCardLayout(window.innerWidth < 1024 || window.innerHeight < 680);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Character Mood State Machine: 'idle' | 'thinking' | 'peek' | 'success' | 'fail' | 'missing_input'
  const [mood, setMood] = useState('idle');
  const moodLockRef = useRef(false);

  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);

  // ── Guarded Mood Handlers ──
  const handlePasswordFocus = () => {
    if (moodLockRef.current) return;
    setMood('peek');
  };

  const handlePasswordBlur = () => {
    if (moodLockRef.current) return;
    setMood('idle');
  };

  // ── Form Submission with Multi-Emotion Handling ──
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting || isDemoSubmitting || moodLockRef.current) return;

    // 1. Missing Input Prompt Handling
    if (!formData.email.trim() || !formData.password || (!isLogin && !formData.username.trim())) {
      moodLockRef.current = true;
      setMood('missing_input');

      if (!isLogin && !formData.username.trim()) {
        setError('Please designate a developer handle.');
      } else if (!formData.email.trim()) {
        setError('Please enter your email designation.');
      } else {
        setError('Please enter your passcode.');
      }

      setTimeout(() => {
        moodLockRef.current = false;
        setMood('idle');
      }, 1800);
      return;
    }

    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    // 2. Lock mood to 'thinking' during request
    moodLockRef.current = true;
    setMood('thinking');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { email: formData.email.trim(), password: formData.password }
      : { username: formData.username.trim(), email: formData.email.trim(), password: formData.password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed. Please check credentials.');
      }

      // 3. Success: Fire celebratory bounce, smile, and thumbs-up
      setMood('success');
      setSuccessMsg(isLogin ? 'Authentication verified! Entering universe...' : 'Identity created! Welcome to CodeNova.');

      if (data.token && data.user) {
        login(data.user, data.token);
      }

      setTimeout(() => {
        navigate('/game');
      }, 1700);
    } catch (err) {
      // 4. Fail: Fire head shake, downward frown, and concerned eyebrows
      setMood('fail');
      setError(err.message || 'Authentication failed. Check your credentials.');

      setTimeout(() => {
        moodLockRef.current = false;
        setMood('idle');
        setIsSubmitting(false);
      }, 1800);
    }
  };

  // ── 1-Click Instant Demo Login ──
  const handleDemoLogin = async () => {
    if (isSubmitting || isDemoSubmitting || moodLockRef.current) return;

    setError('');
    setSuccessMsg('');
    setIsDemoSubmitting(true);
    moodLockRef.current = true;
    setMood('thinking');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'aanmirack@example.com', password: 'password123' }),
      });

      const data = await res.json();

      if (!res.ok) {
        const demoUser = { username: 'DemoExplorer', email: 'demo@codenova.dev', xp: 2500, streak: 5 };
        login(demoUser, 'demo_jwt_token_2026');
      } else {
        login(data.user, data.token);
      }

      setMood('success');
      setSuccessMsg('Demo credentials approved! Welcome to CodeNova.');

      setTimeout(() => {
        navigate('/game');
      }, 1700);
    } catch {
      const demoUser = { username: 'DemoExplorer', email: 'demo@codenova.dev', xp: 2500, streak: 5 };
      login(demoUser, 'demo_jwt_token_2026');
      setMood('success');
      setSuccessMsg('Offline demo approved! Welcome to CodeNova.');
      setTimeout(() => {
        navigate('/game');
      }, 1700);
    }
  };

  // Reusable Dark Glassmorphic Login Card (Guaranteed Dark Theme & High Contrast)
  const renderCard = (isHeldMode = false) => (
    <div
      className="auth-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 w-full"
      style={{
        backgroundColor: 'rgba(18, 16, 22, 0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(188, 162, 151, 0.28)',
        boxShadow: '0 20px 55px -10px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.04) inset',
      }}
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#AB526B] via-[#F4EBC3] to-[#7928CA] opacity-80" />

      {/* Header */}
      <div className="mb-2.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#AB526B]/15 border border-[#AB526B]/40 text-[#C5CEAE] mb-1.5">
          <Sparkles size={11} className="text-[#F4EBC3]" />
          <span>CodeNova Identity Grid</span>
        </div>
        <h1
          className="text-xl sm:text-2xl font-black tracking-tight"
          style={{ color: '#FFFFFF' }}
        >
          {isLogin ? 'Welcome Back' : 'Create Identity'}
        </h1>
        <p
          className="mt-0.5 text-xs leading-relaxed"
          style={{ color: 'rgba(244, 235, 195, 0.85)' }}
        >
          {isLogin
            ? 'Authenticate to enter the interactive 3D universe.'
            : 'Register developer handle to start coding.'}
        </p>

        {/* 1-Click Demo Login Pill */}
        <div className="mt-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isSubmitting || isDemoSubmitting}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-[#AB526B]/20 border border-[#BCA297]/30 hover:border-[#AB526B] text-[#F4EBC3] transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            title="Instant one-click demo login"
          >
            <Sparkles size={13} className="text-[#F0E2A4]" />
            <span>{isDemoSubmitting ? 'Authorizing Demo...' : '1-Click Instant Demo Login'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Status Feedback Slot */}
      {(error || successMsg) && (
        <div className="mb-2">
          {error && (
            <div className="w-full p-2 rounded-xl text-xs font-semibold bg-[#AB526B]/20 border border-[#AB526B]/60 text-[#fca5a5] flex items-center gap-2 animate-fadeIn">
              <AlertCircle size={14} className="text-[#AB526B] shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="w-full p-2 rounded-xl text-xs font-semibold bg-[#C5CEAE]/20 border border-[#C5CEAE]/60 text-[#C5CEAE] flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={14} className="text-[#C5CEAE] shrink-0" />
              <span className="truncate">{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Username field (only in Register mode) */}
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#E2E8F0' }}>
              <User size={12} className="text-[#BCA297]" /> Developer Handle
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="auth-glass-input w-full h-9 sm:h-10 rounded-xl px-3 text-white text-xs sm:text-sm"
              placeholder="e.g. CodeArchitect"
            />
          </div>
        )}

        {/* Email field */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#E2E8F0' }}>
            <Mail size={12} className="text-[#BCA297]" /> Email Designation
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="auth-glass-input w-full h-9 sm:h-10 rounded-xl px-3 text-white text-xs sm:text-sm"
            placeholder="developer@codenova.dev"
          />
        </div>

        {/* Password field (Triggers Dev Buddy peek state) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#E2E8F0' }}>
              <Lock size={12} className="text-[#BCA297]" /> Passcode
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              title={showPassword ? 'Hide passcode' : 'Show passcode'}
            >
              {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{showPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            className="auth-glass-input w-full h-9 sm:h-10 rounded-xl px-3 text-white text-xs sm:text-sm"
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isDemoSubmitting}
          className="w-full h-10 sm:h-10.5 mt-1 bg-gradient-to-r from-[#AB526B] via-[#c4617e] to-[#7928CA] hover:brightness-110 text-white font-bold px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 tracking-wider text-xs sm:text-sm shadow-[0_4px_20px_rgba(171,82,107,0.35)] cursor-pointer active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={15} /> Authenticating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {isLogin ? 'Sign In' : 'Create Identity'} <ArrowRight size={15} />
            </span>
          )}
        </button>
      </form>

      {/* Footer Mode Switcher */}
      <div className="mt-2.5 pt-2 border-t border-white/10 text-center">
        <p className="text-slate-400 text-xs">
          {isLogin ? "No identity yet?" : 'Already registered?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMsg('');
              setUnverifiedEmail('');
            }}
            className="text-[#C5CEAE] hover:text-white font-bold hover:underline cursor-pointer ml-1 transition-colors"
          >
            {isLogin ? 'Create One Here' : 'Sign In Instead'}
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden flex items-center justify-center p-2 sm:p-4 relative select-none text-[#F4EBC3] font-sans selection:bg-[#AB526B] selection:text-white"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* ── AMBIENT BACKGROUND GLOWS (Fixed in Viewport) ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#AB526B] rounded-full blur-[160px] opacity-15 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#7928CA] rounded-full blur-[170px] opacity-15 pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] bg-[#C5CEAE] rounded-full blur-[180px] opacity-8 pointer-events-none" />

      {/* ── ADAPTIVE FIXED LAYOUT ── */}
      {isHeldCardLayout ? (
        /* MOBILE / TABLET / SHORT-SCREEN: Fused "Holding the Card" Full-Body Layout */
        <div className="w-full max-w-[360px] mx-auto flex flex-col items-center justify-center z-10">
          <HoldingCardBuddy mood={mood}>
            {renderCard(true)}
          </HoldingCardBuddy>
        </div>
      ) : (
        /* DESKTOP / LARGE-SCREEN: Side-by-Side Horizontal Alignment with 3D Standing Character */
        <div className="w-full max-w-5xl mx-auto flex flex-row items-center justify-center gap-8 lg:gap-14 xl:gap-20 z-10 py-4">
          {/* COLUMN 1: FULL-BODY 3D DEV BUDDY CHARACTER */}
          <div className="w-full flex flex-col items-center justify-center shrink-0 max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[340px] xl:max-w-[360px]">
            <DevBuddy mood={mood} isPasswordVisible={showPassword} />

            {/* Character Presence Sub-badge */}
            <div className="flex items-center gap-2 mt-2 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#BCA297] tracking-wide shadow-xs">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  mood === 'success'
                    ? 'bg-[#C5CEAE]'
                    : mood === 'fail'
                    ? 'bg-[#AB526B]'
                    : 'bg-[#F0E2A4] animate-pulse'
                }`}
              />
              <span>Dev Buddy • {mood === 'idle' ? 'Ready to assist' : mood.replace('_', ' ')}</span>
            </div>
          </div>

          {/* COLUMN 2: GLASSMORPHIC LOGIN CARD */}
          <div className="w-full max-w-[380px] lg:max-w-[400px] shrink-0">
            {renderCard(false)}
          </div>
        </div>
      )}
    </div>
  );
}
