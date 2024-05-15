/* eslint-disable max-lines */
import { __my_react_shared__ } from "@my-react/react";
import { getFiberTree } from "@my-react/react-reconciler";

import { logOnce } from "./debug";
import { makeMap } from "./tools";

import type { MyReactFiberNodeClientDev } from "@my-react-dom-client/renderDispatch";

const { enableOptimizeTreeLog } = __my_react_shared__;

// https://html.spec.whatwg.org/multipage/syntax.html#special
const specialTags = makeMap(
  [
    "address",
    "applet",
    "area",
    "article",
    "aside",
    "base",
    "basefont",
    "bgsound",
    "blockquote",
    "body",
    "br",
    "button",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dir",
    "div",
    "dl",
    "dt",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "iframe",
    "img",
    "input",
    "isindex",
    "li",
    "link",
    "listing",
    "main",
    "marquee",
    "menu",
    "menuitem",
    "meta",
    "nav",
    "noembed",
    "noframes",
    "noscript",
    "object",
    "ol",
    "p",
    "param",
    "plaintext",
    "pre",
    "script",
    "section",
    "select",
    "source",
    "style",
    "summary",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul",
    "wbr",
    "xmp",
  ].join(",")
);

// https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
const inScopeTags = makeMap(
  [
    "applet",
    "caption",
    "html",
    "table",
    "td",
    "th",
    "marquee",
    "object",
    "template",

    // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
    // TODO: Distinguish by namespace here -- for <title>, including it here
    // errs on the side of fewer warnings
    "foreignObject",
    "desc",
    "title",
  ].join(",")
);

// https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-button-scope
const buttonScopeTags = __DEV__
  ? makeMap(
      [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",

        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title",
        "button",
      ].join(",")
    )
  : [];

// https://html.spec.whatwg.org/multipage/syntax.html#generate-implied-end-tags
const impliedEndTags = makeMap(["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"].join(","));

type AncestorInfoDev = MyReactFiberNodeClientDev["_debugTreeScope"];

const emptyAncestorInfoDev: AncestorInfoDev = {
  current: null,

  formTag: null,
  aTagInScope: null,
  buttonTagInScope: null,
  nobrTagInScope: null,
  pTagInButtonScope: null,

  listItemTagAutoClosing: null,

  dlItemTagAutoClosing: null,

  containerTagInScope: null,
};

function isTagValidWithParent(tag: string, parentTag?: string): boolean {
  // First, let's check if we're in an unusual parsing mode...
  switch (parentTag) {
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
    case "select":
      return tag === "hr" || tag === "option" || tag === "optgroup" || tag === "#text";
    case "optgroup":
      return tag === "option" || tag === "#text";
    // Strictly speaking, seeing an <option> doesn't mean we're in a <select>
    // but
    case "option":
      return tag === "#text";
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
    // No special behavior since these rules fall back to "in body" mode for
    // all except special table nodes which cause bad parsing behavior anyway.

    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr
    case "tr":
      return tag === "th" || tag === "td" || tag === "style" || tag === "script" || tag === "template";
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
    case "tbody":
    case "thead":
    case "tfoot":
      return tag === "tr" || tag === "style" || tag === "script" || tag === "template";
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
    case "colgroup":
      return tag === "col" || tag === "template";
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
    case "table":
      return (
        tag === "caption" ||
        tag === "colgroup" ||
        tag === "tbody" ||
        tag === "tfoot" ||
        tag === "thead" ||
        tag === "style" ||
        tag === "script" ||
        tag === "template"
      );
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
    case "head":
      return (
        tag === "base" ||
        tag === "basefont" ||
        tag === "bgsound" ||
        tag === "link" ||
        tag === "meta" ||
        tag === "title" ||
        tag === "noscript" ||
        tag === "noframes" ||
        tag === "style" ||
        tag === "script" ||
        tag === "template"
      );
    // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
    case "html":
      return tag === "head" || tag === "body" || tag === "frameset";
    case "frameset":
      return tag === "frame";
    case "#document":
      return tag === "html";
  }

  // Probably in the "in body" parsing mode, so we outlaw only tag combos
  // where the parsing rules cause implicit opens or closes to be added.
  // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
  switch (tag) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return parentTag !== "h1" && parentTag !== "h2" && parentTag !== "h3" && parentTag !== "h4" && parentTag !== "h5" && parentTag !== "h6";

    case "rp":
    case "rt":
      return !impliedEndTags[parentTag];

    case "body":
    case "caption":
    case "col":
    case "colgroup":
    case "frameset":
    case "frame":
    case "head":
    case "html":
    case "tbody":
    case "td":
    case "tfoot":
    case "th":
    case "thead":
    case "tr":
      // These tags are only valid with a few parents that have special child
      // parsing rules -- if we're down here, then none of those matched and
      // so we allow it only if we don't know what the parent is, as all other
      // cases are invalid.
      return parentTag == null;
  }

  return true;
}

function findInvalidAncestorForTag(tag: string, ancestorInfo: AncestorInfoDev): MyReactFiberNodeClientDev {
  switch (tag) {
    case "address":
    case "article":
    case "aside":
    case "blockquote":
    case "center":
    case "details":
    case "dialog":
    case "dir":
    case "div":
    case "dl":
    case "fieldset":
    case "figcaption":
    case "figure":
    case "footer":
    case "header":
    case "hgroup":
    case "main":
    case "menu":
    case "nav":
    case "ol":
    case "p":
    case "section":
    case "summary":
    case "ul":
    case "pre":
    case "listing":
    case "table":
    case "hr":
    case "xmp":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return ancestorInfo.pTagInButtonScope;

    case "form":
      return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;

    case "li":
      return ancestorInfo.listItemTagAutoClosing;

    case "dd":
    case "dt":
      return ancestorInfo.dlItemTagAutoClosing;

    case "button":
      return ancestorInfo.buttonTagInScope;

    case "a":
      // Spec says something about storing a list of markers, but it sounds
      // equivalent to this check.
      return ancestorInfo.aTagInScope;

    case "nobr":
      return ancestorInfo.nobrTagInScope;
  }

  return null;
}

export function updatedAncestorInfoDev(tag: string, fiber: MyReactFiberNodeClientDev, oldInfo: AncestorInfoDev | null): AncestorInfoDev {
  if (__DEV__) {
    const ancestorInfo = { ...(oldInfo || emptyAncestorInfoDev) };

    if (inScopeTags[tag]) {
      ancestorInfo.aTagInScope = null;
      ancestorInfo.buttonTagInScope = null;
      ancestorInfo.nobrTagInScope = null;
    }
    if (buttonScopeTags[tag]) {
      ancestorInfo.pTagInButtonScope = null;
    }

    // See rules for 'li', 'dd', 'dt' start tags in
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
    if (specialTags[tag] && tag !== "address" && tag !== "div" && tag !== "p") {
      ancestorInfo.listItemTagAutoClosing = null;
      ancestorInfo.dlItemTagAutoClosing = null;
    }

    ancestorInfo.current = fiber;

    if (tag === "form") {
      ancestorInfo.formTag = fiber;
    }
    if (tag === "a") {
      ancestorInfo.aTagInScope = fiber;
    }
    if (tag === "button") {
      ancestorInfo.buttonTagInScope = fiber;
    }
    if (tag === "nobr") {
      ancestorInfo.nobrTagInScope = fiber;
    }
    if (tag === "p") {
      ancestorInfo.pTagInButtonScope = fiber;
    }
    if (tag === "li") {
      ancestorInfo.listItemTagAutoClosing = fiber;
    }
    if (tag === "dd" || tag === "dt") {
      ancestorInfo.dlItemTagAutoClosing = fiber;
    }
    if (tag === "#document" || tag === "html") {
      ancestorInfo.containerTagInScope = null;
    } else if (!ancestorInfo.containerTagInScope) {
      ancestorInfo.containerTagInScope = fiber;
    }

    return ancestorInfo;
  } else {
    return null;
  }
}

const hasWarnMap: Record<string, boolean> = {};

export function validateDOMNesting(fiber: MyReactFiberNodeClientDev, childTag: string, ancestorInfo: AncestorInfoDev): boolean {
  if (__DEV__) {
    ancestorInfo = ancestorInfo || emptyAncestorInfoDev;

    const parentInfo = ancestorInfo.current;

    const parentTag = parentInfo && parentInfo.elementType.toString();

    const invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo;

    const invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo);

    const invalidParentOrAncestor = invalidParent || invalidAncestor;

    if (!invalidParentOrAncestor) {
      return true;
    }

    const last = enableOptimizeTreeLog.current;

    enableOptimizeTreeLog.current = false;

    const tree = getFiberTree(invalidParentOrAncestor);

    if (hasWarnMap[tree]) {
      enableOptimizeTreeLog.current = last;

      return false;
    }

    hasWarnMap[tree] = true;

    const ancestorTag = invalidParentOrAncestor.elementType.toString();

    const tagDisplayName = "<" + childTag + ">";
    if (invalidParent) {
      let info = "";
      if (ancestorTag === "table" && childTag === "tr") {
        info += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by " + "the browser.";
      }
      logOnce(
        fiber,
        "error",
        "validateDOMNesting",
        `In HTML, ${tagDisplayName} cannot be a child of <${ancestorTag}>.${info}\nThis will cause a hydration error.`
      );
    } else {
      logOnce(
        fiber,
        "error",
        "validateDOMNesting",
        `In HTML, ${tagDisplayName} cannot be a descendant of <${ancestorTag}>.\nThis will cause a hydration error.`
      );
    }

    enableOptimizeTreeLog.current = last;

    return false;
  }
  return true;
}

export function validateTextNesting(fiber: MyReactFiberNodeClientDev, childText: string, parentTag: string): boolean {
  if (__DEV__) {
    if (isTagValidWithParent("#text", parentTag)) {
      return true;
    }

    const last = enableOptimizeTreeLog.current;

    enableOptimizeTreeLog.current = false;

    const tree = getFiberTree(fiber);

    if (hasWarnMap[tree]) {
      enableOptimizeTreeLog.current = last;

      return false;
    }

    hasWarnMap[tree] = true;

    if (/\S/.test(childText)) {
      logOnce(fiber, "error", "validateTextNesting", `In HTML, text nodes cannot be a child of <${parentTag}>.\nThis will cause a hydration error.`);
    } else {
      logOnce(
        fiber,
        "error",
        "validateTextNesting",
        `In HTML, whitespace text nodes cannot be a child of <${parentTag}>. ` +
          "Make sure you don't have any extra whitespace between tags on " +
          "each line of your source code.\n" +
          "This will cause a hydration error."
      );
    }

    enableOptimizeTreeLog.current = last;

    return false;
  }
  return true;
}
