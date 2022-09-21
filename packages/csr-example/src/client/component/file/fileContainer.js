import { useParams } from "react-router";
import { useSelector } from "react-redux";
import Image from "./previewImg/image";
import Editor from "./codemirror/editor";
import Video from "./previewVideo/video";
import Audio from "./previewAudio/audio";
import HTML from "./previewHtml/html";
import "animate.css";
import "./file.css";

function File() {
  let { type } = useParams();
  let { isLoaded } = useSelector((state) => state);
  if (type === "image") {
    return <>{isLoaded && <Image />}</>;
  } else if (type === "video") {
    return <>{isLoaded && <Video />}</>;
  } else if (type === "audio") {
    return <>{isLoaded && <Audio />}</>;
  } else if (type === "html") {
    return <>{isLoaded && <HTML />}</>;
  } else {
    return <>{isLoaded && <Editor />}</>;
  }
}

export default File;
