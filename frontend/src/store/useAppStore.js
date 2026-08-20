import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  theme: 'light',
  currentCodeOutput: '',
  isPlayingVisualizer: false,
  
  setUser: (user) => set({ user }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setExecutionOutput: (output) => set({ currentCodeOutput: output }),
  setPlayingVisualizer: (isPlaying) => set({ isPlayingVisualizer: isPlaying })
}));

export default useAppStore;
