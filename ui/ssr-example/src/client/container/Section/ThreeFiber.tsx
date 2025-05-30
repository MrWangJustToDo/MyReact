import { Box, Button, Container, Flex, Heading, HStack, Spacer, Tag, useColorModeValue, Text, Divider } from "@chakra-ui/react";
import { SandpackCodeEditor, SandpackProvider, SandpackLayout } from "@codesandbox/sandpack-react";
import { useState } from "react";

import { Section } from "@client/component";
import { Card } from "@client/component/Card";
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
  "Reparenting.tsx"
];

export const ThreeFiberSection = () => {
  const colorScheme = useColorModeValue("light", "dark");

  const [name, setName] = useState(AllExampleList[0]);

  const file = code[name];

  const isMounted = useIsMounted();

  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Flex justifyContent="center" flexDirection={{ base: "column", md: "row" }} marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        <Box alignSelf="flex-start" marginRight={{ base: "1%", md: "2%", lg: "3%", "2xl": "4%" }} maxWidth={{ base: "100%", md: "42%" }}>
          <Heading as="h1" fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} marginTop="6">
            Three.js with <Tag fontSize="inherit">@my-react</Tag>
          </Heading>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            This project is a experimental project.
          </Text>
          <Spacer marginTop="4" />
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            Try to click <Tag>DevTool</Tag> to see the component tree.
          </Text>
          <Divider marginY="4" />
          <Text fontWeight="bold">All Example:</Text>
          <HStack spacing="3" marginTop="2" flexWrap="wrap" fontSize={{ md: "12px", lg: "13px", xl: "14px" }}>
            {AllExampleList.map((item) => (
              <Button key={item} colorScheme="green" size="sm" onClick={() => setName(item)} isActive={name === item}>
                {item.replace(".tsx", "")}
              </Button>
            ))}
          </HStack>
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
              <SandpackLayout style={{ border: "none" }}>
                <SandpackCodeEditor showReadOnly={false} readOnly style={{ height: "350px" }} />
                {/* <Box borderLeft="1px" borderColor="cardBorderColor" width={{ base: "100%", md: "50%" }}>
                  {__CLIENT__ && isMounted && <ThreeFiberExample name={name} />}
                </Box> */}
              </SandpackLayout>
            </SandpackProvider>
          </Box>
        </Section>
      </Flex>
      <Card overflow="hidden" height="45vh" marginX={{ base: "2", md: "6%", lg: "8%", xl: "10%", "2xl": "12%" }}>
        {__CLIENT__ && isMounted && <ThreeFiberExample name={name} />}
      </Card>
    </Container>
  );
};
