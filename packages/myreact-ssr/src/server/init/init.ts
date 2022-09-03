import { catchMiddlewareHandler, compose, defaultRunRequestMiddleware, wrapperMiddlewareRequest } from "server/middleware/apiHandler";

const initSession = wrapperMiddlewareRequest(
  {
    requestHandler: function initSession({ req }) {
      if (!req.session.views) {
        req.session.views = {};
      }
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

const decodeURI = wrapperMiddlewareRequest(
  {
    requestHandler: function decodeURI({ req }) {
      req.url = decodeURIComponent(req.url);
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

export { initSession, decodeURI };
