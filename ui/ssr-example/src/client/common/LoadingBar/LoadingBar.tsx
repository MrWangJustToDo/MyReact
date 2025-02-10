import { memo, forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import * as style from "./index.module.scss";

const _Bar = forwardRef<HTMLDivElement>(function Bar(_, ref) {
  const [ele, setEle] = useState<HTMLDivElement>();

  useEffect(() => {
    const e = document.createElement("div");

    e.id = "__loading_bar__";

    const content = document.body.querySelector("#__content__") as HTMLDivElement;

    document.body.insertBefore(e, content);

    setEle(e);

    return () => {
      document.body.removeChild(e);
    };
  }, []);

  return ele ? createPortal(<div ref={ref} className={style.loadingBar} style={{ height: `0px`, transform: `scale(0, 1)` }} />, ele as Element) : null;
});

_Bar.displayName = "_Bar";

export const Bar = memo(_Bar);
