import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@site/graphql";
import { useLocation } from "react-router";

import { preLoadPropsKey } from "@client/utils";
import { useAppSelector } from "@shared";

import type { NormalizedCacheObject } from "@apollo/client";
import type { ReactNode } from "react";

export const WrapperApollo = ({ children }: { children: ReactNode }) => {
  const props = useAppSelector((state) => state.client.clientProps.data);

  const { pathname } = useLocation();

  const preLoadKey = preLoadPropsKey(pathname);

  const preLoadState = props[preLoadKey];

  const apolloState = preLoadState?.["$$__apollo__$$"];

  const apolloClient = useApollo(apolloState as NormalizedCacheObject, true);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
