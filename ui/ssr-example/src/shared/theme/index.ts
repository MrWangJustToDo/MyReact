import { extendTheme } from "@chakra-ui/react";

import { semanticTokens } from "./semanticTokens";
import { styles } from "./styles";

import type { ChakraTheme } from "@chakra-ui/react";

export const theme: Partial<ChakraTheme> = extendTheme({
  styles,
  semanticTokens,
  fonts: {
    heading: "Josefin Sans",
    body: "Josefin Sans",
    mono: "Josefin Sans",
  },
});
