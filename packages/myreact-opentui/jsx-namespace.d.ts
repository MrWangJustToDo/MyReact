import type {
  AsciiFontProps,
  BoxProps,
  ExtendedIntrinsicElements,
  InputProps,
  LineBreakProps,
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
    input: InputProps;
    select: SelectProps;
    scrollbox: ScrollBoxProps;
    "ascii-font": AsciiFontProps;
    "tab-select": TabSelectProps;
    // Text modifiers
    b: SpanProps;
    i: SpanProps;
    u: SpanProps;
    strong: SpanProps;
    em: SpanProps;
    br: LineBreakProps;
  }
}
