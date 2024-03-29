import { useState } from "react";
import { useParams } from "react-router";
import BackButton from "./imageCloseButton";
import ZoomButton from "./imageZoomButton";
import "./zoom.css";

// 预览图片
function Image() {
  let { 0: src } = useParams();
  const [load, setLoad] = useState(false);

  return (
    <div className="image-container absolute animate__animated animate__zoomIn animate__faster">
      <div className="image absolute">
        {load && <ZoomButton />}
        <BackButton />
        <img src={`/api/src/${src}`} alt="图片" style={{ width: "auto", height: "100%" }} onLoad={() => setLoad(true)} />
      </div>
    </div>
  );
}

export default Image;
