import { DefaultTheme } from "@react-navigation/native";
import theme from "./theme";

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary[500],
    background: theme.colors.white,
  },
};
