import { wrapperMiddlewareRequest } from "./middleware/apiHandler";
import { render } from "./middleware/render";
import { renderError } from "./middleware/renderError";

export const generateHandler = () =>
  wrapperMiddlewareRequest({
    requestHandler: render,
    errorHandler: ({ req, res, code, e }) => renderError({ req, res, e, code }),
  });
