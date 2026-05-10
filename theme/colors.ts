export const palette = {
  light: {
    background: "#F6F1E8",
    surface: "rgba(255,255,255,0.84)",
    surfaceStrong: "#FFFFFF",
    text: "#071311",
    muted: "#66706D",
    border: "rgba(7,19,17,0.12)",
    primary: "#0E7C66",
    primaryText: "#FFFFFF",
    accent: "#CFF769",
    danger: "#D94A3A",
    tab: "#FFFFFF"
  },
  dark: {
    background: "#071311",
    surface: "rgba(16,28,27,0.78)",
    surfaceStrong: "#101C1B",
    text: "#F6F1E8",
    muted: "#A6B0AC",
    border: "rgba(246,241,232,0.14)",
    primary: "#45D0A4",
    primaryText: "#071311",
    accent: "#F5C96B",
    danger: "#FF7867",
    tab: "#0D1A18"
  }
} as const;

export type AppColorScheme = keyof typeof palette;
