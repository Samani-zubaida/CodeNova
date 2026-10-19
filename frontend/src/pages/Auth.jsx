import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import DevBuddy from '../components/auth/DevBuddy';
import HoldingCardBuddy from '../components/auth/HoldingCardBuddy';
import useAuthForm from '../hooks/useAuthForm';

export default function Auth() {
  const {
    isLogin,
    setIsLogin,
    formData,
    handleInputChange,
    showPassword,
    toggleShowPassword,
    error,
    successMsg,
    isSubmitting,
    isDemoSubmitting,
    mood,
    handlePasswordFocus,
    handlePasswordBlur,
    handleSubmit,
    handleDemoLogin,
    redirectMessage,
  } = useAuthForm();

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

  // Reusable Dark Glassmorphic Login Card (Guaranteed Dark Theme & High Contrast)
  const renderCard = () => (
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
            id="demo-login-btn"
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

      {/* Redirect / Protection Notice */}
      {redirectMessage && !error && !successMsg && (
        <div className="mb-3 p-2.5 rounded-xl text-xs font-semibold bg-amber-500/15 border border-amber-400/40 text-amber-200 flex items-center gap-2 animate-fadeIn shadow-sm">
          <Lock size={14} className="text-amber-400 shrink-0" />
          <span>{redirectMessage}</span>
        </div>
      )}

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
              onChange={(e) => handleInputChange('username', e.target.value)}
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
            onChange={(e) => handleInputChange('email', e.target.value)}
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
              onClick={toggleShowPassword}
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
            onChange={(e) => handleInputChange('password', e.target.value)}
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
          {isLogin ? 'No identity yet?' : 'Already registered?'}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
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
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#AB526B] rounded-full blur-[160px] opacity-15 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#7928CA] rounded-full blur-[170px] opacity-15 pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] bg-[#C5CEAE] rounded-full blur-[180px] opacity-8 pointer-events-none" />

      {/* Adaptive fixed layout */}
      {isHeldCardLayout ? (
        /* Mobile / Tablet / Short screen */
        <div className="w-full max-w-[360px] mx-auto flex flex-col items-center justify-center z-10">
          <HoldingCardBuddy mood={mood}>
            {renderCard()}
          </HoldingCardBuddy>
        </div>
      ) : (
        /* Desktop / Large screen */
        <div className="w-full max-w-5xl mx-auto flex flex-row items-center justify-center gap-8 lg:gap-14 xl:gap-20 z-10 py-4">
          {/* Column 1: Dev Buddy */}
          <div className="w-full flex flex-col items-center justify-center shrink-0 max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[340px] xl:max-w-[360px]">
            <DevBuddy mood={mood} isPasswordVisible={showPassword} />

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

          {/* Column 2: Login Card */}
          <div className="w-full max-w-[380px] lg:max-w-[400px] shrink-0">
            {renderCard()}
          </div>
        </div>
      )}
    </div>
  );
}
