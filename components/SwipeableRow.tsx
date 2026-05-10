import type { PropsWithChildren } from "react";
import { Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Trash2 } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = PropsWithChildren<{
  onDelete: () => void;
}>;

export function SwipeableRow({ children, onDelete }: Props) {
  const { colors } = useThemeColors();

  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable onPress={onDelete} style={{ backgroundColor: colors.danger }} className="mb-4 w-24 items-center justify-center rounded-3xl">
          <Trash2 color="#fff" size={22} />
          <Text className="mt-1 text-xs font-bold text-white">Delete</Text>
        </Pressable>
      )}
    >
      <View>{children}</View>
    </Swipeable>
  );
}
