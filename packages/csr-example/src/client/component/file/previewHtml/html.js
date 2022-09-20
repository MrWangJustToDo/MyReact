import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { axiosPost } from "../../tools/requestData";
import BackButton from "./htmlCloseButton";

function HTML() {
  let ref = useRef();
  let { 0: src } = useParams();

  useEffect(() => {
    let iframe = ref.current;
    axiosPost("/api/file", { requestPath: src }).then((data) => {
      let re = data.split("\n");
      let base = `<base href="/src/${src}" />`;
      re.splice(2, 0, base);
      iframe.contentWindow.document.write(re.join("\n"));
      iframe.contentWindow.document.close();
    });
  }, [src]);

  return (
    <div className="iframe-container absolute animate__animated animate__zoomIn animate__faster">
      <BackButton />
      <div className="iframe absolute">
        <iframe title="预览" ref={ref}></iframe>
      </div>
    </div>
  );
}

export default HTML;
