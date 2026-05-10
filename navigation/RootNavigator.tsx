import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { AppNavigator } from "@/navigation/AppNavigator";
import type { RootStackParamList } from "@/types/navigation";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const session = useAppStore((state) => state.session);
  const { colors, isDark } = useThemeColors();
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surfaceStrong,
      text: colors.text,
      border: colors.border,
      primary: colors.primary
    }
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
        {session ? <Stack.Screen name="App" component={AppNavigator} /> : <Stack.Screen name="Auth" component={AuthNavigator} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
