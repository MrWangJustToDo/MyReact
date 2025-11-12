import { Canvas, Text, Flex } from "@canvas-ui/react";
import { useState } from "react";

function CanvasUIExample({ mode }: { mode: "light" | "dark" }) {
  const containerStyle = {
    width: 250,
    flexDirection: "column",
  } as const;

  const textStyle = {
    maxWidth: containerStyle.width,
    maxLines: 1,
    cursor: "pointer",
    fontSize: 14,
    color: mode === "light" ? "#333" : "#ccc",
  } as const;

  const [text, setText] = useState("Hello, Canvas UI!");

  const setTextRef = (ref) => {
    console.info("Access underlying RenderText object:", ref);
  };

  const handlePointerDown = () => {
    setText(text === "Hello, Canvas UI!" ? "Welcome to Canvas UI! 🎉" : "Hello, Canvas UI!");
  };

  return (
    <div style={{ height: "100px", width: "100%", padding: "10px" }}>
      <Canvas>
        <Flex style={containerStyle}>
          <Text ref={setTextRef} onPointerDown={handlePointerDown} style={textStyle}>
            {text}
          </Text>
          <Text style={{ ...textStyle, marginTop: 8, fontSize: 12, color: mode === "light" ? "#666" : "white" }}>Click the text above to see it change!</Text>
        </Flex>
      </Canvas>
    </div>
  );
}

export const Exp = CanvasUIExample;
