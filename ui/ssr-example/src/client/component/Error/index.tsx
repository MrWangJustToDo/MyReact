import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";

import type { ApolloError } from "@apollo/client";

export const ErrorCom = ({ error }: { error: ApolloError }) => {
  const open = useToast();

  useEffect(() => {
    open({
      title: "Get Blog Error",
      description: error.message,
      status: "error",
    });
  }, [error, open]);

  return <React.Fragment />;
};
