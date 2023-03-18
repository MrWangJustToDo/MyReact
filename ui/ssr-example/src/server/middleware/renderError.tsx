import { renderToString } from "react-dom/server";

import { HTML } from "@shared";

import type { RenderErrorType } from "../type";

const renderError: RenderErrorType = ({ res, code, e }) => {
  let message = e.stack || e.message;
  message = message.replace(/`/g, "\\`");
  return res.send(
    "<!doctype html>" +
      renderToString(
        <HTML>
          {`<h1>server render error!</h1>
            <hr />
            <div style='padding-left: 10px; font-size: 20px;'>
              error code:
              <b>${code}</b>
              <br />
              <br />
              <pre style='font-size: 18px; color: red;'>${e.message}</pre>
            </div>
          <script>console.error(\`${message}\`)</script>`}
        </HTML>
      )
  );
};

export { renderError };
