import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  theme: 'light',
  currentCodeOutput: '',
  isPlayingVisualizer: false,
  totalXP: 0,
  unlockedLevels: { ds: 1, algo: 1, oop: 1 },
  completedLevels: [],
  
  setUser: (user) => set({ user }),
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

