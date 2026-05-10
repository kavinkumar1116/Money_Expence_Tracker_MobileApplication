/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./navigation/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#071311",
        cream: "#F6F1E8",
        mint: "#45D0A4",
        lime: "#CFF769",
        coral: "#FF7867",
        gold: "#F5C96B",
        card: {
          light: "rgba(255,255,255,0.82)",
          dark: "rgba(16,28,27,0.78)"
        }
      },
      fontFamily: {
        sans: ["System"]
      }
    }
  },
  plugins: []
};
