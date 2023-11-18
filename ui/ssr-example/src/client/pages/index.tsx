import { lazy } from "react";

import { ScrollContent, ScrollControl, ScrollControlTool, ScrollSection, ScrollToTop } from "@client/component";
import { MainSection } from "@client/container/Section";
import { ApiSection as _ApiSection } from "@client/container/Section/Api";
import { NextSection } from "@client/container/Section/Next";
import { ViteSection } from "@client/container/Section/Vite";

const ApiSection = __REACT__ && !__STREAM__ ? _ApiSection : lazy(() => import("@client/container/Section").then(({ ApiSection }) => ({ default: ApiSection })));

const Page = () => {
  return (
    <>
      <ScrollControl initialSectionLength={1}>
        <ScrollContent>
          <ScrollSection>
            <MainSection />
          </ScrollSection>

          <ScrollSection>
            <NextSection />
          </ScrollSection>

          <ScrollSection>
            <ViteSection />
          </ScrollSection>

          <ScrollSection>
            <ApiSection />
          </ScrollSection>

          {/* <ScrollSection>
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
            <Box width="100vw" height="120vh" backgroundColor="twitter.200" position="relative">
              <Box position="absolute" left="30%" top="50%" transform="translateY(-50%)" border="1px" borderRadius="4px" padding="2">
                <Section>
                  <Text fontSize="24px">5 page</Text>
                </Section>
              </Box>
            </Box>
          </ScrollSection> */}
        </ScrollContent>

        <ScrollControlTool />
        <ScrollToTop />
      </ScrollControl>
    </>
  );
};

export default Page;

export const isStatic = true;
