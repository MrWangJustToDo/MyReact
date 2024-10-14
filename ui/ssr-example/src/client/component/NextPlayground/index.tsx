import { useColorMode } from "@chakra-ui/react";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";

import { NEXTJS_TEMPLATE } from "./config";

export const NextPlayground = () => {
  const { colorMode } = useColorMode();

  return (
    <SandpackProvider
      files={NEXTJS_TEMPLATE.files}
      customSetup={{
        dependencies: {
          next: "12.1.6", // @todo: update to the latest version
          react: "18.2.0",
          "react-dom": "18.2.0",
          "@my-react/react": "0.3.3",
          "@my-react/react-dom": "0.3.3",
          "@my-react/react-refresh": "0.3.3",
          "@my-react/react-refresh-tools": "0.0.12",
          "@next/swc-wasm-nodejs": "12.1.6",
        },
        entry: NEXTJS_TEMPLATE.files["/package.json"].code,
        environment: NEXTJS_TEMPLATE.environment,
      }}
      theme={colorMode}
    >
      <SandpackLayout>
        <SandpackCodeEditor style={{ height: "400px" }} />
        <SandpackPreview style={{ height: "400px" }} />
      </SandpackLayout>
    </SandpackProvider>
  );
};
