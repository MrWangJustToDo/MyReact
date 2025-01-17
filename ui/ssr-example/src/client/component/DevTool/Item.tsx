import { chakra } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useIsMounted } from "@client/hooks";

const Iframe = chakra("iframe");

// export const sourceSrc = "http://localhost:3000";
export const sourceSrc = "https://mrwangjusttodo.github.io/myreact-devtools";

export const loadScript = (url: string) => {
  const script = document.createElement("script");
  return new Promise((resolve, reject) => {
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  }).finally(() => script.remove());
};

export const IframeDevTool = () => {
  const [loaded, setLoaded] = useState(false);

  const token = useMemo(() => Math.random().toString(36).slice(2), []);

  const isMounted = useIsMounted();

  const ref = useRef<HTMLIFrameElement>();

  useEffect(() => {
    if (loaded) {
      window["__MY_REACT_DEVTOOL_IFRAME__"]?.(sourceSrc, token);

      return () => window["__MY_REACT_DEVTOOL_IFRAME__"]?.close?.();
    }
  }, [loaded, token]);

  if (!isMounted) return null;

  return <Iframe ref={ref} src={`${sourceSrc}/devTool?token=${token}`} onLoad={() => setLoaded(true)} width="100%" height="100%" />;
};
