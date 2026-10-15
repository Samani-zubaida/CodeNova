import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, Mail, Sparkles } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided in the link. Please check the URL.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully! Your CodeNova account is now active.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification link is invalid or has expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Failed to connect to verification server. Please ensure the backend is running.');
      }
    };

    verifyToken();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail || isResending) return;

    setIsResending(true);
    setResendStatus('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail.trim() })
      });

      const data = await res.json();
      if (res.ok) {
        setResendStatus({ type: 'success', text: data.message || 'New verification email sent! Check your inbox.' });
      } else {
        setResendStatus({ type: 'error', text: data.message || 'Failed to resend verification link.' });
      }
    } catch (err) {
      setResendStatus({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden flex items-center justify-center p-4 relative select-none text-[#F4EBC3] font-sans"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#AB526B] rounded-full blur-[160px] opacity-15 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#7928CA] rounded-full blur-[170px] opacity-15 pointer-events-none" />

      <div
        className="rounded-3xl p-7 sm:p-9 relative overflow-hidden w-full max-w-[460px] z-10"
        style={{
          backgroundColor: 'rgba(18, 16, 22, 0.92)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(188, 162, 151, 0.28)',
          boxShadow: '0 25px 65px -10px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.04) inset',
        }}
      >
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#AB526B] via-[#F4EBC3] to-[#7928CA] opacity-80" />

        {/* Brand Tag */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#AB526B]/15 border border-[#AB526B]/40 text-[#C5CEAE] mb-3">
            <Sparkles size={12} className="text-[#F4EBC3]" />
            <span>CodeNova Identity Grid</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Email Verification</h1>
        </div>

        {/* Status Views */}
        {status === 'verifying' && (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="animate-spin mx-auto text-[#AB526B]" size={42} />
            <p className="text-sm font-semibold text-[#F4EBC3]">Verifying your developer credentials...</p>
            <p className="text-xs text-slate-400">Communicating with the security grid. Please hold on.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#C5CEAE]/15 border border-[#C5CEAE]/40 flex items-center justify-center mx-auto text-[#C5CEAE]">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Identity Verified!</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{message}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="w-full min-h-[46px] bg-gradient-to-r from-[#AB526B] via-[#c4617e] to-[#7928CA] hover:brightness-110 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all tracking-wider text-sm shadow-[0_6px_25px_rgba(171,82,107,0.35)] cursor-pointer"
            >
              <span>Sign In to CodeNova</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#AB526B]/15 border border-[#AB526B]/40 flex items-center justify-center mx-auto text-[#AB526B]">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-lg font-bold text-white">Verification Issue</h2>
              <p className="text-xs text-[#fca5a5] leading-relaxed">{message}</p>
            </div>

            {/* Resend Form */}
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-slate-300 mb-2 font-medium">Need a fresh verification link?</p>
              <form onSubmit={handleResend} className="space-y-3">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-[#BCA297]" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-[#AB526B] rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#AB526B]/20 hover:bg-[#AB526B]/35 border border-[#AB526B]/60 text-white flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isResending ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  <span>{isResending ? 'Dispatching...' : 'Resend Verification Email'}</span>
                </button>
              </form>

              {resendStatus && (
                <div className={`mt-2 p-2 rounded-lg text-[11px] font-medium ${resendStatus.type === 'success' ? 'bg-[#C5CEAE]/20 text-[#C5CEAE] border border-[#C5CEAE]/40' : 'bg-[#AB526B]/20 text-[#fca5a5] border border-[#AB526B]/40'}`}>
                  {resendStatus.text}
                </div>
              )}
            </div>

            <div className="text-center pt-2">
              <Link
                to="/auth"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Return to Authentication Page
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
