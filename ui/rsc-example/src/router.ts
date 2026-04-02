export type RouteMatch = { name: "home" } | { name: "about" } | { name: "profile"; id: string };

export const matchRoute = (url: string): RouteMatch => {
  const parsed = new URL(url, "http://localhost");
  const path = parsed.pathname;
  const tab = parsed.searchParams.get("tab");

  if (tab === "profile") {
    return { name: "profile", id: "guest" };
  }

  if (tab === "about") {
    return { name: "about" };
  }

  if (path === "/" || path === "") {
    return { name: "home" };
  }

  return { name: "home" };
};
