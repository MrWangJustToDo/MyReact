import { lazy } from "react";

import { ScrollContent, ScrollControl, ScrollControlTool, ScrollSection, ScrollToTop } from "@client/component/ScrollControl";
import { DevToolSection, MainSection } from "@client/container/Section";
import { ApiSection as _ApiSection } from "@client/container/Section/Api";
import { CanvasUISection } from "@client/container/Section/Canvas";
import { NextSection } from "@client/container/Section/Next";
import { ReconcilerSection } from "@client/container/Section/Reconciler";
import { ThreeFiberSection } from "@client/container/Section/ThreeFiber";
import { ViteSection } from "@client/container/Section/Vite";
import { FeaturesSection } from "@client/container/Section/Features";

const ApiSection = !__STREAM__ ? _ApiSection : lazy(() => import("@client/container/Section").then(({ ApiSection }) => ({ default: ApiSection })));

const Page = () => {
  return (
    <ScrollControl initialSectionLength={9}>
      <ScrollContent>
        {/* Hero Section */}
        <ScrollSection>
          <MainSection />
        </ScrollSection>

        {/* Features Overview - New Section */}
        <ScrollSection>
          <FeaturesSection />
        </ScrollSection>

        {/* Reconciler Section */}
        <ScrollSection>
          <ReconcilerSection />
        </ScrollSection>

        {/* Next.js Section */}
        <ScrollSection>
          <NextSection />
        </ScrollSection>

        {/* Vite Section */}
        <ScrollSection>
          <ViteSection />
        </ScrollSection>

        {/* Three Fiber Section */}
        {!__REACT__ && (
          <ScrollSection>
            <ThreeFiberSection />
          </ScrollSection>
        )}

        {/* Canvas UI Section */}
        {!__REACT__ && (
          <ScrollSection>
            <CanvasUISection />
          </ScrollSection>
        )}

        {/* DevTool Section */}
        <ScrollSection>
          <DevToolSection />
        </ScrollSection>

        {/* API Reference Section */}
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
