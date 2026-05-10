import type { Session } from "@supabase/supabase-js";
import type { StateCreator } from "zustand";
import { database } from "@/services/database";
import { hasSupabaseConfig, supabase } from "@/services/supabase";
import type { UserProfile } from "@/types/models";

export type AuthSlice = {
  session: Session | null;
  profile: UserProfile | null;
  authLoading: boolean;
  authError?: string;
  bootstrapAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; email: string; contactNumber: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const getAuthErrorMessage = (error: unknown, fallback: string) => {
  const message = error instanceof Error ? error.message : fallback;
  const normalized = message.toLowerCase();

  if (normalized.includes("email signups are disabled")) {
    return "Email signups are disabled in Supabase. Enable new users and the Email provider in Authentication settings.";
  }

  return message;
};

export const createAuthSlice: StateCreator<any, [], [], AuthSlice> = (set) => ({
  session: null,
  profile: null,
  authLoading: false,
  authError: undefined,

  bootstrapAuth: async () => {
    if (!hasSupabaseConfig) return;
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    set({
      session: data.session ?? null,
      profile: user
        ? {
            id: user.id,
            name: user.user_metadata?.name ?? "User",
            email: user.email ?? "",
            contactNumber: user.user_metadata?.contact_number,
            createdAt: user.created_at
          }
        : null
    });
  },

  signIn: async (email, password) => {
    set({ authLoading: true, authError: undefined });
    try {
      if (!hasSupabaseConfig) {
        throw new Error("Supabase is not configured. Add your real anon public key to .env and restart Expo.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      set({
        session: data.session ?? null,
        profile: data.user
          ? {
              id: data.user.id,
              name: data.user.user_metadata?.name ?? "User",
              email: data.user.email ?? email,
              contactNumber: data.user.user_metadata?.contact_number,
              createdAt: data.user.created_at
            }
          : null
      });
    } catch (error) {
      set({ authError: getAuthErrorMessage(error, "Unable to sign in") });
      throw error;
    } finally {
      set({ authLoading: false });
    }
  },

  register: async ({ name, email, contactNumber, password }) => {
    set({ authLoading: true, authError: undefined });
    try {
      if (!hasSupabaseConfig) {
        throw new Error("Supabase is not configured. Add your real anon public key to .env and restart Expo.");
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name, contact_number: contactNumber } }
      });
      if (error) throw error;
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          name,
          email: data.user.email ?? email,
          contactNumber,
          createdAt: data.user.created_at
        };
        if (!data.session) {
          set({ session: null, profile: null });
          throw new Error("Email confirmation is enabled in Supabase. Turn it off in Authentication settings, then create the account again.");
        }
        await database.upsertProfile(profile);
        set({ session: data.session, profile });
      }
    } catch (error) {
      set({ authError: getAuthErrorMessage(error, "Unable to register") });
      throw error;
    } finally {
      set({ authLoading: false });
    }
  },

  signOut: async () => {
    if (hasSupabaseConfig) {
      await supabase.auth.signOut();
    }
    set({ session: null, profile: null, months: [], bankMasters: [], monthBanks: [], transactions: [] });
  }
});
