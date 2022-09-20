import { useCallback, useRef } from "react";
import { useHistory } from "react-router";
import jquery from "jquery";
import { promiseNext } from "../../tools/tools";

// 返回按钮
function ImageCloseButton() {
  let ref = useRef();
  let history = useHistory();
  let handlerBack = useCallback(() => {
    let current = jquery(ref.current).parents(".image-container");
    promiseNext(0, () => {
      current.removeClass("animate__zoomIn").addClass("animate__zoomOut");
    }).then(() =>
      promiseNext(300, () => {
        history.goBack();
      })
    );
  }, [history]);

  return (
    <button className="close-image absolute" type="button" ref={ref} onClick={handlerBack}>
      返回
    </button>
  );
}

export default ImageCloseButton;
