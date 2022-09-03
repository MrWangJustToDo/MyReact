import { extendTheme } from "@chakra-ui/react";

export const theme: any = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: true },
  semanticTokens: {
    colors: {
      // 根据data-theme进行响应  不需要进行其他js计算
      text: {
        default: "gray.900",
        _light: "blue.600",
        _dark: "red.500",
      },
    },
  },
});
