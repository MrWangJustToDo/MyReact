import type { HTMLProps } from ".";

export const Head = ({ env = "{}", link = [], preLoad = [], preloadedState = "{}" }: HTMLProps) => (
  <head>
    <meta charSet="utf-8" />
    <meta name="theme-color" content="red" />
    <meta name="build-time" content={__BUILD_TIME__} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    {preLoad.filter(Boolean).map((ele) => ele)}
    {link.filter(Boolean).map((ele) => ele)}
    <script id="__preload_env__" type="application/json" dangerouslySetInnerHTML={{ __html: `${env}` }} />
    <script id="__preload_state__" type="application/json" dangerouslySetInnerHTML={{ __html: `${preloadedState}` }} />
    <script src="/lib/flexible.js"></script>
    <script src="/lib/myreact.js"></script>
    {/* <script src="/lib/react.development.js"></script> */}
    {/* <script src="/lib/react-dom.development.js"></script> */}
    <script src="/lib/myreact-dom.js"></script>
  </head>
);
