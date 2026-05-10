import { Text, View } from "react-native";
import { Mail, Phone, UserRound } from "lucide-react-native";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";

export function ProfileScreen() {
  const profile = useAppStore((state) => state.profile);
  const { colors } = useThemeColors();

  return (
    <Screen scroll contentClassName="py-5">
      <Text style={{ color: colors.text }} className="text-3xl font-black">
        Profile
      </Text>
      <GlassCard className="mt-6 p-5">
        <View className="items-center">
          <View style={{ backgroundColor: colors.primary }} className="h-20 w-20 items-center justify-center rounded-3xl">
            <UserRound color={colors.primaryText} size={34} />
          </View>
          <Text style={{ color: colors.text }} className="mt-4 text-2xl font-black">
            {profile?.name ?? "User"}
          </Text>
        </View>
        <View className="mt-6">
          <View className="mb-4 flex-row items-center">
            <Mail color={colors.primary} size={18} />
            <Text style={{ color: colors.text }} className="ml-3 text-base font-semibold">
              {profile?.email ?? "No email"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Phone color={colors.primary} size={18} />
            <Text style={{ color: colors.text }} className="ml-3 text-base font-semibold">
              {profile?.contactNumber || "No contact number"}
            </Text>
          </View>
        </View>
      </GlassCard>
    </Screen>
  );
}
