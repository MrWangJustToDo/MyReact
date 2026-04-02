import { Suspense } from "@my-react/react";

import Nav from "./components/Nav";
import AboutPage from "./pages/About";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import { matchRoute } from "./router";

type RootProps = {
  url: string;
};

export default function Root({ url }: RootProps) {
  const route = matchRoute(url);

  console.log(route);

  return (
    <div className="container">
      <Nav active={route.name} />
      <Suspense fallback={<p className="loading">Loading page...</p>}>
        {route.name === "home" && <HomePage />}
        {route.name === "about" && <AboutPage />}
        {route.name === "profile" && <ProfilePage id={route.id} />}
      </Suspense>
    </div>
  );
}
