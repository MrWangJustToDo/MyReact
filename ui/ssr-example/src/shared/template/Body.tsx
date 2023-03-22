import type { HTMLProps } from ".";

export const Body = ({ children, script = [] }: HTMLProps) => (
  <body>
    {typeof children === "string" ? <div id="__content__" dangerouslySetInnerHTML={{ __html: children || "" }} /> : <div id="__content__">{children}</div>}
    {script.filter(Boolean).map((ele) => ele)}
  </body>
);
