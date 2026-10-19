import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sync with zustand store
  const storeUser = useAppStore(state => state.user);
  const storeToken = useAppStore(state => state.token);
  const storeLogin = useAppStore(state => state.login);
  const storeLogout = useAppStore(state => state.logout);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nova_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('nova_token') || localStorage.getItem('token') || null;
  });

  // Critical: Start with isLoading true if token exists to validate session with backend
  const [isLoading, setIsLoading] = useState(() => {
    const existingToken = localStorage.getItem('nova_token') || localStorage.getItem('token');
    return Boolean(existingToken);
  });

  // Track if backend has confirmed authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Synchronize login state
  const login = useCallback((userData, jwtToken) => {
    localStorage.setItem('nova_user', JSON.stringify(userData));
    localStorage.setItem('nova_token', jwtToken);
    localStorage.setItem('token', jwtToken); // backward compatibility
    setUser(userData);
    setToken(jwtToken);
    setIsAuthenticated(true);
    setIsLoading(false);
    storeLogin(userData, jwtToken);
  }, [storeLogin]);

  // Synchronize logout state & invalidate token on server
  const logout = useCallback(async () => {
    const currentToken = localStorage.getItem('nova_token') || localStorage.getItem('token');
    if (currentToken) {
      try {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => {});
      } catch (e) {}
    }
    localStorage.removeItem('nova_user');
    localStorage.removeItem('nova_token');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    storeLogout();
    window.location.replace('/');
  }, [storeLogout]);

  // Validate session against backend on mount or token change
  useEffect(() => {
    const activeToken = localStorage.getItem('nova_token') || localStorage.getItem('token');

    if (!activeToken) {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      storeLogout();
      return;
    }

    let isMounted = true;

    const validateSession = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const verifiedUser = await res.json();
          if (isMounted) {
            setUser(verifiedUser);
            setToken(activeToken);
            setIsAuthenticated(true);
            setIsLoading(false);
            storeLogin(verifiedUser, activeToken);
          }
        } else {
          // Token is invalid, expired, or rejected by server
          console.warn('[Auth] Session validation failed (status:', res.status, '). Invalidating session.');
          if (isMounted) {
            logout();
          }
        }
      } catch (err) {
        console.warn('[Auth] Session validation network error:', err.message);
        // If server is unreachable, we do not mark as authenticated without server verification
        if (isMounted) {
          setIsLoading(false);
          setIsAuthenticated(false);
        }
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [login, logout, storeLogin, storeLogout]);

  /**
   * Centralized access-control action guard.
   * If authenticated: invokes actionCallback().
   * If not authenticated: intercepts interaction and navigates to /auth with return destination and message.
   *
   * @param {Function} [actionCallback] - Function to execute if authorized
   * @param {Object} [options] - Optional redirect configuration
   * @param {string} [options.from] - Custom return URL (defaults to current path + search)
   * @param {string} [options.message] - Custom notification message
   * @returns {boolean} Whether user was authenticated and action executed
   */
  const requireAuth = useCallback((actionCallback, options = {}) => {
    if (isAuthenticated) {
      if (typeof actionCallback === 'function') {
        actionCallback();
      }
      return true;
    }

    const currentDestination = options.from || (location.pathname + location.search);
    const message = options.message || 'Please log in first to access this feature.';

    navigate('/auth', {
      state: {
        from: currentDestination,
        message: message
      }
    });

    return false;
  }, [isAuthenticated, location, navigate]);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    requireAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Route-level guard for strictly private routes (e.g. host / management dashboards)
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-[#1C131A] text-[#2D1F23] dark:text-[#F4EBC3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#AB526B] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono font-bold tracking-wider">Verifying security session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/auth" 
        state={{ 
          from: location.pathname + location.search, 
          message: 'Please log in first to access this feature.' 
        }} 
        replace 
      />
    );
  }

  return children ? children : <Outlet />;
};

export default AuthContext;
