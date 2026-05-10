import { useColorScheme } from "react-native";
import { palette } from "@/theme/colors";
import { useAppStore } from "@/store";

export const useThemeColors = () => {
  const systemScheme = useColorScheme();
  const themeMode = useAppStore((state) => state.themeMode);
  const scheme = themeMode === "system" ? systemScheme ?? "light" : themeMode;

  return {
    scheme,
    isDark: scheme === "dark",
    colors: palette[scheme]
  };
};
