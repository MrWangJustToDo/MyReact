import { Flex, Container, Box, Heading, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { SandpackCodeEditor, SandpackProvider, SandpackLayout } from "@codesandbox/sandpack-react";

import { CanvasUI } from "@client/component/CanvasUI";
import { Card } from "@client/component/Card";
import { Section } from "@client/component/Section";
import { CONTAINER_WIDTH } from "@client/config/container";
import { useIsMounted } from "@client/hooks";

const file = `import React from 'react'
import { Canvas, Text, Flex } from '@canvas-ui/react'

function HelloWorld() {

  const containerStyle = {
    width: 250,
    flexDirection: 'column'
  } as const

  const textStyle = {
    maxWidth: containerStyle.width,
    maxLines: 1,
    cursor: 'pointer',
    fontSize: 14,
    color: '#333'
  } as const

  const [text, setText] = React.useState('Hello, Canvas UI!')
  const setTextRef = (ref) => {
      console.info('Access underlying RenderText object:', ref)
  }

  const handlePointerDown = () => {
    setText(text === 'Hello, Canvas UI!' ? 'Welcome to Canvas UI!' : 'Hello, Canvas UI!')
  }

  return (
    <div style={{ height: '120px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <Canvas>
        <Flex style={containerStyle}>
          <Text
            ref={setTextRef}
            onPointerDown={handlePointerDown}
            style={textStyle}
          >
            {text}
          </Text>
          <Text style={{ ...textStyle, marginTop: 8, fontSize: 12, color: '#666' }}>
            Click the text above to see it change!
          </Text>
        </Flex>
      </Canvas>
    </div>
  )
}
`;

export const CanvasUISection = () => {
  const colorScheme = useColorModeValue("light", "dark");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");
  const isMounted = useIsMounted();

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "4", md: "6%", lg: "8%" }} gap={{ base: "10", md: "12" }}>
        {/* Left Section - Content */}
        <Box flex="1" maxWidth={{ base: "100%", md: "42%" }}>
          <VStack align="start" spacing="0">
            {/* Title */}
            <Heading
              as="h2"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="1.1"
              color="purple.600"
              _dark={{ color: "purple.400" }}
            >
              Canvas UI
            </Heading>

            {/* Subtitle */}
            <Text fontSize="sm" color={subtleTextColor} marginTop="3">
              @canvas-ui/react + @my-react
            </Text>

            {/* Description */}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="400" lineHeight="1.7" color="gray.700" _dark={{ color: "gray.300" }} marginTop="6">
              Render 2D canvas UI with React. Build high-performance graphics and interactive interfaces.
            </Text>

            {/* Tip */}
            <Text fontSize="sm" color={subtleTextColor} marginTop="4">
              Tip: Click the DevTool button to inspect the component tree.
            </Text>
          </VStack>
        </Box>

        {/* Right Section - Code */}
        <Section>
          <Box
            className="typo"
            overflow={{ base: "hidden", lg: "auto" }}
            border="1px solid"
            maxWidth={{ md: "55vw", lg: "45vw" }}
            minWidth={{ md: "40vw" }}
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
                [`CanvasUI.tsx`]: {
                  code: file,
                  active: true,
                },
              }}
              theme={colorScheme}
            >
              <SandpackLayout style={{ border: "none" }}>
                <SandpackCodeEditor readOnly style={{ height: "420px" }} />
              </SandpackLayout>
            </SandpackProvider>
          </Box>
        </Section>
      </Flex>

      {/* Canvas Preview */}
      <Card overflow="hidden" height="45vh" marginX={{ base: "4", md: "6%", lg: "8%" }} marginTop="8" boxShadow="lg">
        {__CLIENT__ && isMounted && <CanvasUI />}
      </Card>
    </Container>
  );
};
