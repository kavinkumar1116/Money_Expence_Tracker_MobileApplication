import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const extra = Constants.expoConfig?.extra ?? {};
const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? "").trim();
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseAnonKey ?? "").trim();

const hasRealAnonKey = Boolean(supabaseAnonKey && supabaseAnonKey !== "your-supabase-anon-public-key" && supabaseAnonKey !== "placeholder-key");

export const hasSupabaseConfig = Boolean(supabaseUrl && hasRealAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);
