import { Box, Button, Container, Flex, Heading, HStack, useColorModeValue, Text, VStack } from "@chakra-ui/react";
import { SandpackCodeEditor, SandpackProvider, SandpackLayout } from "@codesandbox/sandpack-react";
import { useState } from "react";

import { Card } from "@client/component/Card";
import { Section } from "@client/component/Section";
import { ThreeFiberExample } from "@client/component/ThreeFiber";
import { CONTAINER_WIDTH } from "@client/config/container";
import { useIsMounted } from "@client/hooks";
import { code } from "@client/utils/code";

const AllExampleList = [
  "Simple.tsx",
  "SuspenseMaterial.tsx",
  "AutoDispose.tsx",
  "ContextMenuOverride.tsx",
  "MultiMaterial.tsx",
  "MultiRender.tsx",
  "Pointcloud.tsx",
  "Reparenting.tsx",
];

export const ThreeFiberSection = () => {
  const colorScheme = useColorModeValue("light", "dark");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");

  const [name, setName] = useState(AllExampleList[0]);
  const file = code[name];
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
              Three.js
            </Heading>

            {/* Subtitle */}
            <Text fontSize="sm" color={subtleTextColor} marginTop="3">
              React Three Fiber + @my-react
            </Text>

            {/* Description */}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="400" lineHeight="1.7" color="gray.700" _dark={{ color: "gray.300" }} marginTop="6">
              Render 3D graphics with React Three Fiber. Perfect for interactive visualizations and games.
            </Text>

            {/* Tip */}
            <Text fontSize="sm" color={subtleTextColor} marginTop="4">
              Tip: Click the DevTool button to inspect the component tree.
            </Text>

            {/* Examples */}
            <Box marginTop="8" width="100%">
              <Text fontSize="xs" fontWeight="600" color="gray.500" marginBottom="3">
                Examples
              </Text>
              <HStack spacing="2" flexWrap="wrap" gap="2">
                {AllExampleList.map((item) => (
                  <Button key={item} size="sm" variant={name === item ? "solid" : "outline"} colorScheme="purple" onClick={() => setName(item)}>
                    {item.replace(".tsx", "")}
                  </Button>
                ))}
              </HStack>
            </Box>
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
                [`${name}`]: {
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

      {/* 3D Preview */}
      <Card overflow="hidden" height="45vh" marginX={{ base: "4", md: "6%", lg: "8%" }} marginTop="8" boxShadow="lg">
        {__CLIENT__ && isMounted && <ThreeFiberExample name={name} />}
      </Card>
    </Container>
  );
};
