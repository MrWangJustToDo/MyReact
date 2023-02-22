import { useColorModeValue } from "@chakra-ui/react";
import { css, Global } from "@emotion/react";

export const GlobalStyle = () => {
  // source from highlight.js
  const style = useColorModeValue(
    css`
      pre code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
      }
      code.hljs {
        padding: 3px 5px;
      }
      .hljs {
        color: #383a42;
        background: #fafafa;
      }
      .hljs-comment,
      .hljs-quote {
        color: #a0a1a7;
        font-style: italic;
      }
      .hljs-doctag,
      .hljs-formula,
      .hljs-keyword {
        color: #a626a4;
      }
      .hljs-deletion,
      .hljs-name,
      .hljs-section,
      .hljs-selector-tag,
      .hljs-subst {
        color: #e45649;
      }
      .hljs-literal {
        color: #0184bb;
      }
      .hljs-addition,
      .hljs-attribute,
      .hljs-meta .hljs-string,
      .hljs-regexp,
      .hljs-string {
        color: #50a14f;
      }
      .hljs-attr,
      .hljs-number,
      .hljs-selector-attr,
      .hljs-selector-class,
      .hljs-selector-pseudo,
      .hljs-template-variable,
      .hljs-type,
      .hljs-variable {
        color: #986801;
      }
      .hljs-bullet,
      .hljs-link,
      .hljs-meta,
      .hljs-selector-id,
      .hljs-symbol,
      .hljs-title {
        color: #4078f2;
      }
      .hljs-built_in,
      .hljs-class .hljs-title,
      .hljs-title.class_ {
        color: #c18401;
      }
      .hljs-emphasis {
        font-style: italic;
      }
      .hljs-strong {
        font-weight: 700;
      }
      .hljs-link {
        text-decoration: underline;
      }
    `,
    css`
      pre code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
      }
      code.hljs {
        padding: 3px 5px;
      }
      .hljs {
        color: #e9e9f4;
        background: #282936;
      }
      .hljs ::selection,
      .hljs::selection {
        background-color: #4d4f68;
        color: #e9e9f4;
      }
      .hljs-comment {
        color: #626483;
      }
      .hljs-tag {
        color: #62d6e8;
      }
      .hljs-operator,
      .hljs-punctuation,
      .hljs-subst {
        color: #e9e9f4;
      }
      .hljs-operator {
        opacity: 0.7;
      }
      .hljs-bullet,
      .hljs-deletion,
      .hljs-name,
      .hljs-selector-tag,
      .hljs-template-variable,
      .hljs-variable {
        color: #ea51b2;
      }
      .hljs-attr,
      .hljs-link,
      .hljs-literal,
      .hljs-number,
      .hljs-symbol,
      .hljs-variable.constant_ {
        color: #b45bcf;
      }
      .hljs-class .hljs-title,
      .hljs-title,
      .hljs-title.class_ {
        color: #00f769;
      }
      .hljs-strong {
        font-weight: 700;
        color: #00f769;
      }
      .hljs-addition,
      .hljs-code,
      .hljs-string,
      .hljs-title.class_.inherited__ {
        color: #ebff87;
      }
      .hljs-built_in,
      .hljs-doctag,
      .hljs-keyword.hljs-atrule,
      .hljs-quote,
      .hljs-regexp {
        color: #a1efe4;
      }
      .hljs-attribute,
      .hljs-function .hljs-title,
      .hljs-section,
      .hljs-title.function_,
      .ruby .hljs-property {
        color: #62d6e8;
      }
      .diff .hljs-meta,
      .hljs-keyword,
      .hljs-template-tag,
      .hljs-type {
        color: #b45bcf;
      }
      .hljs-emphasis {
        color: #b45bcf;
        font-style: italic;
      }
      .hljs-meta,
      .hljs-meta .hljs-keyword,
      .hljs-meta .hljs-string {
        color: #00f769;
      }
      .hljs-meta .hljs-keyword,
      .hljs-meta-keyword {
        font-weight: 700;
      }
    `,
  );

  return <Global styles={style} />;
};
