import type { ChakraTheme } from "@chakra-ui/react";

export const styles: ChakraTheme["styles"] = {
  global: {
    body: {
      fontFamily: `Product Sans, sans-serif`,
    },
    ["h1, h2, h3, h4, h5, th, td"]: {
      fontFamily: "Product Sans, sans-serif",
    },
    "kbd, samp, pre": {
      fontFamily: "Product Sans, sans-serif",
    },
  },
};
