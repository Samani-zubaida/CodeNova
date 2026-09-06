import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('nova_user')) || null,
  token: localStorage.getItem('nova_token') || null,
  theme: 'light',
  currentCodeOutput: '',
  isPlayingVisualizer: false,
  totalXP: 0,
  unlockedLevels: { ds: 1, algo: 1, oop: 1 },
  completedLevels: [],
  
  login: (user, token) => {
    localStorage.setItem('nova_user', JSON.stringify(user));
    localStorage.setItem('nova_token', token);
    set({ user, token });
  },
  
  logout: () => {
    localStorage.removeItem('nova_user');
    localStorage.removeItem('nova_token');
    set({ user: null, token: null });
  },

  setUser: (user) => {
    localStorage.setItem('nova_user', JSON.stringify(user));
    set({ user });
  },
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
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

