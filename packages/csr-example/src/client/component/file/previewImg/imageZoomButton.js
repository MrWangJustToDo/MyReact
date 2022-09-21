import { useCallback, useRef, useState } from "react";
import jquery from "jquery";
import zoom from "./zoomAble";

function ImageZoomButton() {
  let ref = useRef();
  const [currentZoomObj, setCurrentZoomObj] = useState();
  let handlerZoom = useCallback(() => {
    if (currentZoomObj) {
      currentZoomObj.destory();
      setCurrentZoomObj(null);
    } else {
      let zoomObj = zoom(jquery(ref.current).siblings("img")[0]);
      setCurrentZoomObj(zoomObj);
    }
  }, [currentZoomObj]);
  return (
    <button className="zoom-image absolute" type="button" ref={ref} onClick={handlerZoom}>
      {!currentZoomObj ? "放大" : "取消"}
    </button>
  );
}

export default ImageZoomButton;
