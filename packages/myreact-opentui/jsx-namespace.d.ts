import type {
  AsciiFontProps,
  BoxProps,
  ExtendedIntrinsicElements,
  InputProps,
  LineBreakProps,
  LineNumberProps,
  OpenTUIComponents,
  ScrollBoxProps,
  SelectProps,
  SpanProps,
  TabSelectProps,
  TextProps,
} from "./src/types/components";

declare namespace JSX {
  interface IntrinsicElements {
    box: BoxProps;
    text: TextProps;
    span: SpanProps;
    code: CodeProps;
    diff: DiffProps;
    input: InputProps;
    textarea: TextareaProps;
    select: SelectProps;
    scrollbox: ScrollBoxProps;
    "ascii-font": AsciiFontProps;
    "tab-select": TabSelectProps;
    "line-number": LineNumberProps;
    // Text modifiers
    b: SpanProps;
    i: SpanProps;
    u: SpanProps;
    strong: SpanProps;
    em: SpanProps;
    br: LineBreakProps;
  }
}
