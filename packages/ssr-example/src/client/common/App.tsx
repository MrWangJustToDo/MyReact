import { allRoutes } from "@client/router";

import { LoadingBar } from "./LoadingBar";
import { RenderMatch } from "./RenderMatch";
import { WrapperErrorCatch } from "./WrapperCatch";
import { WrapperLang } from "./WrapperLang";
import { WrapperLoading } from "./WrapperLoading";
import { WrapperRoute } from "./WrapperRoute";

export const App = () => {
  return (
    <WrapperLoading>
      <WrapperLang>
        <WrapperRoute routes={allRoutes} LoadingBar={LoadingBar}>
          <WrapperErrorCatch>
            <RenderMatch />
          </WrapperErrorCatch>
        </WrapperRoute>
      </WrapperLang>
    </WrapperLoading>
  );
};
