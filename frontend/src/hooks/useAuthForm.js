import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import { extractErrorMessage } from '../utils/formatters';

/**
 * Custom Hook: useAuthForm
 * Encapsulates authentication form state, validation, DevBuddy mood transitions,
 * demo login, and API orchestration using authService and AuthContext.
 */
export function useAuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  const redirectMessage = location.state?.message;
  const returnDestination = location.state?.from || '/oop';

  const [isLogin, setIsLogin] = useState(() => location.state?.mode !== 'signup');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  // Character Mood State Machine: 'idle' | 'thinking' | 'peek' | 'success' | 'fail' | 'missing_input'
  const [mood, setMood] = useState('idle');
  const moodLockRef = useRef(false);

  useEffect(() => {
    if (location.state?.mode === 'signup') {
      setIsLogin(false);
    } else if (location.state?.mode === 'login') {
      setIsLogin(true);
    }
  }, [location.state?.mode]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handlePasswordFocus = useCallback(() => {
    if (moodLockRef.current) return;
    setMood('peek');
  }, []);

  const handlePasswordBlur = useCallback(() => {
    if (moodLockRef.current) return;
    setMood('idle');
  }, []);

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
    moodLockRef.current = true;
    setMood('thinking');

    try {
      let data;
      if (isLogin) {
        data = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        data = await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }

      // Success mood & feedback
      setMood('success');
      setSuccessMsg(
        isLogin
          ? 'Authentication verified! Entering universe...'
          : 'Identity created! Welcome to CodeNova.'
      );

      if (data.token && data.user) {
        authLogin(data.user, data.token);
      }

      setTimeout(() => {
        navigate(returnDestination, { replace: true });
      }, 1500);
    } catch (err) {
      setMood('fail');
      setError(extractErrorMessage(err, 'Authentication failed. Check your credentials.'));

      setTimeout(() => {
        moodLockRef.current = false;
        setMood('idle');
        setIsSubmitting(false);
      }, 1800);
    }
  };

  const handleDemoLogin = async () => {
    if (isSubmitting || isDemoSubmitting || moodLockRef.current) return;

    setError('');
    setSuccessMsg('');
    setIsDemoSubmitting(true);
    moodLockRef.current = true;
    setMood('thinking');

    try {
      const data = await authService.login({
        email: 'demo@codenova.dev',
        password: 'password123',
      });

      if (data.token && data.user) {
        authLogin(data.user, data.token);
      }
      setMood('success');
      setSuccessMsg('Demo credentials approved! Entering CodeNova...');

      setTimeout(() => {
        navigate(returnDestination, { replace: true });
      }, 1500);
    } catch (err) {
      setMood('fail');
      setError(extractErrorMessage(err, 'Demo login failed. Please try again.'));
      setTimeout(() => {
        moodLockRef.current = false;
        setMood('idle');
        setIsDemoSubmitting(false);
      }, 1800);
    }
  };

  return {
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
    returnDestination,
  };
}

export default useAuthForm;
