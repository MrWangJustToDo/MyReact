import { getIsSSR } from "@shared";

import { renderSSR, renderCSR } from "./renderPage";

import type { RenderType } from "@server/type";

// 渲染函数
const render: RenderType = async ({ req, res }) => {
  const { isSSR } = req.query;
  if (isSSR || getIsSSR()) {
    await renderSSR({ req, res });
  } else {
    await renderCSR({ req, res });
  }
};

export { render };
