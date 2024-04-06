import { initGlobalRenderPlatform } from "./renderPlatform";

// TODO
export { AppContextProps } from "./components/AppContext";
export { StdinContextProps } from "./components/StdinContext";
export { StdoutContextProps } from "./components/StdoutContext";
export { StderrContextProps } from "./components/StderrContext";
export { Box, BoxProps } from "./components/Box";
export { Text, TextProps } from "./components/Text";
export { Static, StaticProps } from "./components/Static";
export { Transform, TransformProps } from "./components/Transform";
export { Newline, NewlineProps } from "./components/Newline";
export { Spacer } from "./components/Spacer";
export * from "./hooks";
export { measureElement } from "./api/native";
export { DOMNode, PlainElement, TextElement } from "./api/native";
export { render, RenderOptions } from "./mount/render";

initGlobalRenderPlatform();
