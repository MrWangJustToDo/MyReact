import { useParams } from "react-router";
import BackButton from "./videoCloseButton";

function Video() {
  let { 0: src } = useParams();

  return (
    <div className="video-container absolute animate__animated animate__zoomIn animate__faster">
      <div className="video absolute">
        <BackButton />
        <video src={`/api/src/${src}`} controls height="100%" />
      </div>
    </div>
  );
}

export default Video;
