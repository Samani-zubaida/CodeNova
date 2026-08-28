import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  theme: 'light',
  currentCodeOutput: '',
  isPlayingVisualizer: false,
  totalXP: 0,
  
  setUser: (user) => set({ user }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setExecutionOutput: (output) => set({ currentCodeOutput: output }),
  setPlayingVisualizer: (isPlaying) => set({ isPlayingVisualizer: isPlaying }),
  addXP: (amount) => set((state) => ({ totalXP: state.totalXP + amount }))
}));

export default useAppStore;
