import { lazy } from "react";

import { ScrollContent, ScrollControl, ScrollControlTool, ScrollSection, ScrollToTop } from "@client/component";
import { DevToolSection, MainSection } from "@client/container/Section";
import { ApiSection as _ApiSection } from "@client/container/Section/Api";
import { NextSection } from "@client/container/Section/Next";
import { ReconcilerSection } from "@client/container/Section/Reconciler";
import { ViteSection } from "@client/container/Section/Vite";

const ApiSection = !__STREAM__ ? _ApiSection : lazy(() => import("@client/container/Section").then(({ ApiSection }) => ({ default: ApiSection })));

const Page = () => {
  return (
    <ScrollControl initialSectionLength={4}>
      <ScrollContent>
        <ScrollSection>
          <MainSection />
        </ScrollSection>

        <ScrollSection>
          <ReconcilerSection />
        </ScrollSection>

        <ScrollSection>
          <NextSection />
        </ScrollSection>

        <ScrollSection>
          <ViteSection />
        </ScrollSection>

        <ScrollSection>
          <DevToolSection />
        </ScrollSection>

        <ScrollSection>
          <ApiSection />
        </ScrollSection>
      </ScrollContent>

      <ScrollControlTool />
      <ScrollToTop />
    </ScrollControl>
  );
};

export default Page;

export const isStatic = true;
