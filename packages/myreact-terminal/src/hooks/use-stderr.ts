import { useContext } from "@my-react/react-reconciler/compact";

import StderrContext from "../components/StderrContext";

/**
 * `useStderr` is a React hook, which exposes stderr stream.
 */
const useStderr = () => useContext(StderrContext);
export default useStderr;
