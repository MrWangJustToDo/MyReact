import { useContext } from "@my-react/react";

import { StdinContext } from "../components/StdinContext";

/**
 * `useStdin` is a React hook, which exposes stdin stream.
 */
export const useStdin = () => useContext(StdinContext);
