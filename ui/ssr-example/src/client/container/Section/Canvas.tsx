import { Flex, Spacer, Card, Container, Box, Heading, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { SandpackCodeEditor, SandpackProvider, SandpackLayout } from "@codesandbox/sandpack-react";

import { CanvasUI } from "@client/component/CanvasUI";
import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";
import { useIsMounted } from "@client/hooks";

const file = `import React from 'react'
import { Canvas, Text, Flex } from '@canvas-ui/react'

export default () => {
  const containerStyle = {
    width: 250,
    flexDirection: 'column'
  }
  const textStyle = {
    maxWidth: containerStyle.width,
    maxLines: 1,
  }
  return (
    <div style={{ height: '100px', width: '100%' }}>
      <Canvas>
        <Flex style={ containerStyle }>
          <Text style={ textStyle }>私はガラスを食べられます。それは私を傷つけません。</Text>
          <Text style={ textStyle }>The quick brown fox jumps over the lazy dog.</Text>
        </Flex>
      </Canvas>
    </div>
  )
}
`;

export const CanvasUISection = () => {
  const colorScheme = useColorModeValue("light", "dark");

  const isMounted = useIsMounted();

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        <Box alignSelf="flex-start" marginRight={{ base: "1%", md: "2%", lg: "3%", "2xl": "4%" }} maxWidth={{ base: "100%", md: "42%" }}>
          <Heading as="h1" fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} marginTop="6">
            CanvasUI with <Tag fontSize="inherit">@my-react</Tag>
          </Heading>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            This project is a experimental project.
          </Text>
          <Spacer marginTop="4" />
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            Try to click <Tag>DevTool</Tag> to see the component tree.
          </Text>
        </Box>
        <Section>
          <Box
            className="typo"
            overflow={{ base: "hidden", lg: "auto" }}
            border="1px solid"
            width={{ md: "45vw" }}
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
          >
            <SandpackProvider
              files={{
                [`main.tsx`]: {
                  code: file,
                  active: true,
                },
              }}
              theme={colorScheme}
            >
              <SandpackLayout>
                <SandpackCodeEditor readOnly style={{ height: "380px" }} />
              </SandpackLayout>
            </SandpackProvider>
          </Box>
        </Section>
      </Flex>
      <Card overflow="hidden" height="45vh" marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        {__CLIENT__ && isMounted && <CanvasUI />}
      </Card>
    </Container>
  );
};
