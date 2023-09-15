import { getIsSSR } from "@shared";

import { renderSSR, renderCSR, renderStreamSSR } from "./renderPage";

import type { RenderType } from "../type";

// 渲染函数
const render: RenderType = async ({ req, res }) => {
  const { isSSR } = req.query;
  if (isSSR || getIsSSR()) {
    if (__STREAM__) {
      await renderStreamSSR({ req, res });
    } else {
      await renderSSR({ req, res });
    }
  } else {
    await renderCSR({ req, res });
  }
};

export { render };
