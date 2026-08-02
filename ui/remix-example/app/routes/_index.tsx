import { Link } from "@remix-run/react";

import { Theme, Themed, useTheme } from "~/utils/theme-provider";

export default function Index() {
  const [, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <section className="panel">
      <h1>Vite React template surface</h1>
      <p className="muted">Remix route + MyReact hydrate. Theme toggle uses a cookie session.</p>
      <div className="actions">
        <button type="button" onClick={toggleTheme}>
          Toggle theme
        </button>
        <Link className="ghost" to="/foo">
          Async loader demo
        </Link>
      </div>
      <Themed dark={<p className="badge">Dark mode active</p>} light={<p className="badge">Light mode active</p>} />
    </section>
  );
}
