import Mark from "markdown-it";

import { hljs } from "./highlight";

const temp = new Mark();

const mark = new Mark({
  html: true,
  xhtmlOut: true,
  breaks: true,
  highlight: function (str, lang) {
    let code = "";
    try {
      if (lang && hljs.getLanguage(lang)) {
        code = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
      } else {
        code = hljs.highlightAuto(str, ["typescript", "javascript", "xml", "scss", "less", "json", "bash"]).value;
      }
      const transformArr = code.split(/\n/).slice(0, -1);
      const minWidth = String(transformArr.length).length - 0.2;
      const html = transformArr.reduce(
        (p: string, c: string, idx: number) =>
          `${p}<span class='no-select d-inline-block text-center border-right pr-2 mr-2 border-dark' style='min-width: ${minWidth}em; line-height: 1.5'>${
            idx + 1
          }</span>${c}\n`,
        `<div class='w-100 position-absolute' style='left: 0; top: 0; font-size: 0px'>
          <b class='no-select position-absolute text-info' style='left: 10px; font-size: 12px; top: 4px;'>${lang}</b>
          <div class='position-absolute w-100 border-bottom border-dark' style='left: 0; top: 24px;'></div>
        </div>`
      );
      return `<pre class="rounded position-relative"><code class="hljs ${lang}" style='padding-top: 30px;'>${html}</code></pre>`;
    } catch (__) {
      void 0;
    }
    // if (lang && hljs.getLanguage(lang)) {
    //   try {
    //     let code = hljs.highlight(str, {
    //       language: lang,
    //       ignoreIllegals: true,
    //     }).value;
    //     // code = hljs.highlightAuto(str, ["typescript", "javascript", "xml", "scss", "less", "json", "bash"]).value;
    //     const transformArr = code.split(/\n/).slice(0, -1);
    //     const minWidth = String(transformArr.length).length - 0.2;
    //     const html = transformArr.reduce(
    //       (p: string, c: string, idx: number) =>
    //         `${p}<span class='no-select d-inline-block text-center border-right pr-2 mr-2 border-dark' style='min-width: ${minWidth}em; line-height: 1.5'>${
    //           idx + 1
    //         }</span>${c}\n`,
    //       `<div class='w-100 position-absolute' style='left: 0; top: 0; font-size: 0px'>
    //         <b class='no-select position-absolute text-info' style='left: 10px; font-size: 12px; top: 4px;'>${lang}</b>
    //         <div class='position-absolute w-100 border-bottom border-dark' style='left: 0; top: 24px;'></div>
    //       </div>`
    //     );
    //     return `<pre class="rounded position-relative"><code class="hljs ${lang}" style='padding-top: 30px;'>${html}</code></pre>`;
    //   } catch (__) {
    //     void 0;
    //   }
    // }
    // return '<pre class="rounded"><code class="hljs">' + temp.utils.escapeHtml(str) + "</code></pre>";
  },
});

const addIdForHeads = (className?: string) => {
  if (className) {
    const headings = document.querySelector(className)?.querySelectorAll("h1, h2, h3, h4, h5, h6, h7") || [];
    const headingMap: { [props: string]: number } = {};
    Array.prototype.forEach.call(headings, function (heading) {
      const id = heading.id
        ? heading.id
        : heading.textContent
            .trim()
            .toLowerCase()
            .split(" ")
            .join("-")
            .replace(/[!@#$%^&*():]/gi, "")
            .replace(/\//gi, "-");
      headingMap[id] = !isNaN(headingMap[id]) ? ++headingMap[id] : 0;
      if (headingMap[id]) {
        heading.id = id + "-" + headingMap[id];
      } else {
        heading.id = id;
      }
    });
    return !!headings.length;
  }
};

const markNOLineNumber = new Mark({
  html: true,
  xhtmlOut: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const transformValue = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
        return `<pre class="rounded bg-dark"><code class="bg-dark hljs ${lang}">${transformValue}</code></pre>`;
      } catch (__) {
        void 0;
      }
    }
    return `<pre class="rounded bg-dark"><code class="bg-dark hljs">${temp.utils.escapeHtml(str)}</code></pre>`;
  },
});

export { mark, markNOLineNumber, addIdForHeads };
