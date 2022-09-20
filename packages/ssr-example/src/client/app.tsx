import { ChakraProvider, cookieStorageManager } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { App } from "@client/common/App";
import { createEmotionCache } from "@shared";

import type { createUniversalStore } from "@shared";

const emotionCache = createEmotionCache();

const Root = ({ store }: { store: ReturnType<typeof createUniversalStore> }) => {
  // this component will only run once when the page mount, so it's ok to use server's cookie
  const cookieStore = cookieStorageManager(document.cookie);

  return (
    <StrictMode>
      <CacheProvider value={emotionCache}>
        <ChakraProvider colorModeManager={cookieStore}>
          <Provider store={store} serverState={store.getState()}>
            <Router>
              <HelmetProvider>
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
