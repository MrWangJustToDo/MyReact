export type RouteMatch = { name: "home" } | { name: "about" } | { name: "profile"; id: string };

export const matchRoute = (url: string): RouteMatch => {
  const parsed = new URL(url, "http://localhost");
  const path = parsed.pathname.replace(/\/+$/, "") || "/";

  if (path === "/about") {
    return { name: "about" };
  }

  const profile = path.match(/^\/profile(?:\/([^/]+))?$/);
  if (profile) {
    return { name: "profile", id: profile[1] || "guest" };
  }

  return { name: "home" };
};
