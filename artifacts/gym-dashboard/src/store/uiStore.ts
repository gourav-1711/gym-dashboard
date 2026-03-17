import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  activeFilter: string;
  searchQuery: string;
  setSidebarOpen: (open: boolean) => void;
  setActiveFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeFilter: "all",
  searchQuery: "",
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
