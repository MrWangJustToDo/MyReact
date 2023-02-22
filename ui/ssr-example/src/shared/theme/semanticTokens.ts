import type { ChakraTheme } from "@chakra-ui/react";

export const semanticTokens: ChakraTheme["semanticTokens"] = {
  colors: {
    mobileCardBackgroundColor: {
      default: "white",
      _dark: "gray.700",
    },
    cardBackgroundColor: {
      default: "whiteAlpha.500",
      _dark: "blackAlpha.600",
    },
    mobileModalColor: {
      default: "rgb(220, 220, 220)",
      _dark: "gray.700",
    },
    cardBorderColor: {
      default: "gray.300",
      _dark: "gray.600",
    },
    lightTextColor: {
      default: "gray.600",
      _dark: "gray.400",
    },
    siteBackgroundColor: {
      default: "rgba(250, 250, 250, 0.8)",
      _dark: "rgba(24, 24, 24, 0.2)",
    },
  },
};
