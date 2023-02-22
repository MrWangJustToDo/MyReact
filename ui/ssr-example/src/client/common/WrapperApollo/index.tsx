import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@site/graphql";

import type { ReactNode } from "react";

export const WrapperApollo = ({ children }: { children: ReactNode }) => {
  const apolloClient = useApollo(null, true);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
