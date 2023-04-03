import { Code, Container, Heading } from "@chakra-ui/react";

import { CONTAINER_WIDTH } from "@client/config/container";

export const Hmr = () => {
  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="90vh">
      <Heading key={1}>test: hot module replacement page</Heading>
      <br />
      <div style={{ fontSize: "20px" }}>you can edit this page in the develop mode then the page will update without full reload</div>
      <br />
      <div style={{ border: "1px solid red", height: "100px" }}>hmr</div>
      <br />
      <Code key={2}>hmr just works</Code>
      <br />
      <Code>so cool! i like it very much</Code>
      <br />
      <div>next step is hook</div>
    </Container>
  );
};
