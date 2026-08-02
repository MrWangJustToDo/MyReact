import { Links, Meta, Outlet, Scripts, ScrollRestoration, json, useLoaderData, Link } from "@remix-run/react";

import styles from "~/styles/styles.css?url";
import { ThemeBody, ThemeHead, ThemeProvider, useTheme } from "~/utils/theme-provider";
import { getThemeSession } from "~/utils/theme.server";

import type { LoaderFunctionArgs, LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const themeSession = await getThemeSession(request);

  return json({
    theme: themeSession.getTheme(),
  });
};

function Document({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={theme ?? ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data.theme)} />
      </head>
      <body>
        <div className="shell">
          <header className="top">
            <Link to="/" className="brand">
              Remix + @my-react
            </Link>
            <nav className="nav">
              <Link to="/">Home</Link>
              <Link to="/foo">Loader</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
        <ThemeBody ssrTheme={Boolean(data.theme)} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <Document>
        <Outlet />
      </Document>
    </ThemeProvider>
  );
}
