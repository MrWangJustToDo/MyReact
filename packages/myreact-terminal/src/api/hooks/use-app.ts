import { useContext } from "@my-react/react";

import { AppContext } from "../components/AppContext";

/**
 * `useApp` is a React hook, which exposes a method to manually exit the app (unmount).
 */
export const useApp = () => useContext(AppContext);
