import { extendTheme } from "native-base";
const customTheme = {
  colors: {
    primary: {
      50: "#dcf8ff",
      100: "#b2e5fe",
      200: "#85d2f7",
      300: "#58c0f2",
      400: "#2caeec",
      500: "#1394d3",
      600: "#0273a5",
      700: "#005277",
      800: "#00324a",
      900: "#00121e",
    },
    fontConfig: {
      Roboto: {
        100: {
          normal: "Inter_100Thin",
        },
        200: {
          normal: "Inter_200ExtraLight",
        },
        300: {
          normal: "Inter_300Light",
        },
        400: {
          normal: "Inter_400Regular",
        },
        500: {
          normal: "Inter_500Medium",
        },
        600: {
          normal: "Inter_600SemiBold",
        },
        700: {
          normal: "Inter_700Bold",
        },
        800: {
          normal: "Inter_800ExtraBold",
        },
        900: {
          normal: "Inter_900Black",
        },
      },
    },
  },
};
export default extendTheme(customTheme);
