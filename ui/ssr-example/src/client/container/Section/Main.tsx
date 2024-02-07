import { Box, Button, Checkbox, Container, Flex, Heading, HStack, Tag, Text } from "@chakra-ui/react";
import { __my_react_shared__, version as reactVersion } from "@my-react/react";
import { version as reactDOMVersion } from "@my-react/react-dom";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import { Section } from "@client/component";
import { CONTAINER_WIDTH } from "@client/config/container";
import { mark } from "@client/utils/markdown";
import { noBase } from "@shared";

const { enableMockReact } = __my_react_shared__;

const tsxMd = `
\`\`\`tsx
import { useState, useCallback } from '@my-react/react';
import { render } from '@my-react/react-dom';

/**
 * hello world
 */

const useCount = () => {
  const [state, setState] = useState(0);
  const add = useCallback(() => setState(i => i + 1), []);
  const del = useCallback(() => setState(i => i - 1), []);

  return [state, add, del];
};

const App = () => {
  const [state, add, del] = useCount();

  return <div>
    <p>{state}</p>
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
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        <Box alignSelf="flex-start" marginRight={{ base: "1%", md: "2%", lg: "3%", "2xl": "4%" }} maxWidth={{ base: "100%", md: "42%" }}>
          <Heading as="h1" fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }} marginBottom="6" color="red.400">
            {formatMessage({ id: "@my-react" })}
          </Heading>
          <Text fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} as="div" fontWeight="500">
            {formatMessage({ id: "description" })}
          </Text>
          <Text color="lightTextColor" marginY="2" lineHeight="180%" as="div">
            This website is built with <Tag verticalAlign="middle">@my-react</Tag> project. <br /> Version: @my-react/react [{reactVersion}];
            @my-react/react-dom [{reactDOMVersion}] (enableMockReact: <Checkbox verticalAlign="middle" isChecked={enableMockReact.current} isReadOnly />)
          </Text>
          <HStack marginTop="14" spacing="3" display={{ base: "none", md: "flex" }} fontSize={{ md: "12px", lg: "13px", xl: "14px" }}>
            <Button variant="solid" fontSize="inherit" colorScheme="messenger" onClick={() => navigate(noBase ? "/Blog" : `/${__BASENAME__}/Blog`)}>
              View Example
            </Button>
            <Button variant="solid" fontSize="inherit" colorScheme="whatsapp" as="a" href="https://github.com/MrWangJustToDo/MyReact" target="_blank">
              View on GitHub
            </Button>
            <Button
              variant="solid"
              fontSize="inherit"
              colorScheme="teal"
              display={{ base: "none", lg: "inline-flex" }}
              as="a"
              href="https://mrwangjusttodo.github.io/MrWangJustToDo.io?overlay=open&playGround=MyReact"
              target="_blank"
            >
              Online play
            </Button>
            <Button variant="solid" fontSize="inherit" as="a" href="https://www.npmjs.com/search?q=%40my-react" target="_blank">
              View on NPM
            </Button>
          </HStack>
        </Box>
        <Section>
          <Box
            className="typo"
            overflow={{ base: "hidden", lg: "auto" }}
            border="1px solid"
            borderColor="cardBorderColor"
            marginTop={{ base: "10%", md: "0" }}
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
        </Section>
      </Flex>
    </Container>
  );
};
