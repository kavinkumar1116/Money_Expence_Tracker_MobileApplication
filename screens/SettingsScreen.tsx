import { Pressable, Text, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Menu } from "lucide-react-native";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useThemeColors } from "@/hooks/useThemeColors";

export function SettingsScreen() {
  const navigation = useNavigation();
  const { colors } = useThemeColors();

  return (
    <Screen scroll contentClassName="py-5">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text style={{ color: colors.muted }} className="text-sm font-semibold">
            Preferences
          </Text>
          <Text style={{ color: colors.text }} className="mt-1 text-3xl font-black">
            Settings
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ backgroundColor: colors.surfaceStrong }}
          className="h-12 w-12 items-center justify-center rounded-2xl"
        >
          <Menu color={colors.text} size={22} />
        </Pressable>
      </View>
      <GlassCard className="p-5">
        <Text style={{ color: colors.text }} className="text-lg font-extrabold">
          Theme
        </Text>
        <Text style={{ color: colors.muted }} className="mb-4 mt-1 text-sm leading-6">
          Follow the device theme or lock the app to a manual mode.
        </Text>
        <ThemeToggle />
      </GlassCard>
    </Screen>
  );
}
