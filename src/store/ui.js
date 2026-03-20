// src/store/ui.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      // Which page is showing
      page: "overview",
      goTo: (page) => set({ page }),

      // Sidebar open/closed
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (val) => set({ sidebarOpen: val }),

      // Toast notifications
      toasts: [],
      notify: ({ type = "info", title, message, duration = 4000 }) => {
        const id = Math.random().toString(36).slice(2);
        set((s) => ({
          toasts: [
            ...s.toasts,
            { id, type, title, message, duration, createdAt: Date.now() },
          ],
        }));
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "aewmds",
      partialize: (s) => ({ sidebarOpen: s.sidebarOpen }),
    }
  )
);
