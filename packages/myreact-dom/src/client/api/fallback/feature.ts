/**
 * @internal
 */
export function fallback(el?: ChildNode | null) {
  if (el) {
    const sibling = el.nextSibling;

    el?.remove();

    fallback(sibling);
  }
}
