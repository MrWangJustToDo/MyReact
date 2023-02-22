import { Code, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Index() {
  const navigate = useNavigate();
  const open = useToast();

  useEffect(() => {
    open({
      title: "404",
      description: "not found page, redirect to home page",
      status: "error",
    });
    navigate("/");
  }, [open, navigate]);

  return <Code>404 page</Code>;
}

export const isStatic = true;
