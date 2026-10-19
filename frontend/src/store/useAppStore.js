import { create } from 'zustand';

const initialTheme = localStorage.getItem('nova_theme') || 'light';

// Ensure root class matches initial theme
if (typeof document !== 'undefined') {
  document.documentElement.classList.remove('dark', 'warm');
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (initialTheme === 'warm') {
    document.documentElement.classList.add('warm');
  }
}

const useAppStore = create((set) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem('nova_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('nova_token') || localStorage.getItem('token') || null,
  theme: initialTheme,
  currentCodeOutput: '',
  isPlayingVisualizer: false,
  totalXP: 0,
  unlockedLevels: { ds: 1, algo: 1, oop: 1 },
  completedLevels: [],

  login: (user, token) => {
    localStorage.setItem('nova_user', JSON.stringify(user));
    localStorage.setItem('nova_token', token);
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('nova_user');
    localStorage.removeItem('nova_token');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  setUser: (user) => {
    localStorage.setItem('nova_user', JSON.stringify(user));
    set({ user });
  },

  setTheme: (newTheme) => {
    localStorage.setItem('nova_theme', newTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'warm');
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (newTheme === 'warm') {
        document.documentElement.classList.add('warm');
      }
    }
    set({ theme: newTheme });
  },

  toggleTheme: () => set((state) => {
    const next = state.theme === 'light' ? 'warm' : state.theme === 'warm' ? 'dark' : 'light';
    localStorage.setItem('nova_theme', next);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'warm');
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (next === 'warm') {
        document.documentElement.classList.add('warm');
      }
    }
    return { theme: next };
  }),

  setExecutionOutput: (output) => set({ currentCodeOutput: output }),
  setPlayingVisualizer: (isPlaying) => set({ isPlayingVisualizer: isPlaying }),
  addXP: (amount) => set((state) => ({ totalXP: state.totalXP + amount })),
  addCompletedLevel: (levelData) => set((state) => ({
    completedLevels: [levelData, ...state.completedLevels]
  })),
  unlockNextLevel: (subject) => set((state) => ({
    unlockedLevels: {
      ...state.unlockedLevels,
      [subject]: (state.unlockedLevels[subject] || 1) + 1
    }
  }))
}));

export default useAppStore;
