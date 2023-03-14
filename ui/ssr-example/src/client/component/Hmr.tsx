import { Code, Container, Heading } from "@chakra-ui/react";
import { __my_react_internal__ } from "@my-react/react";

import { CONTAINER_WIDTH } from "@client/config/container";

const { currentRunningFiber } = __my_react_internal__;

export const Hmr = () => {
  if (__CLIENT__) {
    (window as any).__fiberMap__.set("Hmr_component_hash_id", currentRunningFiber.current);
  }

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
    </Container>
  );
};

if (__CLIENT__) {
  (window as any).__fiberMap__ = (window as any).__fiberMap__ || new Map();
}

if (__CLIENT__ && __DEVELOPMENT__ && module.hot) {
  const fiber = (window as any).__fiberMap__.get("Hmr_component_hash_id");
  if (fiber) {
    fiber.elementType = Hmr;

    fiber._update();
  }
  module.hot.accept();
}
