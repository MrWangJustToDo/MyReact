import { useNavigate } from "@remix-run/react";

import { Test } from "~/components/Test";
import styles from "~/styles/styles.css?url";
import { Theme, Themed, useTheme } from "~/utils/theme-provider";

import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
  const [, setTheme] = useTheme();

  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  console.warn("This is an error message");

  return (
    <>
      <button onClick={toggleTheme}>Toggle</button>
      <button style={{ marginLeft: "10px" }} onClick={() => navigate("/foo")}>
        Go to foo
      </button>
      <Themed
        dark={<h1 className="dark-component">I&apos;m only seen in dark mode</h1>}
        light={<h1 className="light-component">I&apos;m only seen in light mode</h1>}
      />
      <Test />
    </>
  );
}
