import type { StateCreator } from "zustand";
import type { ThemeMode } from "@/types/models";

export type ThemeSlice = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

export const createThemeSlice: StateCreator<any, [], [], ThemeSlice> = (set) => ({
  themeMode: "system",
  setThemeMode: (themeMode) => set({ themeMode })
});
