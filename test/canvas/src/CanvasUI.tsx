import { Canvas, Text, Flex } from "@canvas-ui/react";

import type { FlexProps } from "@canvas-ui/react";

export const CanvasUI = () => {
  const containerStyle: FlexProps["style"] = {
    width: 250,
    height: '100',
    flexDirection: "column",
    backgroundColor: "greenyellow",
  } as const;
  const textStyle = {
    maxWidth: containerStyle.width,
    maxLines: 1,
  };
  return (
    <div style={{ height: "100px", width: "100px", border: "1px solid red" }}>
      <Canvas>
        <Flex style={containerStyle}>
          <Text style={textStyle}>私はガラスを食べられます。それは私を傷つけません。</Text>
          <Text style={textStyle}>The quick brown fox jumps over the lazy dog.</Text>
        </Flex>
      </Canvas>
    </div>
  );
};
