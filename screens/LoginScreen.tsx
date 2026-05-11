import { useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeInUp } from "react-native-reanimated";
import { LockKeyhole, Mail } from "lucide-react-native";
import { AppLogo } from "@/components/AppLogo";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";
import type { AuthStackParamList } from "@/types/navigation";
import { isEmail, validateRequired } from "@/utils/validation";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const signIn = useAppStore((state) => state.signIn);
  const authLoading = useAppStore((state) => state.authLoading);
  const { colors } = useThemeColors();

  const errors = useMemo(
    () => ({
      email: validateRequired(email, "Email") ?? (!isEmail(email) ? "Enter a valid email" : undefined),
      password: validateRequired(password, "Password")
    }),
    [email, password]
  );

  const canSubmit = !errors.email && !errors.password;

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!canSubmit) return;
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert("Sign in failed", error instanceof Error ? error.message : "Please try again.");
    }
  };

  return (
    <Screen scroll keyboard contentClassName="flex-grow justify-center py-8">
      <AppLogo />
      <Animated.View entering={FadeInUp.delay(120).duration(520).springify()} className="mt-10">
        <TextField
          label="Email"
          icon={Mail}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          error={submitted ? errors.email : undefined}
        />
        <TextField
          label="Password"
          icon={LockKeyhole}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          error={submitted ? errors.password : undefined}
        />
        <PrimaryButton title="Sign In" loading={authLoading} onPress={handleSubmit} />
        <View className="mt-4">
          <PrimaryButton title="Register Account" variant="secondary" onPress={() => navigation.navigate("Register")} />
        </View>
        <Pressable className="mt-5 items-center">
          <Text style={{ color: colors.muted }} className="text-center text-xs leading-5">
            Demo mode works without Supabase keys. Add `.env` values to enable live auth and PostgreSQL sync.
          </Text>
        </Pressable>
      </Animated.View>
    </Screen>
  );
}
