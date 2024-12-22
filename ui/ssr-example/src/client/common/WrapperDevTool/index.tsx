import { type ReactNode } from "react";

import { IframeDevTool } from "@client/component/DevTool/Item";
import { ResizeAbleGridCard } from "@client/component/GridCard";
import { useDevTool } from "@client/hooks/useDevTool";

export const WrapperDevTool = ({ children }: { children: ReactNode }) => {
  const isOpen = useDevTool.useShallowStableSelector((s) => s.open);

  return (
    <>
      {children}
      {isOpen && (
        <ResizeAbleGridCard className="@my-react-devtool" width="70%" height="80%" zIndex="1000000" top="0" left="0" style={{ position: "fixed" }}>
          <IframeDevTool />
        </ResizeAbleGridCard>
      )}
    </>
  );
};
