import { useContext } from "@my-react/react-reconciler/compact";

import StdinContext from "../components/StdinContext";

/**
 * `useStdin` is a React hook, which exposes stdin stream.
 */
const useStdin = () => useContext(StdinContext);
export default useStdin;
