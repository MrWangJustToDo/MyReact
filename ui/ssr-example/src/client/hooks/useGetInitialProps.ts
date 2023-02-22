import { useAppSelector } from "@shared";

import { preLoadPropsKey } from "../utils";

export const useGetInitialProps = (pagePath: string) => {
  const routerData = useAppSelector((state) => state.client.clientProps.data);

  const propsKey = preLoadPropsKey(pagePath);

  return routerData[propsKey];
};
