import { create } from 'zustand';
import type { ViewId } from '@/types';

interface AppState {
  currentView: ViewId;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  selectedRepositoryId: string | null;

  setCurrentView: (view: ViewId) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSelectedRepositoryId: (id: string | null) => void;
  navigateToApp: () => void;
  navigateToHome: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  sidebarOpen: false,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  selectedRepositoryId: 'repo-1',

  setCurrentView: (view) => set({ currentView: view, sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setSelectedRepositoryId: (id) => set({ selectedRepositoryId: id }),

  navigateToApp: () => set({ currentView: 'dashboard' }),
  navigateToHome: () => set({ currentView: 'home' }),
}));