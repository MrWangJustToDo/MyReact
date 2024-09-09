import { version } from "@my-react/react";

import { noBase } from "@shared";

import type { HTMLProps } from ".";

export const Head = ({ env = "{}", link = [], preLoad = [], preloadedState = "{}", helmetContext: { helmet } = {}, emotionChunks }: HTMLProps) => (
  <head>
    <meta charSet="utf-8" />
    <meta name="build-time" content={__BUILD_TIME__} />
    <meta name="power-by" content={`@my-react ꒰ঌ( ⌯' '⌯)໒꒱`} />
    <meta name="version" content={version} />
    <meta name="author" content="MrWangJustToDo" />
    <meta
      name="description"
      content="@my-react is a React like framework, it can be used to build a modern website just like this, feel free to use and fire a issue if you have! link: https://github.com/MrWangJustToDo/MyReact"
    />
    <meta name="keywords" content="react, react-dom, ssr, csr, ssg, @my-react, react like, react framework" />
    <base href={noBase ? "/" : `/${__BASENAME__}/`} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
    {/* <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/google-sans"></link> */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
    {/* @ts-ignore */}
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"></link>
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
