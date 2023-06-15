import { Box, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import { noBase } from "@shared";

export default function Index() {
  const navigate = useNavigate();
  const open = useToast();

  useEffect(() => {
    open({
      title: "404",
      description: "404 not found, redirect to home page",
      status: "error",
    });
    navigate(noBase ? "/" : `/${__BASENAME__}/`);
  }, [open, navigate]);

  return <Box minHeight="100vh" />;
}

export const isStatic = true;
