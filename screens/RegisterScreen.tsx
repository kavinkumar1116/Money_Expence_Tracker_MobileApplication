import { useMemo, useState } from "react";
import { Alert, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeInUp } from "react-native-reanimated";
import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react-native";
import { AppLogo } from "@/components/AppLogo";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";
import type { AuthStackParamList } from "@/types/navigation";
import { isEmail, normalizePhone, validateRequired } from "@/utils/validation";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const register = useAppStore((state) => state.register);
  const authLoading = useAppStore((state) => state.authLoading);
  const { colors } = useThemeColors();

  const errors = useMemo(
    () => ({
      name: validateRequired(name, "Name"),
      email: validateRequired(email, "Email") ?? (!isEmail(email) ? "Enter a valid email" : undefined),
      contactNumber: validateRequired(contactNumber, "Contact number"),
      password: validateRequired(password, "Password") ?? (password.length < 6 ? "Use at least 6 characters" : undefined),
      confirmPassword: confirmPassword !== password ? "Passwords do not match" : undefined
    }),
    [confirmPassword, contactNumber, email, name, password]
  );

  const canSubmit = Object.values(errors).every((item) => !item);

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!canSubmit) return;
    try {
      await register({ name, email, contactNumber: normalizePhone(contactNumber), password });
    } catch (error) {
      Alert.alert("Registration failed", error instanceof Error ? error.message : "Please try again.");
    }
  };

  return (
    <Screen scroll keyboard contentClassName="py-8">
      <AppLogo />
      <Animated.View entering={FadeInUp.delay(120).duration(520).springify()} className="mt-8">
        <TextField label="Name" icon={UserRound} value={name} onChangeText={setName} error={submitted ? errors.name : undefined} />
        <TextField
          label="Email"
          icon={Mail}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          error={submitted ? errors.email : undefined}
        />
        <TextField
          label="Contact number"
          icon={Phone}
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
          error={submitted ? errors.contactNumber : undefined}
        />
        <TextField
          label="Password"
          icon={LockKeyhole}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={submitted ? errors.password : undefined}
        />
        <TextField
          label="Confirm password"
          icon={LockKeyhole}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={submitted ? errors.confirmPassword : undefined}
        />
        <PrimaryButton title="Create Account" loading={authLoading} onPress={handleSubmit} />
        <Text onPress={() => navigation.goBack()} style={{ color: colors.primary }} className="mt-5 text-center text-sm font-extrabold">
          Back to Sign In
        </Text>
      </Animated.View>
    </Screen>
  );
}
