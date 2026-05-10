import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { WalletCards } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

export function AppLogo() {
  const { colors } = useThemeColors();

  return (
    <Animated.View entering={FadeInDown.duration(520).springify()} className="items-center">
      <View className="h-20 w-20 items-center justify-center rounded-3xl bg-mint/90 shadow-lg">
        <WalletCards color="#071311" size={38} strokeWidth={2.4} />
      </View>
      <Text style={{ color: colors.text }} className="mt-5 text-center text-3xl font-extrabold">
        MonthWise
      </Text>
      <Text style={{ color: colors.muted }} className="mt-2 text-center text-sm">
        Premium monthly expense command center
      </Text>
    </Animated.View>
  );
}
