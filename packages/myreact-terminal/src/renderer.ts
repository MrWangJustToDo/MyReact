import { type DOMElement, type DOMNode, isNodeSelectable, type StickyHeader } from "./dom.js";
import Output, { type Region, flattenRegion, clampCursorColumn } from "./output.js";
import renderNodeToOutput from "./render-node-to-output.js";
import { renderNodeToScreenReaderOutput } from "./render-screen-reader.js";
import { type Selection } from "./selection.js";
import { type StyledLine } from "./styled-line.js";
import { styledLineToString } from "./tokenize.js";

type Result = {
  output: string;
  outputHeight: number;
  staticOutput: string;
  styledOutput: StyledLine[];
  cursorPosition?: { row: number; col: number };
  stickyHeaders: StickyHeader[];
  root?: Region;
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
    } else if (node.nodeName === "ink-static-render") {
      if (!isNodeSelectable(node)) {
        return;
      }

      // For StaticRender, the node itself is returned by hitTest and behaves like a text node.
      // However, if the user clicked inside it, startContainer or endContainer might be this node itself,
      // or it could be spanned by a selection outside it.
      const localLength = node.cachedRender?.selectableText?.length ?? 0;
      let nodeStartIndex = -1;
      let nodeEndIndex = -1;
      let foundStartInNode = false;
      let foundEndInNode = false;

      if (startContainer === node) {
        foundStartInNode = true;
        nodeStartIndex = startOffset;
      }

      if (endContainer === node) {
        foundEndInNode = true;
        nodeEndIndex = endOffset;
      }

      // Also check if its parent contains it as start/end, though hitTest usually sets the node itself
      if (node.parentNode) {
        const index = node.parentNode.childNodes.indexOf(node);
        if (startContainer === node.parentNode && startOffset === index) {
          foundStartInNode = true;
          nodeStartIndex = 0;
        }

        if (endContainer === node.parentNode && endOffset === index + 1) {
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

const renderer = (
  node: DOMElement,
  options: {
    isScreenReaderEnabled: boolean;
    selection?: Selection;
    selectionStyle?: (line: StyledLine, index: number) => void;
    skipScrollbars?: boolean;
    trackSelection?: boolean;
  }
): Result => {
  const { isScreenReaderEnabled, selection, selectionStyle, skipScrollbars, trackSelection } = options;

  const callBeforeRender = (n: DOMElement) => {
    if (typeof n.internal_onBeforeRender === "function") {
      n.internal_onBeforeRender(n, { trackSelection });
    }

    for (const child of n.childNodes) {
      if (child.nodeName !== "#text") {
        callBeforeRender(child);
      }
    }
  };

  callBeforeRender(node);

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
        stickyHeaders: [],
      };
    }

    const output = new Output({
      width: node.yogaNode.getComputedWidth(),
      height: node.yogaNode.getComputedHeight(),
      node,
      trackSelection,
    });

    const selectionMap = selection ? calculateSelectionMap(node, selection) : undefined;

    renderNodeToOutput(node, output, {
      skipStaticElements: true,
      selectionStyle,
      selectionMap,
      trackSelection,
    });

    let staticOutput;

    if (node.staticNode?.yogaNode) {
      staticOutput = new Output({
        width: node.staticNode.yogaNode.getComputedWidth(),
        height: node.staticNode.yogaNode.getComputedHeight(),
        node: node.staticNode,
        id: node.staticNode.internal_id,
        trackSelection,
      });

      renderNodeToOutput(node.staticNode, staticOutput, {
        skipStaticElements: false,
        selectionStyle,
        selectionMap: selection ? calculateSelectionMap(node.staticNode, selection) : undefined,
        trackSelection,
      });
    }

    const rootRegion = output.get();

    const { output: generatedOutput, height: outputHeight, styledOutput, cursorPosition } = regionToOutput(rootRegion, { skipScrollbars });

    return {
      output: generatedOutput,
      outputHeight,
      // Newline at the end is needed, because static output doesn't have one, so
      // interactive output will override last line of static output.
      staticOutput: staticOutput ? `${regionToOutput(staticOutput.get()).output}\n` : "",
      styledOutput,
      cursorPosition,
      stickyHeaders: [],
      root: rootRegion,
    };
  }

  return {
    output: "",
    outputHeight: 0,
    staticOutput: "",
    styledOutput: [],
    stickyHeaders: [],
    root: undefined,
  };
};

function regionToOutput(
  region: Region,
  options?: {
    skipScrollbars?: boolean;
  }
) {
  const context: { cursorPosition?: { row: number; col: number } } = {};
  const lines = flattenRegion(region, { context, ...options });

  if (context.cursorPosition) {
    const { row, col } = context.cursorPosition;
    const line = lines[row];

    if (line) {
      context.cursorPosition.col = clampCursorColumn(line, col);
    }
  }

  // Flatten the root region for legacy string output
  const generatedOutput = lines
    .map((line) => {
      return styledLineToString(line.trimEnd());
    })
    .join("\n");
  return {
    output: generatedOutput,
    height: lines.length,
    styledOutput: lines,
    cursorPosition: context.cursorPosition,
  };
}

export default renderer;
