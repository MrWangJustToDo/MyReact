import { ColorModeScript, ChakraProvider, cookieStorageManager } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { App } from "components/App";
import { createEmotionCache } from "config/createEmotionCache";
import { theme } from "theme";

import type { createUniversalStore } from "store";

const cache = createEmotionCache();

const Root = ({ store }: { store: ReturnType<typeof createUniversalStore> }) => {
  console.warn("you are using chakra UI component library!");

  const cookieStore = cookieStorageManager(store.getState().server.cookie.data);

  return (
    <StrictMode>
      <CacheProvider value={cache}>
        <ChakraProvider resetCSS theme={theme} colorModeManager={cookieStore}>
          <Provider store={store}>
            <Router>
              <HelmetProvider>
                <ColorModeScript initialColorMode={cookieStore.get(theme.config.initialColorMode)} />
                <App />
              </HelmetProvider>
            </Router>
          </Provider>
        </ChakraProvider>
      </CacheProvider>
    </StrictMode>
  );
};

export { Root };
