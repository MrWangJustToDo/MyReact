import Yoga, { type Node as YogaNode } from "yoga-layout";

const getMaxWidth = (yogaNode: YogaNode) => {
  return (
    Math.min(yogaNode.getComputedWidth(), yogaNode.getParent()?.getComputedWidth() ?? yogaNode.getComputedWidth()) -
    yogaNode.getComputedPadding(Yoga.EDGE_LEFT) -
    yogaNode.getComputedPadding(Yoga.EDGE_RIGHT) -
    yogaNode.getComputedBorder(Yoga.EDGE_LEFT) -
    yogaNode.getComputedBorder(Yoga.EDGE_RIGHT)
  );
};

export default getMaxWidth;
