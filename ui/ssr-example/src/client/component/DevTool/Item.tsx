import { chakra } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { useIsMounted } from "@client/hooks";

const Iframe = chakra("iframe");

const from = "hook";

const source = "@my-react/devtool";

// const iframeSrc = "http://localhost:3000";
const iframeSrc = 'https://mrwangjusttodo.github.io/myreact-devtools/devTool';

const loadScript = (url: string) => {
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

  const isMounted = useIsMounted();

  const ref = useRef<HTMLIFrameElement>();

  useEffect(() => {
    const initIframeDevTool = async (c: AbortController) => {
      if (loaded) {
        if (!window["__MY_REACT_DEVTOOL_RUNTIME__"] || typeof window["__MY_REACT_DEVTOOL_RUNTIME__"] !== "function") {
          await loadScript("https://mrwangjusttodo.github.io/myreact-devtools/bundle/hook.js");

          const allDispatch = window['__@my-react/dispatch__'];

          allDispatch.forEach(d => window.__MY_REACT_DEVTOOL_RUNTIME__?.(d));
        }
        window.addEventListener(
          "message",
          (e) => {
            if (e.source === window && e.data && e.data.source === source && e.data.from === from) {
              ref.current?.contentWindow?.postMessage?.(e.data, "*");
            }
          },
          { signal: c.signal }
        );
      }
    };
    if (loaded) {
      const control = new AbortController();

      initIframeDevTool(control);

      return () => {
        control.abort();
      };
    }
  }, [loaded]);

  if (!isMounted) return null;

  return <Iframe ref={ref} src={iframeSrc} onLoad={() => setLoaded(true)} width="100%" height="100%" />;
};
