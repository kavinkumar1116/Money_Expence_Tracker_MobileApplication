import { Pressable, Text, View } from "react-native";
import { Moon, Smartphone, Sun } from "lucide-react-native";
import type { ThemeMode } from "@/types/models";
import { useAppStore } from "@/store";
import { useThemeColors } from "@/hooks/useThemeColors";

const modes: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "system", label: "System", icon: Smartphone },
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon }
];

export function ThemeToggle() {
  const themeMode = useAppStore((state) => state.themeMode);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const { colors } = useThemeColors();

  return (
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="flex-row rounded-2xl border p-1">
      {modes.map(({ mode, label, icon: Icon }) => {
        const active = themeMode === mode;
        return (
          <Pressable
            key={mode}
            onPress={() => setThemeMode(mode)}
            style={{ backgroundColor: active ? colors.primary : "transparent" }}
            className="h-11 flex-1 flex-row items-center justify-center rounded-xl"
          >
            <Icon color={active ? colors.primaryText : colors.muted} size={16} />
            <Text style={{ color: active ? colors.primaryText : colors.text }} className="ml-2 text-xs font-bold">
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
