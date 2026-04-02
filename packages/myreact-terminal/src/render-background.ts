import { getBackgroundColorEscape } from "./colorize.js";
import { type DOMElement, type DOMNode } from "./dom.js";
import { StyledLine } from "./styled-line.js";

import type Output from "./output.js";

const renderBackground = (x: number, y: number, node: DOMNode, output: Output): void => {
  if (!(node as DOMElement).internal_opaque && !node.style.backgroundColor) {
    return;
  }

  const width = node.yogaNode!.getComputedWidth();
  const height = node.yogaNode!.getComputedHeight();

  // Calculate the actual content area considering borders
  const leftBorderWidth = node.style.borderStyle && node.style.borderLeft !== false ? 1 : 0;
  const rightBorderWidth = node.style.borderStyle && node.style.borderRight !== false ? 1 : 0;
  const topBorderHeight = node.style.borderStyle && node.style.borderTop !== false ? 1 : 0;
  const bottomBorderHeight = node.style.borderStyle && node.style.borderBottom !== false ? 1 : 0;

  const contentWidth = width - leftBorderWidth - rightBorderWidth;
  const contentHeight = height - topBorderHeight - bottomBorderHeight;

  if (!(contentWidth > 0 && contentHeight > 0)) {
    return;
  }

  const bgColorEsc = node.style.backgroundColor ? getBackgroundColorEscape(node.style.backgroundColor) : undefined;
  let backgroundChars: StyledLine;
  if (bgColorEsc) {
    backgroundChars = new StyledLine();
    for (let i = 0; i < contentWidth; i++) {
      backgroundChars.pushChar(" ", 0, undefined, bgColorEsc);
    }
  } else {
    backgroundChars = StyledLine.empty(contentWidth);
  }

  for (let row = 0; row < contentHeight; row++) {
    output.write(x + leftBorderWidth, y + topBorderHeight + row, backgroundChars, { transformers: [] });
  }
};

export default renderBackground;
