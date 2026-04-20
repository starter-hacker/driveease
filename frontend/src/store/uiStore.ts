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
  toggleTheme: () => void;
}

const applyTheme = (theme: 'dark' | 'light') => {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      notificationsPanelOpen: false,
      theme: 'dark',

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setNotificationsPanelOpen: (open) =>
        set({ notificationsPanelOpen: open }),

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },
    }),
    {
      name: 'driveease-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyTheme(state.theme);
      },
    },
  ),
);
