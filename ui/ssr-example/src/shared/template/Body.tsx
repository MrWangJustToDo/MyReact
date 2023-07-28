import { ColorModeScript } from "@chakra-ui/react";

import type { HTMLProps } from ".";

export const Body = ({ children, script = [], refresh = [] }: HTMLProps) => (
  <body>
    <ColorModeScript /* type='cookie' */ type='localStorage' />
    {typeof children === "string" ? <div id="__content__" dangerouslySetInnerHTML={{ __html: children || "" }} /> : <div id="__content__">{children}</div>}
    {script.filter(Boolean).map((ele) => ele)}
    {refresh.filter(Boolean).map((ele) => ele)}
  </body>
);
