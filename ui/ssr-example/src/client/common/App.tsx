import { allRoutes } from "@client/router";

import { LoadingBar } from "./LoadingBar";
import { RenderMatch } from "./RenderMatch";
import { WrapperApollo } from "./WrapperApollo";
import { WrapperErrorCatch } from "./WrapperCatch";
import { WrapperLang } from "./WrapperLang";
import { WrapperRoute } from "./WrapperRoute";

export const App = () => {
  return (
    <WrapperApollo>
      <WrapperLang>
        <WrapperRoute routes={allRoutes} LoadingBar={LoadingBar}>
          <WrapperErrorCatch>
            <RenderMatch />
          </WrapperErrorCatch>
        </WrapperRoute>
      </WrapperLang>
    </WrapperApollo>
  );
};
