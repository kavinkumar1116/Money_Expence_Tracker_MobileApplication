import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createAuthSlice, type AuthSlice } from "@/store/slices/authSlice";
import { createExpenseSlice, type ExpenseSlice } from "@/store/slices/expenseSlice";
import { createThemeSlice, type ThemeSlice } from "@/store/slices/themeSlice";

export type AppState = AuthSlice & ExpenseSlice & ThemeSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createExpenseSlice(...args),
      ...createThemeSlice(...args)
    }),
    {
      name: "monthly-expense-tracker",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppState> | undefined;
        return {
          themeMode: state?.themeMode
        };
      },
      partialize: (state) => ({
        themeMode: state.themeMode
      })
    }
  )
);
