// 语法高亮
import Hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import less from "highlight.js/lib/languages/less";
import markdown from "highlight.js/lib/languages/markdown";
import scss from "highlight.js/lib/languages/scss";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";

Hljs.registerLanguage("css", css);
Hljs.registerLanguage("json", json);
Hljs.registerLanguage("java", java);
Hljs.registerLanguage("bash", bash);
Hljs.registerLanguage("markdown", markdown);
Hljs.registerLanguage("javascript", javascript);
Hljs.registerLanguage("typescript", typescript);
Hljs.registerLanguage("less", less);
Hljs.registerLanguage("scss", scss);
Hljs.registerLanguage("shell", shell);
Hljs.registerLanguage("xml", xml);
Hljs.registerLanguage("sql", sql);

export const hljs = Hljs;

export const getHighlightHtml = (str: string, lang: string) => {
  let code = "";
  let language = lang;
  try {
    if (lang && hljs.getLanguage(lang)) {
      const re = hljs.highlight(str, {
        language: lang,
        ignoreIllegals: true,
      });
      code = re.value;
      language = re.language;
    } else {
      const re = hljs.highlightAuto(str);
      code = re.value;
      language = re.language;
    }
    const transformArr = code.split(/\n/).slice(0, -1);
    const minWidth = String(transformArr.length).length - 0.2;
    const html = transformArr.reduce(
      (p: string, c: string, idx: number) =>
        `${p}<span class='no-select code-num d-inline-block text-center border-right pr-2 mr-2 border-dark' style='min-width: ${minWidth}em; line-height: 1.5'>${
          idx + 1
        }</span>${c}\n`,
      `<div class='w-100 position-absolute' style='left: 0; top: 0; font-size: 0px'>
        <b class='no-select position-absolute text-info' style='left: 10px; font-size: 12px; top: 4px;'>${language}</b>
        <div class='position-absolute w-100 border-bottom border-dark' style='left: 0; top: 24px;'></div>
      </div>`
    );
    return `<pre class="rounded position-relative"><code class="hljs ${language}" style='padding-top: 30px;'>${html}</code></pre>`;
  } catch (__) {
    void 0;
  }
};
