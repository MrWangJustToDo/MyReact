import PrettyError from "pretty-error";
import { renderToString } from "react-dom/server";

import { HTML } from "template/Html";

import type { RenderErrorType } from "types/server";

const pre = new PrettyError();

const renderError: RenderErrorType = ({ res, code, e }) =>
  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML>
          {`<h1>server render error!</h1>
            <hr />
            <div style='padding-left: 10px; font-size: 20px'>
              error code:
              <b>${code}</b>
              <br />
              <br />
              <pre style='font-size: 18px; color: red;'>${e.stack}</pre>
            </div>
          <script>console.error(\`${pre.render(e, true, false)}\`)</script>`}
        </HTML>
      )
  );

export { renderError };
