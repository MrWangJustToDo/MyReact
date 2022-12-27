export const cx = (...classNames: any[]) => {
  const allClassNames = classNames.filter(Boolean).filter((c) => typeof c === "string") as string[];
  const classNamesSet = allClassNames
    .map((c) => c.split(" "))
    .reduce<Set<string>>((p, c) => {
      c.forEach((_c) => p.add(_c));
      return p;
    }, new Set());
  return new Array(...classNamesSet).join(" ");
};
