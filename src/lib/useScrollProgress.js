import { create } from 'zustand';

export const useScrollProgress = create((set) => ({
  progress: 0,
  pointer: { x: 0, y: 0 },
  setProgress: (progress) => set({ progress }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
}));
