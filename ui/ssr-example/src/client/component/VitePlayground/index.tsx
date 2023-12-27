import { useColorMode } from "@chakra-ui/react";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";

import { VITE_REACT_TEMPLATE } from "./config";

export const VitePlayground = () => {
  const { colorMode } = useColorMode();

  return (
    <SandpackProvider
      files={VITE_REACT_TEMPLATE.files}
      customSetup={{
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          "@my-react/react": "0.2.8",
          "@my-react/react-dom": "0.2.8",
        },
        devDependencies: {
          "@my-react/react-refresh": "0.2.8",
          "@my-react/react-vite": "0.0.2",
          "@vitejs/plugin-react": "3.1.0",
          vite: "4.1.4",
          "esbuild-wasm": "0.17.12",
        },
        entry: VITE_REACT_TEMPLATE.files["/package.json"].code,
        environment: VITE_REACT_TEMPLATE.environment,
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
