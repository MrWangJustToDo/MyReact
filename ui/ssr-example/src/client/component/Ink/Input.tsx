import { Box, Text, useInput } from "@my-react/react-terminal/web";
import { useState, useCallback } from "react";

export interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  prompt?: string;
  promptColor?: string;
  cursorColor?: string;
  focus?: boolean;
}

export const TextInput = ({
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = "",
  prompt = "> ",
  promptColor = "cyan",
  cursorColor,
  focus = true,
}: TextInputProps) => {
  const [internalValue, setInternalValue] = useState("");

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [controlledValue, onChange]
  );

  useInput((inputChar, key) => {
    if (!focus) return;

    if (inputChar === "[O") return;

    if (key.return) {
      if (value.trim()) {
        onSubmit?.(value);
        if (controlledValue === undefined) {
          setInternalValue("");
        }
      }
    } else if (key.backspace || key.delete) {
      setValue(value.slice(0, -1));
    } else if (!key.ctrl && !key.meta && inputChar) {
      setValue(value + inputChar);
    }
  });

  const showPlaceholder = !value && placeholder;

  if (!focus) {
    return (
      <Box>
        <Text color={promptColor}>{prompt}</Text>
        {showPlaceholder ? <Text dimColor>{placeholder}</Text> : <Text>{value}</Text>}
      </Box>
    );
  }

  if (showPlaceholder) {
    return (
      <Box>
        <Text color={promptColor}>{prompt}</Text>
        <Text dimColor inverse>
          {placeholder[0]}
        </Text>
        {placeholder.length > 1 && <Text dimColor>{placeholder.slice(1)}</Text>}
      </Box>
    );
  }

  return (
    <Box>
      <Text color={promptColor}>{prompt}</Text>
      {value.length > 0 && <Text>{value}</Text>}
      <Text inverse color={cursorColor}>
        {" "}
      </Text>
    </Box>
  );
};
