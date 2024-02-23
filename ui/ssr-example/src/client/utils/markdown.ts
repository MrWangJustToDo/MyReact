import Mark from "markdown-it";

import { getHighlightHtml, hljs } from "./highlight";

const temp = new Mark();

const mark = new Mark({
  html: true,
  xhtmlOut: true,
  breaks: true,
  highlight: function (str, lang) {
    return getHighlightHtml(str, lang);
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
