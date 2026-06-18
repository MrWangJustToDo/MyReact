import { use } from "@my-react/react/type";
import { InkTerminalBox } from "@my-react/react-terminal/web";
import { initHighlighter } from "ink-stream-markdown/web";

import { InkExample } from "./Example";

const promise = initHighlighter();

export const InkUI = () => {
  use(promise);

  return (
    <InkTerminalBox style={{ height: "100%" }} buildInRenderOptions={{ incrementalRendering: false, terminalBuffer: true }}>
      <InkExample />
    </InkTerminalBox>
  );
};
