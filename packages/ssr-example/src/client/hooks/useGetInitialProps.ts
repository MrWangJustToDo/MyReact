import { preLoadPropsKey } from "@client/utils";
import { useAppSelector } from "@shared";

export const useGetInitialProps = (pagePath: string) => {
  const routerData = useAppSelector((state) => state.client.clientProps.data);

  const propsKey = preLoadPropsKey(pagePath);

  return routerData[propsKey];
};
