import { Box, Button, Container, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import { CONTAINER_WIDTH } from "@client/config/container";
import { mark } from "@client/utils/markdown";
import { getIsStaticGenerate } from "@shared";

const tsxMd = `
\`\`\`tsx
import { useState, useCallback } from '@my-react/react';
import { render } from '@my-react/react-dom';

const useCount = () => {
  const [state, setState] = useState(0);
  const add = useCallback(() => setState(i => i + 1), []);
  const del = useCallback(() => setState(i => i - 1), []);

  return [state, add, del];
};

const App = () => {
  const [state, add, del] = useCount();

  return <div>
    <p>{state}</p>;
    <button onClick={add}>add</button>
    <button onClick={del}>del</button>
  </div>
}

render(<App />, document.querySelector('#root'));
\`\`\`
`;

const renderBody = mark.render(tsxMd);

export const MainSection = () => {
  const navigate = useNavigate();

  const { formatMessage } = useIntl();

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh">
      <Flex justifyContent="space-between" marginTop="4%" flexDirection={{ base: "column", md: "row" }}>
        <Box alignSelf="flex-start" marginLeft={{ base: "4%", md: "6%", lg: "8%" }} maxWidth={{ base: "100%", md: "40%" }}>
          <Heading as="h1" fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }} marginBottom="6" color="red.400">
            {formatMessage({ id: "@my-react" })}
          </Heading>
          <Text fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}>{formatMessage({ id: "description" })}</Text>
          <Text fontSize="sm" color="lightTextColor" marginY="2">
            This website is built with @my-react, so cool
          </Text>
          <HStack marginTop="14" spacing="4" display={{ base: "none", md: "flex" }} fontSize={{ md: "12px", lg: "14px", xl: "16px" }}>
            <Button
              variant="solid"
              fontSize="inherit"
              borderRadius="full"
              colorScheme="messenger"
              onClick={() => navigate(getIsStaticGenerate() ? "/MyReact/Blog" : "/Blog")}
            >
              View Example
            </Button>
            <Button
              variant="solid"
              fontSize="inherit"
              borderRadius="full"
              colorScheme="whatsapp"
              as="a"
              href="https://github.com/MrWangJustToDo/MyReact"
              target="_blank"
            >
              View on GitHub
            </Button>
            <Button
              variant="solid"
              fontSize="inherit"
              borderRadius="full"
              colorScheme="teal"
              display={{ base: "none", lg: "inline-flex" }}
              as="a"
              href="https://mrwangjusttodo.github.io/MrWangJustToDo.io?overlay=open&playGround=MyReact"
              target="_blank"
            >
              Online play
            </Button>
            <Button variant="solid" fontSize="inherit" borderRadius="full" as="a" href="https://www.npmjs.com/search?q=%40my-react" target="_blank">
              View on NPM
            </Button>
          </HStack>
        </Box>
        <Box
          className="typo"
          overflow={{ base: "hidden", lg: "auto" }}
          border="1px solid"
          borderColor="cardBorderColor"
          marginRight={{ base: "4%", md: "16%" }}
          marginTop={{ base: "10%", md: "0" }}
          marginLeft={{ base: "4%", md: "0" }}
          marginBottom={{ base: "6%" }}
          borderRadius="0.8em"
          fontSize={{ base: "sm", lg: "medium" }}
          sx={{
            ["pre"]: {
              margin: "0",
            },
          }}
          dangerouslySetInnerHTML={{ __html: renderBody }}
        />
      </Flex>
    </Container>
  );
};
