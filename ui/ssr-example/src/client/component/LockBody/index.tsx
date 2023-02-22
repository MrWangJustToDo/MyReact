import { RemoveScroll } from "react-remove-scroll";

import { useLockBodyCount } from "@client/hooks";

export const LockBody = () => {
  const count = useLockBodyCount();

  return (
    <RemoveScroll enabled={count > 0} className="placeholder" as="span">
      <></>
    </RemoveScroll>
  );
};
