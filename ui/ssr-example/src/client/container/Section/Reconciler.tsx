import { Box, Code, Container, Divider, Flex, Heading, Link, Text } from "@chakra-ui/react";

import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";
import { mark } from "@client/utils/markdown";

const tsxMd = `
\`\`\`tsx
import { useState, useCallback } from '@my-react/react';
import { createReconciler } from '@my-react/react-reconciler-compact';

const Reconciler = createReconciler({
  // Define the reconciler configuration here
});

const App = () => {
  const [state, setState] = useState(0);

  return <div>
    <p>{state}</p>
    <button onClick={() => setState(i => i + 1)}>add</button>
    <button onClick={() => setState(i => i - 1)}>del</button>
  </div>
}

const container = Reconciler.createContainer(document.querySelector('#root'));

Reconciler.updateContainer(<App />, container, null, () => {
  console.log('Render complete');
});
\`\`\`
`;

const renderBody = mark.render(tsxMd);

export const ReconcilerSection = () => {
  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "4", md: "6%", lg: "8%" }} gap={{ base: "10", md: "12" }}>
        <Box flex="1" maxWidth={{ base: "100%", md: "42%" }}>
          <Heading as="h1" fontSize={{ base: "xl", md: "2xl", lg: "4xl" }} marginBottom="6" color="purple.600">
            @my-react/react-reconciler-compact
          </Heading>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="500" marginBottom="6" lineHeight="1.6" color="gray.700" _dark={{ color: "gray.300" }}>
            A compact version of @my-react/react-reconciler, which has same APIs with react-reconciler.
          </Text>
          <Flex columnGap={2} alignItems="center" flexWrap="wrap">
            <Text fontWeight="bold">Support render :</Text>
            <Link href="https://github.com/vadimdemedes/ink" target="_blank">
              Ink
            </Link>
            |
            <Link href="https://github.com/pmndrs/react-three-fiber" target="_blank">
              React Three Fiber
            </Link>
          </Flex>
          <Divider marginY="4" />
          <Text>
            Ink example：<Code>pnpm run prepare:terminal && pnpm run test:terminal</Code>
            <br />
            <br />
            React Three Fiber example：<Code>pnpm run test:three</Code>
          </Text>
        </Box>
        <Section>
          <Box
            className="typo"
            overflow={{ base: "hidden", lg: "auto" }}
            border="1px solid"
            maxWidth={{ md: "55vw", lg: "45vw" }}
            borderColor="cardBorderColor"
            marginTop={{ base: "10%", md: "0" }}
            marginBottom={{ base: "6%" }}
            borderRadius="0.8em"
            fontSize={{ base: "sm", lg: "medium" }}
            boxShadow="lg"
            sx={{
              ["pre"]: {
                margin: "0 !important",
              },
            }}
            dangerouslySetInnerHTML={{ __html: renderBody }}
          />
        </Section>
      </Flex>
    </Container>
  );
};
