export const fallback = (dom: ChildNode | null) => {
  const pendingRemove = [];
  while (dom) {
    pendingRemove.push(dom);
    dom = dom.nextSibling;
  }
  pendingRemove.forEach((m) => m.remove());
};
