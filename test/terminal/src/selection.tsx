/* eslint-disable max-lines */
import React, { useRef, useEffect, useReducer, forwardRef, useImperativeHandle } from "@my-react/react";
import {
  Box,
  Text,
  useInput,
  useApp,
  getText,
  hitTest,
  findNodeAtOffset,
  comparePoints,
  Range,
  measureElement,
  getPathToRoot,
  StaticRender,
  type DOMElement,
  type StyledLine,
  type DOMNode,
  render,
} from "@my-react/react-terminal";

export const selectionStyle = (line: StyledLine, index: number) => {
  line.setInverted(index, true);
};

const longText = "This is a very long text that is intended to wrap because the container width is fixed to 20 characters.\n".repeat(5).slice(0, 200);

const codeExample = [
  {
    id: "1",
    indent: 0,
    content: (
      <Text>
        <Text color="magenta">const</Text> <Text color="cyan">greeting</Text> = <Text color="green">"Hello"</Text>;
      </Text>
    ),
  },
  {
    id: "2",
    indent: 0,
    content: (
      <Text>
        <Text color="magenta">const</Text> <Text color="cyan">name</Text> = <Text color="green">"World"</Text>;
      </Text>
    ),
  },
  {
    id: "3",
    indent: 0,
    content: (
      <Text>
        <Text color="yellow">console</Text>.<Text color="yellow">log</Text>(
      </Text>
    ),
  },
  {
    id: "4",
    indent: 2,
    content: (
      <Text>
        <Text color="cyan">greeting</Text> + <Text color="green">", "</Text> + <Text color="cyan">name</Text> + <Text color="green">" (wrap)"</Text>
      </Text>
    ),
  },
  {
    id: "5",
    indent: 0,
    content: <Text>);</Text>,
  },
];

export type SelectionReference = {
  getSelectedText: () => string;
  getSelectionToString: () => string;
};

type Point = { node: DOMNode; offset: number };

type State = {
  cursor: { x: number; y: number };
  focusPoint?: Point;
  anchorPoint?: Point;
  fullText: string;
  selectedText: string;
  showSelection: boolean;
  lineNumbersSelectable: boolean;
  hasInitialized: boolean;
  insertedLines: string[];
  useStaticRender: boolean;
};

type Action =
  | {
      type: "SET_CURSOR";
      x: number;
      y: number;
      focusPoint?: Point;
      anchorPoint?: Point;
    }
  | { type: "SELECT_WORD"; anchorPoint: Point; focusPoint: Point }
  | { type: "RESET_ANCHOR" }
  | { type: "TOGGLE_SELECTION_VISIBILITY" }
  | { type: "TOGGLE_LINE_NUMBERS" }
  | { type: "ADD_INSERTED_LINE" }
  | { type: "UPDATE_TEXT"; fullText: string }
  | { type: "UPDATE_SELECTED_TEXT"; selectedText: string }
  | {
      type: "INITIALIZE";
      cursor: { x: number; y: number };
      anchorPoint?: Point;
      focusPoint?: Point;
    }
  | { type: "CLEAR_POINTS" }
  | { type: "TOGGLE_STATIC_RENDER" };

const initialState: State = {
  cursor: { x: 0, y: 0 },
  focusPoint: undefined,
  anchorPoint: undefined,
  fullText: "",
  selectedText: "",
  showSelection: true,
  lineNumbersSelectable: false,
  hasInitialized: false,
  insertedLines: [],
  useStaticRender: true,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CURSOR": {
      return {
        ...state,
        cursor: { x: action.x, y: action.y },
        focusPoint: action.focusPoint ?? state.focusPoint,
        anchorPoint: action.anchorPoint ?? state.anchorPoint,
      };
    }

    case "SELECT_WORD": {
      return {
        ...state,
        anchorPoint: action.anchorPoint,
        focusPoint: action.focusPoint,
      };
    }

    case "RESET_ANCHOR": {
      return {
        ...state,
        anchorPoint: undefined,
      };
    }

    case "TOGGLE_SELECTION_VISIBILITY": {
      return {
        ...state,
        showSelection: !state.showSelection,
      };
    }

    case "TOGGLE_LINE_NUMBERS": {
      return {
        ...state,
        lineNumbersSelectable: !state.lineNumbersSelectable,
      };
    }

    case "ADD_INSERTED_LINE": {
      return {
        ...state,
        insertedLines: [...state.insertedLines, `Inserted line ${state.insertedLines.length + 1}`],
      };
    }

    case "UPDATE_TEXT": {
      return {
        ...state,
        fullText: action.fullText,
      };
    }

    case "UPDATE_SELECTED_TEXT": {
      return {
        ...state,
        selectedText: action.selectedText,
      };
    }

    case "INITIALIZE": {
      return {
        ...state,
        hasInitialized: true,
        cursor: action.cursor,
        anchorPoint: action.anchorPoint,
        focusPoint: action.focusPoint,
      };
    }

    case "TOGGLE_STATIC_RENDER": {
      return {
        ...state,
        useStaticRender: !state.useStaticRender,
      };
    }

    case "CLEAR_POINTS": {
      return {
        ...state,
        anchorPoint: undefined,
        focusPoint: undefined,
      };
    }
  }
};

export type SelectionProperties = {
  readonly useStaticRender?: boolean;
};

const Selection = forwardRef<SelectionReference, SelectionProperties>(({ useStaticRender: initialUseStaticRender }, reference) => {
  const { exit, selection } = useApp();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    useStaticRender: initialUseStaticRender ?? false,
  });
  const boxReference = useRef<DOMElement>(null);

  useImperativeHandle(reference, () => ({
    getSelectedText: () => state.selectedText,
    getSelectionToString: () => selection?.toString() ?? "",
  }));

  useInput((input, key) => {
    if (input === "c" && key.ctrl) {
      exit();
      return;
    }

    if (input === " ") {
      dispatch({ type: "TOGGLE_LINE_NUMBERS" });
      return;
    }

    if (input === "i") {
      dispatch({ type: "ADD_INSERTED_LINE" });
      return;
    }

    if (input === "m") {
      dispatch({ type: "TOGGLE_STATIC_RENDER" });
      return;
    }

    if (input === "t") {
      dispatch({ type: "TOGGLE_SELECTION_VISIBILITY" });
      return;
    }

    if (input === "r") {
      dispatch({ type: "RESET_ANCHOR" });
      return;
    }

    if (input === "s") {
      if (!boxReference.current) return;
      const node = boxReference.current;
      const hit = hitTest(node, state.cursor.x, state.cursor.y);

      if (hit && (hit.node.nodeName === "#text" || hit.node.nodeName === "ink-static-render")) {
        const length =
          hit.node.nodeName === "#text" ? hit.node.nodeValue.length : (hit.node.cachedRender?.selectableSpans?.map((s) => s.text).join("").length ?? 0);
        // If we're at the end of the node, select the previous character
        if (hit.offset === length && length > 0) {
          dispatch({
            type: "SELECT_WORD",
            anchorPoint: { node: hit.node, offset: length - 1 },
            focusPoint: { node: hit.node, offset: length },
          });
        } else {
          dispatch({
            type: "SELECT_WORD",
            anchorPoint: { node: hit.node, offset: hit.offset },
            focusPoint: {
              node: hit.node,
              offset: Math.min(hit.offset + 1, length),
            },
          });
        }
      }

      return;
    }

    if (!boxReference.current) return;
    const node = boxReference.current;

    let newX = state.cursor.x;
    let newY = state.cursor.y;

    if (key.upArrow) newY = Math.max(0, newY - 1);
    if (key.downArrow) newY += 1;
    if (key.leftArrow) newX = Math.max(0, newX - 1);
    if (key.rightArrow) newX += 1;

    if (newX !== state.cursor.x || newY !== state.cursor.y) {
      const oldCursor = state.cursor;
      const newPoint = hitTest(node, newX, newY);

      let newAnchorPoint: Point | undefined;

      if (newPoint) {
        if (key.shift) {
          newAnchorPoint = state.anchorPoint ?? hitTest(node, oldCursor.x, oldCursor.y);
        } else {
          newAnchorPoint = undefined;
        }
      }

      dispatch({
        type: "SET_CURSOR",
        x: newX,
        y: newY,
        focusPoint: newPoint,
        anchorPoint: newAnchorPoint,
      });
    }
  });

  useEffect(() => {
    if (boxReference.current) {
      const node = boxReference.current;
      const text = getText(node);

      if (state.fullText !== text) {
        dispatch({ type: "UPDATE_TEXT", fullText: text });
      }

      if (!state.hasInitialized && text.length > 0) {
        const layout = measureElement(node);
        let cursor = { x: 0, y: 0 };
        if (layout.height > 0) {
          cursor = { x: 0, y: layout.height - 1 };
        }

        dispatch({
          type: "INITIALIZE",
          cursor,
          anchorPoint: findNodeAtOffset(node, 0),
          focusPoint: findNodeAtOffset(node, text.length),
        });
      }
    }
  });

  useEffect(() => {
    if (!selection || !boxReference.current) {
      return;
    }

    const rootNode = boxReference.current;
    let shouldClear = false;

    if (state.anchorPoint && !getPathToRoot(state.anchorPoint.node).includes(rootNode)) {
      shouldClear = true;
    }

    if (state.focusPoint && !getPathToRoot(state.focusPoint.node).includes(rootNode)) {
      shouldClear = true;
    }

    if (shouldClear) {
      dispatch({ type: "CLEAR_POINTS" });
    }

    selection.removeAllRanges();

    if (state.showSelection && state.anchorPoint && state.focusPoint) {
      const range = new Range();
      const comparison = comparePoints(state.anchorPoint.node, state.anchorPoint.offset, state.focusPoint.node, state.focusPoint.offset);

      if (comparison <= 0) {
        range.setStart(state.anchorPoint.node, state.anchorPoint.offset);
        range.setEnd(state.focusPoint.node, state.focusPoint.offset);
      } else {
        range.setStart(state.focusPoint.node, state.focusPoint.offset);
        range.setEnd(state.anchorPoint.node, state.anchorPoint.offset);
      }

      selection.addRange(range);
    }

    const newSelectedText = selection.toString();
    if (state.selectedText !== newSelectedText) {
      dispatch({ type: "UPDATE_SELECTED_TEXT", selectedText: newSelectedText });
    }
  });

  const { cursor, fullText, selectedText, lineNumbersSelectable, insertedLines, useStaticRender } = state;

  return (
    <Box flexDirection="column">
      <Box ref={boxReference} borderStyle="single" width={30} flexDirection="column">
        {useStaticRender ? (
          <StaticRender width={28}>
            <Box flexDirection="column" width="100%">
              <Text>
                <Text color="red">Hello</Text> <Text color="blue">World</Text>
              </Text>
              <Box borderStyle="single">
                <Text>
                  This is a <Text color="green">test</Text>
                </Text>
              </Box>
              <Box flexDirection="row">
                <Text>
                  <Text color="red">Row</Text> <Text color="blue">A</Text>
                </Text>
                <Text>
                  <Text color="red">Row</Text> <Text color="green">B</Text>
                </Text>
              </Box>
              <Text>{longText}</Text>
              {insertedLines.map((line) => (
                <Text key={line}>{line}</Text>
              ))}
              <Box flexDirection="column" marginTop={1} borderStyle="single">
                {codeExample.map((line, i) => (
                  <Box key={line.id} flexDirection="row">
                    <Box width={3} flexShrink={0} userSelect={lineNumbersSelectable ? undefined : "none"}>
                      <Text dimColor>{i + 1}</Text>
                    </Box>
                    <Text>
                      {" ".repeat(line.indent)}
                      {line.content}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </StaticRender>
        ) : (
          <Box flexDirection="column" width="100%">
            <Text>
              <Text color="red">Hello</Text> <Text color="blue">World</Text>
            </Text>
            <Box borderStyle="single">
              <Text>
                This is a <Text color="green">test</Text>
              </Text>
            </Box>
            <Box flexDirection="row">
              <Text>
                <Text color="red">Row</Text> <Text color="blue">A</Text>
              </Text>
              <Text>
                <Text color="red">Row</Text> <Text color="green">B</Text>
              </Text>
            </Box>
            <Text>{longText}</Text>
            {insertedLines.map((line) => (
              <Text key={line}>{line}</Text>
            ))}
            <Box flexDirection="column" marginTop={1} borderStyle="single">
              {codeExample.map((line, i) => (
                <Box key={line.id} flexDirection="row">
                  <Box width={3} flexShrink={0} userSelect={lineNumbersSelectable ? undefined : "none"}>
                    <Text dimColor>{i + 1}</Text>
                  </Box>
                  <Text>
                    {" ".repeat(line.indent)}
                    {line.content}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
      <Box marginTop={1}>
        <Text>
          Cursor: {cursor.x}, {cursor.y}
        </Text>
      </Box>
      <Box>
        <Text>Full Text Length: {fullText.length}</Text>
      </Box>
      <Box>
        <Text>Full Text JSON: {JSON.stringify(fullText)}</Text>
      </Box>
      <Box>
        <Text>
          anchorPoint:{" "}
          {state.anchorPoint
            ? `${state.anchorPoint.offset}, ${state.anchorPoint.node.nodeName === "#text" ? state.anchorPoint.node.nodeValue : state.anchorPoint.node.nodeName}`
            : "undefined"}
        </Text>
      </Box>
      <Box>
        <Text>
          focusPoint:{" "}
          {state.focusPoint
            ? `${state.focusPoint.offset}, ${state.focusPoint.node.nodeName === "#text" ? state.focusPoint.node.nodeValue : state.focusPoint.node.nodeName}`
            : "undefined"}
        </Text>
      </Box>
      <Box borderStyle="single" flexDirection="column">
        <Text>Selected Text:</Text>
        <Text>{selectedText}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>Press 't' to toggle selection visibility.</Text>
        <Text dimColor>Press 'm' to toggle StaticRender (current: {useStaticRender ? "ON" : "OFF"}).</Text>
        <Text dimColor>Press 'space' to toggle line number selection.</Text>
        <Text dimColor>Press 's' to select character under cursor.</Text>
        <Text dimColor>Use Arrow keys to move cursor. Shift+Arrow to select.</Text>
      </Box>
    </Box>
  );
});

export const test = () => render(<Selection />, { selectionStyle, trackSelection: true });
