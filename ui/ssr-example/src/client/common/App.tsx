import { allRoutes } from "@client/router";

import { LoadingBar } from "./LoadingBar";
import { RenderMatch } from "./RenderMatch";
import { WrapperApollo } from "./WrapperApollo";
import { WrapperErrorCatch } from "./WrapperCatch";
import { WrapperLang } from "./WrapperLang";
import { WrapperLoading } from "./WrapperLoading";
import { WrapperRoute } from "./WrapperRoute";

export const App = () => {
  return (
    <WrapperApollo>
      <WrapperLoading>
        <WrapperLang>
          <WrapperRoute routes={allRoutes} LoadingBar={LoadingBar}>
            <WrapperErrorCatch>
              <RenderMatch />
            </WrapperErrorCatch>
          </WrapperRoute>
        </WrapperLang>
      </WrapperLoading>
    </WrapperApollo>
  );
};
