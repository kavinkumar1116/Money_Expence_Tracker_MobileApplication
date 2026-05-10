import "react-native-gesture-handler";
import "./global.css";

import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootNavigator } from "@/navigation/RootNavigator";
import { hasSupabaseConfig, supabase } from "@/services/supabase";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";

export default function App() {
  const bootstrapAuth = useAppStore((state) => state.bootstrapAuth);
  const session = useAppStore((state) => state.session);
  const refreshData = useAppStore((state) => state.refreshData);
  const { isDark } = useThemeColors();

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;
    refreshData(userId).catch((error) => console.warn("Unable to load Supabase data", error));
  }, [refreshData, session?.user?.id]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || !hasSupabaseConfig) return;

    const refreshUserData = () => {
      refreshData(userId).catch((error) => console.warn("Unable to sync Supabase data", error));
    };

    const filter = `user_id=eq.${userId}`;
    const channel = supabase
      .channel(`user-data-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "months", filter }, refreshUserData)
      .on("postgres_changes", { event: "*", schema: "public", table: "bank_masters", filter }, refreshUserData)
      .on("postgres_changes", { event: "*", schema: "public", table: "month_banks", filter }, refreshUserData)
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions", filter }, refreshUserData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshData, session?.user?.id]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}
