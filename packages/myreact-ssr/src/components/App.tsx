import { allRoutes } from "router/routes";

import { LoadingBar } from "./LoadingBar";
import { RenderMatch } from "./RenderMatch";
import { WrapperErrorCatch } from "./WrapperCatch";
import { WrapperLang } from "./WrapperLang";
import { WrapperRoute } from "./WrapperRoute";

export const App = () => {
  return (
    <WrapperLang>
      <WrapperRoute routes={allRoutes} LoadingBar={LoadingBar}>
        <WrapperErrorCatch>
          <RenderMatch />
        </WrapperErrorCatch>
      </WrapperRoute>
    </WrapperLang>
  );
};
