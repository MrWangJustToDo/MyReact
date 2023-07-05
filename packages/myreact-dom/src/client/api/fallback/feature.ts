/**
 * @internal
 */
export const fallback = (el?: ChildNode) => {
  if (el) {
    const sibling = el.nextSibling;

    el?.remove();

    fallback(sibling);
  }
};
