import type { HTMLProps } from ".";

export const Body = ({ children, script = [] }: HTMLProps) => (
  <body>
    <div id="__content__" dangerouslySetInnerHTML={{ __html: children || "" }} />
    {script.filter(Boolean).map((ele) => ele)}
  </body>
);
