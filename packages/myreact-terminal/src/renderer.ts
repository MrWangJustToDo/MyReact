import { type StyledChar } from "@alcalzone/ansi-tokenize";

import { type DOMElement, type DOMNode, isNodeSelectable } from "./dom";
import Output from "./output";
import renderNodeToOutput, { renderNodeToScreenReaderOutput } from "./render-node-to-output";
import { type Selection } from "./selection";

type Result = {
  output: string;
  outputHeight: number;
  staticOutput: string;
  styledOutput: StyledChar[][];
  cursorPosition?: { row: number; col: number };
};

const calculateSelectionMap = (root: DOMElement, selection: Selection): Map<DOMNode, { start: number; end: number }> => {
  const map = new Map<DOMNode, { start: number; end: number }>();

  if (selection.rangeCount === 0) {
    return map;
  }

  const range = selection.getRangeAt(0);
  const { startContainer, startOffset, endContainer, endOffset } = range;

  let hasFoundStart = false;
  let hasFoundEnd = false;

  const visit = (node: DOMNode) => {
    if (node.nodeName === "ink-text") {
      if (!isNodeSelectable(node)) {
        return;
      }

      let localLength = 0;
      let nodeStartIndex = -1;
      let nodeEndIndex = -1;
      let foundStartInNode = false;
      let foundEndInNode = false;

      const visitChildren = (n: DOMNode) => {
        if (n.nodeName === "#text") {
          const { length } = n.nodeValue;

          if (startContainer === n) {
            foundStartInNode = true;
            nodeStartIndex = localLength + startOffset;
          }

          if (endContainer === n) {
            foundEndInNode = true;
            nodeEndIndex = localLength + endOffset;
          }

          localLength += length;
        } else {
          const { childNodes } = n;
          if (childNodes) {
            for (const child of childNodes) {
              if (n === startContainer) {
                foundStartInNode = true;
                nodeStartIndex = localLength;
              }

              if (n === endContainer) {
                foundEndInNode = true;
                nodeEndIndex = localLength;
              }

              if (child) {
                visitChildren(child);
              }
            }

            if (n === startContainer && startOffset === childNodes.length) {
              foundStartInNode = true;
              nodeStartIndex = localLength;
            }

            if (n === endContainer && endOffset === childNodes.length) {
              foundEndInNode = true;
              nodeEndIndex = localLength;
            }
          }
        }
      };

      const { childNodes } = node;
      if (childNodes) {
        for (const child of childNodes) {
          if (node === startContainer) {
            foundStartInNode = true;
            nodeStartIndex = localLength;
          }

          if (node === endContainer) {
            foundEndInNode = true;
            nodeEndIndex = localLength;
          }

          if (child) {
            visitChildren(child);
          }
        }

        if (node === startContainer && startOffset === childNodes.length) {
          foundStartInNode = true;
          nodeStartIndex = localLength;
        }

        if (node === endContainer && endOffset === childNodes.length) {
          foundEndInNode = true;
          nodeEndIndex = localLength;
        }
      }

      if ((hasFoundStart || foundStartInNode) && (!hasFoundEnd || foundEndInNode)) {
        const start = foundStartInNode ? nodeStartIndex : 0;
        const end = foundEndInNode ? nodeEndIndex : localLength;

        if (start !== -1 && end !== -1 && start < end) {
          map.set(node, { start, end });
        }
      }

      if (foundStartInNode) {
        hasFoundStart = true;
      }

      if (foundEndInNode) {
        hasFoundEnd = true;
      }
    } else {
      const { childNodes } = node as DOMElement;
      if (childNodes) {
        for (const child of childNodes) {
          if (node === startContainer) {
            hasFoundStart = true;
          }

          if (node === endContainer) {
            hasFoundEnd = true;
          }

          if (child) {
            visit(child);
          }
        }

        if (node === startContainer && startOffset === childNodes.length) {
          hasFoundStart = true;
        }

        if (node === endContainer && endOffset === childNodes.length) {
          hasFoundEnd = true;
        }
      }
    }
  };

  visit(root);

  return map;
};

const renderer = (node: DOMElement, isScreenReaderEnabled: boolean, selection?: Selection, selectionStyle?: (char: StyledChar) => StyledChar): Result => {
  if (node.yogaNode) {
    if (isScreenReaderEnabled) {
      const output = renderNodeToScreenReaderOutput(node, {
        skipStaticElements: true,
      });

      const outputHeight = output === "" ? 0 : output.split("\n").length;

      let staticOutput = "";

      if (node.staticNode) {
        staticOutput = renderNodeToScreenReaderOutput(node.staticNode, {
          skipStaticElements: false,
        });
      }

      return {
        output,
        outputHeight,
        staticOutput: staticOutput ? `${staticOutput}\n` : "",
        styledOutput: [],
      };
    }

    const output = new Output({
      width: node.yogaNode.getComputedWidth(),
      height: node.yogaNode.getComputedHeight(),
    });

    const selectionMap = selection ? calculateSelectionMap(node, selection) : undefined;

    renderNodeToOutput(node, output, {
      skipStaticElements: true,
      selectionStyle,
      selectionMap,
    });

    let staticOutput;

    if (node.staticNode?.yogaNode) {
      staticOutput = new Output({
        width: node.staticNode.yogaNode.getComputedWidth(),
        height: node.staticNode.yogaNode.getComputedHeight(),
      });

      renderNodeToOutput(node.staticNode, staticOutput, {
        skipStaticElements: false,
        selectionStyle,
        selectionMap: selection ? calculateSelectionMap(node.staticNode, selection) : undefined,
      });
    }

    const { output: generatedOutput, height: outputHeight, styledOutput, cursorPosition } = output.get();

    return {
      output: generatedOutput,
      outputHeight,
      // Newline at the end is needed, because static output doesn't have one, so
      // interactive output will override last line of static output
      staticOutput: staticOutput ? `${staticOutput.get().output}\n` : "",
      styledOutput,
      cursorPosition,
    };
  }

  return {
    output: "",
    outputHeight: 0,
    staticOutput: "",
    styledOutput: [],
  };
};

export default renderer;
