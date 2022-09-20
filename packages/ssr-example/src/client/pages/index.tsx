import { Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
      <Heading>hello home page</Heading>
      <br />
      <Button onClick={() => navigate("/Foo")}>goto foo</Button>
      <Button onClick={() => navigate("/Bar")}>goto bar</Button>
      <Button onClick={() => navigate("/Baz")}>goto baz</Button>
      <Button onClick={() => navigate("/Antd")}>goto antd</Button>
      <Button onClick={() => navigate(`/Dynamic/${Math.random().toString().slice(2)}`)}>goto dynamic</Button>
      <Button onClick={() => navigate("/I18n")}>goto i18n</Button>
      <Button onClick={() => navigate("/Goo")}>goto Goo</Button>
      <Button onClick={() => navigate("/HHH")}>404 page</Button>
    </>
  );
}

export const isStatic = true;
