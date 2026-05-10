import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useThemeColors } from "@/hooks/useThemeColors";

interface DropdownProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  options?: Array<{ label: string; value: string }>;
}

export function Dropdown({ label, value, onChangeText, options = [] }: DropdownProps) {
  const { colors } = useThemeColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: 12,
        },
        label: {
          fontSize: 12,
          fontWeight: "600",
          color: colors.muted,
          marginBottom: 8,
          textTransform: "uppercase",
        },
        pickerContainer: {
          borderRadius: 8,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        },
        picker: {
          color: colors.text,
          backgroundColor: colors.card,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <Picker selectedValue={value} onValueChange={onChangeText} style={styles.picker}>
          <Picker.Item label="Select an option" value="" />
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
