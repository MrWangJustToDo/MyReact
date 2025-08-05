import { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router";

import { noBase } from "@shared";

const AboutCom = __REACT__ ? () => null : lazy(() => import("@client/component/About").then(({ About }) => ({ default: About })));

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    if (__REACT__ || !__DEVELOPMENT__) {
      navigate(noBase ? "/" : `/${__BASENAME__}/`);
    }
  }, [navigate]);

  return (
    <Suspense>
      <AboutCom />
    </Suspense>
  );
}

export const isStatic = true;
