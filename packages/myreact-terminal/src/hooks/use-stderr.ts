import { useContext } from "@my-react/react";

import { StderrContext } from "../components/StderrContext";

/**
 * `useStderr` is a React hook, which exposes stderr stream.
 */
export const useStderr = () => useContext(StderrContext);
