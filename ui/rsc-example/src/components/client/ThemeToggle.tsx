"use client";

import { useEffect, useState } from "@my-react/react";
import { Suspense } from "react";

import { ThemeDark } from "../server/ThemeDark";
import { ThemeLight } from "../server/ThemeLight";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <button onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))} className="btn">
      <Suspense>Theme: {theme === "dark" ? <ThemeDark /> : <ThemeLight />}</Suspense>
    </button>
  );
}
