/* eslint-disable @typescript-eslint/no-var-requires */
import { wrapperMiddlewareRequest } from "./middleware/apiHandler";
import { renderError } from "./middleware/renderError";

export const generateHandler = () => {
  if (__CSR__) {
    const { renderP_CSR } = require("./middleware/renderPage/renderP_CSR");
    return wrapperMiddlewareRequest({
      requestHandler: renderP_CSR,
      errorHandler: ({ req, res, code, e }) => renderError({ req, res, e, code }),
    });
  } else {
    const { render } = require("./middleware/render");
    return wrapperMiddlewareRequest({
      requestHandler: render,
      errorHandler: ({ req, res, code, e }) => renderError({ req, res, e, code }),
    });
  }
};
