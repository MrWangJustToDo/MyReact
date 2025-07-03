import { useColorMode } from "@chakra-ui/react";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";

import { RSPACK_REACT_TEMPLATE } from "./config";

export const RspackPlayground = () => {
  const { colorMode } = useColorMode();

  return (
    <SandpackProvider
      files={RSPACK_REACT_TEMPLATE.files}
      customSetup={{
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          "@my-react/react": "0.3.9",
          "@my-react/react-dom": "0.3.9",
        },
        devDependencies: {
          "@my-react/react-refresh": "0.3.9",
          "@my-react/react-rspack": "0.0.3",
          "@rspack/cli": "1.3.2",
          "@rspack/core": "1.3.2",
        },
        entry: RSPACK_REACT_TEMPLATE.files["/package.json"].code,
        environment: RSPACK_REACT_TEMPLATE.environment,
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
