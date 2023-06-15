import { noBase } from "@shared";

import type { HTMLProps } from ".";

export const Head = ({ env = "{}", link = [], preLoad = [], preloadedState = "{}", helmetContext: { helmet } = {}, emotionChunks }: HTMLProps) => (
  <head>
    <meta charSet="utf-8" />
    <meta name="build-time" content={__BUILD_TIME__} />
    <meta name="power-by" content={`@my-react ꒰ঌ( ⌯' '⌯)໒꒱`} />
    <meta name="author" content="MrWangJustToDo" />
    <meta
      name="description"
      content="@my-react is a React like package, it can be used to build a modern website just like this, feel free to use and fire a issue if you have! link: https://github.com/MrWangJustToDo/MyReact"
    />
    <meta name="keywords" content="react, react-dom, ssr, csr, ssg" />
    <base href={noBase ? "/" : `/${__BASENAME__}/`} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
    {/* a type issue for react-helmet-async  */}
    <>
      {helmet?.base.toComponent()}
      {helmet?.title.toComponent()}
      {helmet?.meta.toComponent()}
      {helmet?.link.toComponent()}
      {helmet?.noscript.toComponent()}
      {helmet?.style.toComponent()}
      {helmet?.script.toComponent()}
    </>
    {preLoad.filter(Boolean).map((ele) => ele)}
    {link.filter(Boolean).map((ele) => ele)}
    {emotionChunks?.styles.map((style, index) => (
      <style data-server data-emotion={`${style.key} ${style.ids.join(" ")}`} key={style.key + "_" + index} dangerouslySetInnerHTML={{ __html: style.css }} />
    ))}
    <script id="__preload_env__" type="application/json" dangerouslySetInnerHTML={{ __html: `${env}` }} />
    <script id="__preload_state__" type="application/json" dangerouslySetInnerHTML={{ __html: `${preloadedState}` }} />
  </head>
);
