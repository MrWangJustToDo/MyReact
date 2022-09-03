import { useSelector } from "react-redux";

import { useLoadedLocation } from "components/WrapperRoute";
import { generateInitialPropsKey } from "utils/preLoad";

import type { StoreState } from "types/store";

const globalInitialSelector = (state: StoreState) => state.client.globalInitialProps.data;

export const useGetInitialProps = () => {
  const globalInitialProps = useSelector<StoreState, StoreState["client"]["globalInitialProps"]["data"]>(globalInitialSelector);
  const loaded = useLoadedLocation();
  const propsKey = generateInitialPropsKey(loaded?.location.pathname || "", loaded?.query || new URLSearchParams());
  const props = globalInitialProps[propsKey];

  return props as any;
};
