import { useEffect, useRef } from "react";
import jquery from "jquery";
import FileContainerHead from "./recoverContainerHead";
import FileRecover from "./fileContainer/fileRecover";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

function FileContainer() {
  let ref = useRef();
  useEffect(() => {
    let currentItem = jquery(ref.current);
    currentItem.on("contextmenu", () => false);
    return () => currentItem.off("contextmenu");
  }, []);
  let { currentRequestPath } = useSelector((state) => state);

  let location = useLocation();
  let dispatch = useDispatch();

  if (currentRequestPath !== location.pathname) {
    dispatch({ type: "refresh", currentRequestPath: location.pathname });
  }

  return (
    <div className="fm-container relative overflow">
      <div className="fm-table-container relative animate__animated animate__fadeIn animate__faster" ref={ref}>
        <FileContainerHead />
        <FileRecover />
      </div>
    </div>
  );
}

export default FileContainer;
