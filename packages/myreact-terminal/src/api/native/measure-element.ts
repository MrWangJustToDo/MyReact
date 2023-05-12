import type { DOMElement } from "./dom";

type Output = {
	/**
	 * Element width.
	 */
	width: number;

	/**
	 * Element height.
	 */
	height: number;
};

/**
 * Measure the dimensions of a particular `<Box>` element.
 */
export const measureElement = (node: DOMElement): Output => ({
	width: node.yogaNode?.getComputedWidth() ?? 0,
	height: node.yogaNode?.getComputedHeight() ?? 0
});

