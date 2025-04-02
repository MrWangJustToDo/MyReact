import { render } from "react-dom";
// import { render } from "./test";
import { __my_react_dom_shared__ } from "@my-react/react-dom";
import "./index.css";
import App from "./App";

__my_react_dom_shared__.enableDebugUpdateQueue.current = true;

render(<App />, document.getElementById("__content__"));
