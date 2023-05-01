import { extendTheme } from "native-base";
const customTheme = {
  colors: {
    primary: {
      50: "#d2f4ff",
      100: "#b1def0",
      200: "#92c4d9",
      300: "#5596b0",
      400: "#5596b0",
      500: "#37839f",
      600: "#29748d",
      700: "#186077",
      800: "#064c61",
      900: "#003749",
    },
    unset: undefined
  },
  fontConfig: {
    Inter: {
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
  fonts: {
    heading: "Inter",
    body: "Inter",
    mono: "Inter",
  },
  components: {
    Input: {
      defaultProps: {
        _input: {
          selectionColor: "#b1def0",
          cursorColor: "#37839f",
        },
      },
    },
    TextArea: {
      defaultProps: {
        _input: {
          selectionColor: undefined,
          cursorColor: "#37839f",
        },
      },
    },
  },
};
export default extendTheme(customTheme);
