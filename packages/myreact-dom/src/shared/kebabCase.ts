const memorize = <T = any, F = any>(fn: (...p: T[]) => F) => {
  const map: Record<string, any> = {};
  return (...p: T[]) => {
    const key = p.join(",");
    if (key in map) {
      return map[key];
    }
    map[key] = fn.call(null, ...p);
    return map[key];
  };
};

export const kebabCase = memorize((s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase());
