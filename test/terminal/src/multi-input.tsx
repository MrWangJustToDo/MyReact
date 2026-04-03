/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useRef, useEffect } from "@my-react/react";
import { render, Text, Box, useInput, useStdout } from "@my-react/react-terminal";

let messageId = 0;

function ChatApp() {
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState({
    columns: stdout.columns,
    rows: stdout.rows,
  });

  useEffect(() => {
    const handler = () => {
      setDimensions({
        columns: stdout.columns,
        rows: stdout.rows,
      });
    };

    stdout.on("resize", handler);

    return () => {
      stdout.off("resize", handler);
    };
  }, [stdout]);

  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [activeField, setActiveField] = useState<"input" | "name">("input");
  const [inputCursor, setInputCursor] = useState(0);
  const [nameCursor, setNameCursor] = useState(0);

  const [messages, setMessages] = useState<
    Array<{
      id: number;
      text: string;
    }>
  >([]);

  const [spinnerIndex, setSpinnerIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  // Use refs to always have the latest values
  const inputReference = useRef("");
  const nameReference = useRef("");
  const inputCursorReference = useRef(0);
  const nameCursorReference = useRef(0);

  useEffect(() => {
    if (!isProcessing) {
      return;
    }

    const timer = setInterval(() => {
      setSpinnerIndex((index) => (index + 1) % 10);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [isProcessing]);

  useEffect(() => {
    inputReference.current = input;
    nameReference.current = name;
    inputCursorReference.current = inputCursor;
    nameCursorReference.current = nameCursor;
  }, [input, name, inputCursor, nameCursor]);

  // Helper function to get line info from cursor position
  const getLineInfo = (text: string, cursor: number) => {
    const textBeforeCursor = text.slice(0, cursor);
    const lines = text.split("\n");
    const linesBeforeCursor = textBeforeCursor.split("\n");
    const currentLineIndex = linesBeforeCursor.length - 1;
    const currentLineStart = textBeforeCursor.lastIndexOf("\n") + 1;
    const colInLine = cursor - currentLineStart;
    return { lines, currentLineIndex, colInLine, currentLineStart };
  };

  useInput((character, key) => {
    if (character === "p" && !key.ctrl && !key.meta) {
      setIsProcessing((previous) => !previous);
      return;
    }

    // Switch focus with Tab key only
    if (key.tab) {
      setActiveField((current) => (current === "input" ? "name" : "input"));
      return;
    }

    const isInputField = activeField === "input";
    const currentText = isInputField ? inputReference.current : nameReference.current;
    const currentCursor = isInputField ? inputCursorReference.current : nameCursorReference.current;
    const setText = isInputField ? setInput : setName;
    const setCursor = isInputField ? setInputCursor : setNameCursor;
    const textReference = isInputField ? inputReference : nameReference;
    const cursorReference = isInputField ? inputCursorReference : nameCursorReference;

    // Up arrow or Ctrl+P - Move cursor up (do nothing if at first line)
    if (key.upArrow || (key.ctrl && character === "p")) {
      const { lines, currentLineIndex, colInLine } = getLineInfo(currentText, currentCursor);
      if (currentLineIndex > 0) {
        // Move to previous line
        const previousLine = lines[currentLineIndex - 1]!;
        const newCol = Math.min(colInLine, previousLine.length);
        // Calculate new cursor position
        let newPos = 0;
        for (let i = 0; i < currentLineIndex - 1; i++) {
          newPos += lines[i]!.length + 1; // +1 for newline
        }

        newPos += newCol;
        setCursor(newPos);
        cursorReference.current = newPos;
      }

      // At first line, do nothing (keep cursor position)
      return;
    }

    // Down arrow or Ctrl+N - Move cursor down (do nothing if at last line)
    if (key.downArrow || (key.ctrl && character === "n")) {
      const { lines, currentLineIndex, colInLine } = getLineInfo(currentText, currentCursor);
      if (currentLineIndex < lines.length - 1) {
        // Move to next line
        const nextLine = lines[currentLineIndex + 1]!;
        const newCol = Math.min(colInLine, nextLine.length);
        // Calculate new cursor position
        let newPos = 0;
        for (let i = 0; i <= currentLineIndex; i++) {
          newPos += lines[i]!.length + 1; // +1 for newline
        }

        newPos += newCol;
        setCursor(newPos);
        cursorReference.current = newPos;
      }

      // At last line, do nothing (keep cursor position)
      return;
    }

    // Left arrow or Ctrl+B - Move cursor left
    if (key.leftArrow || (key.ctrl && character === "b")) {
      const newPos = Math.max(0, currentCursor - 1);
      setCursor(newPos);
      cursorReference.current = newPos;
      return;
    }

    // Right arrow or Ctrl+F - Move cursor right
    if (key.rightArrow || (key.ctrl && character === "f")) {
      const newPos = Math.min(currentText.length, currentCursor + 1);
      setCursor(newPos);
      cursorReference.current = newPos;
      return;
    }

    // Home or Ctrl+A - Move cursor to beginning
    // @ts-ignore
    if (key.home || (key.ctrl && character === "a")) {
      setCursor(0);
      cursorReference.current = 0;
      return;
    }

    // End or Ctrl+E - Move cursor to end
    // @ts-ignore
    if (key.end || (key.ctrl && character === "e")) {
      const newPos = currentText.length;
      setCursor(newPos);
      cursorReference.current = newPos;
      return;
    }

    // Enter - Submit input
    if (key.return) {
      // IME FIX: If there's input text with return key, add it to current text before submitting
      let finalText = currentText;
      if (character && !/[\r\n]/.test(character)) {
        finalText += character;
      }

      const trimmedText = finalText.trim();
      if (trimmedText !== "") {
        const label = isInputField ? "User" : "Name";
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: messageId++,
            text: `${label}: ${trimmedText}`,
          },
        ]);
      }

      setText("");
      textReference.current = "";
      setCursor(0);
      cursorReference.current = 0;
      return;
    }

    // Backspace - Delete character before cursor
    if (key.backspace) {
      if (currentCursor > 0) {
        const newText = currentText.slice(0, currentCursor - 1) + currentText.slice(currentCursor);
        setText(newText);
        textReference.current = newText;
        const newPos = currentCursor - 1;
        setCursor(newPos);
        cursorReference.current = newPos;
      }

      return;
    }

    // Delete - In most terminals, backspace is detected as delete
    // So we treat delete as backspace (delete character before cursor)
    if (key.delete) {
      if (currentCursor > 0) {
        const newText = currentText.slice(0, currentCursor - 1) + currentText.slice(currentCursor);
        setText(newText);
        textReference.current = newText;
        const newPos = currentCursor - 1;
        setCursor(newPos);
        cursorReference.current = newPos;
      }

      return;
    }

    // General input - Insert at cursor position
    if (!key.ctrl && !key.meta && character) {
      const newText = currentText.slice(0, currentCursor) + character + currentText.slice(currentCursor);
      setText(newText);
      textReference.current = newText;
      const newPos = currentCursor + character.length;
      setCursor(newPos);
      cursorReference.current = newPos;
    }
  });

  const namePrefixString = "Enter your name: ";

  const renderTextWithCursor = (text: string, cursor: number, isFocused: boolean) => {
    if (!isFocused) {
      return text;
    }

    const before = text.slice(0, cursor);
    const char = text[cursor] ?? " ";
    const after = text.slice(cursor + 1);

    return (
      <>
        {before}
        <Text inverse>{char}</Text>
        {after}
      </>
    );
  };

  return (
    <Box flexDirection="column" width={dimensions.columns} height={dimensions.rows - 1}>
      <Box flexDirection="column" flexGrow={1} padding={1}>
        <Text bold color="cyan">
          === Multi-Input Arrow Key Test ===
        </Text>

        <Box marginTop={1}>
          <Text color="yellow">{isProcessing ? ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"][spinnerIndex] : "⏸"}</Text>
          <Text> {isProcessing ? "Processing..." : "Paused"}</Text>
        </Box>

        <Box flexDirection="column" marginTop={1} flexGrow={1}>
          {messages.map((message) => (
            <Text key={message.id}>{message.text}</Text>
          ))}
        </Box>

        <Box marginTop={1}>
          <Text>Enter your message: </Text>
          <Text terminalCursorFocus={activeField === "input"} terminalCursorPosition={inputCursor} color={activeField === "input" ? "green" : "white"}>
            {renderTextWithCursor(input, inputCursor, activeField === "input")}
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text
            terminalCursorFocus={activeField === "name"}
            terminalCursorPosition={namePrefixString.length + nameCursor}
            color={activeField === "name" ? "green" : "white"}
          >
            {renderTextWithCursor(namePrefixString + name, namePrefixString.length + nameCursor, activeField === "name")}
          </Text>
        </Box>
      </Box>

      <Box borderTop paddingX={1} borderStyle="single" borderBottom={false} borderLeft={false} borderRight={false}>
        <Text dimColor>
          Arrow keys (↑↓←→) or Ctrl+P/N/B/F to move. Tab/Up/Down to switch fields. Home/End or Ctrl+A/E to jump. Press 'p' to toggle processing.
        </Text>
      </Box>
    </Box>
  );
}

export const test = () =>
  render(<ChatApp />, {
    renderProcess: true,
    terminalBuffer: true,
    incrementalRendering: true,
  });
