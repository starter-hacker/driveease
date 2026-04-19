// FILE: frontend/src/store/uiStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  notificationsPanelOpen: boolean;
  theme: 'dark' | 'light';
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setNotificationsPanelOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      notificationsPanelOpen: false,
      theme: 'dark',

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setNotificationsPanelOpen: (open) =>
        set({ notificationsPanelOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'driveease-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    },
  ),
);
