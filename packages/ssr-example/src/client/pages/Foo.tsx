import { Box, Code, Heading, Text } from "@chakra-ui/react";

import { ScrollContent, ScrollControl, ScrollControlTool, ScrollSection, ScrollToTop } from "@client/component/ScrollControl";
import { Section } from "@client/component/Section";
import { delay } from "@client/utils";

import type { GetInitialStateType } from "@client/types/common";

// current page will not generate static page

export default function Index({ foo }: { foo: string }) {
  return (
    <>
      <ScrollControl initialSectionLength={5}>
        <ScrollContent>
          <ScrollSection>
            <Box width="100vw" height="100vh" backgroundColor="AppWorkspace" position="relative">
              <Heading>foo page</Heading>
              <Code>props: foo: {foo}</Code>
              <Box position="absolute" left="30%" top="50%" transform="translateY(-50%)" border="1px" borderRadius="4px" padding="2">
                <Section>
                  <Text fontSize="24px">1 page</Text>
                </Section>
              </Box>
            </Box>
          </ScrollSection>

          <ScrollSection>
            <Box width="100vw" height="100vh" backgroundColor="aliceblue" position="relative">
              <Box position="absolute" left="30%" top="50%" transform="translateY(-50%)" border="1px" borderRadius="4px" padding="2">
                <Section>
                  <Text fontSize="24px">2 page</Text>
                </Section>
              </Box>
            </Box>
          </ScrollSection>

          <ScrollSection>
            <Box width="100vw" height="100vh" backgroundColor="whatsapp.300" position="relative">
              <Box position="absolute" left="30%" top="50%" transform="translateY(-50%)" border="1px" borderRadius="4px" padding="2">
                <Section>
                  <Text fontSize="24px">3 page</Text>
                </Section>
              </Box>
            </Box>
          </ScrollSection>

          <ScrollSection>
            <Box width="100vw" height="100vh" backgroundColor="yellow.400" position="relative">
              <Box position="absolute" left="30%" top="50%" transform="translateY(-50%)" border="1px" borderRadius="4px" padding="2">
                <Section>
                  <Text fontSize="24px">4 page</Text>
                </Section>
              </Box>
            </Box>
          </ScrollSection>

          <ScrollSection>
            <Box width="100vw" height="100vh" backgroundColor="twitter.200" position="relative">
              <Box position="absolute" left="30%" top="50%" transform="translateY(-50%)" border="1px" borderRadius="4px" padding="2">
                <Section>
                  <Text fontSize="24px">5 page</Text>
                </Section>
              </Box>
            </Box>
          </ScrollSection>
        </ScrollContent>

        <ScrollControlTool />
        <ScrollToTop />
      </ScrollControl>
    </>
  );
}

export const getInitialState: GetInitialStateType = async () => {
  await delay(1000);
  return { props: { foo: "bar" } };
};
