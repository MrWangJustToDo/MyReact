import { useContext } from "@my-react/react";

import { StdoutContext } from "../components/StdoutContext";

/**
 * `useStdout` is a React hook, which exposes stdout stream.
 */
export const useStdout = () => useContext(StdoutContext);
