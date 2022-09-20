import { useParams } from "react-router";
import BackButton from "./audioCloseButton";

function Audio() {
  let { 0: src } = useParams();

  return (
    <div className="audio-container absolute animate__animated animate__zoomIn animate__faster">
      <div className="audio absolute">
        <BackButton />
        <audio src={`/src/${src}`} controls height="100%" />
      </div>
    </div>
  );
}

export default Audio;
