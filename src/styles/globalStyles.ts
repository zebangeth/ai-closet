import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = {
  regular: "PlusJakartaSans-Regular",
  medium: "PlusJakartaSans-Medium",
  semiBold: "PlusJakartaSans-SemiBold",
  bold: "PlusJakartaSans-Bold",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  titleText: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_gray,
  },
  bodyText: {
    fontFamily: typography.regular,
    fontSize: 16,
    color: colors.text_primary,
  },
});
