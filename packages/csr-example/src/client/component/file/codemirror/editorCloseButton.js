import { useCallback, useRef } from "react";
import { useHistory } from "react-router";
import jquery from "jquery";
import { promiseNext } from "../../tools/tools";

// 关闭按钮
function EditorCloseButton(props) {
  let ref = useRef();
  let history = useHistory();
  let handlerBack = useCallback(() => {
    let current = jquery(ref.current).parents(".editor-cover");
    promiseNext(0, () => {
      current.removeClass("animate__fadeInUp").addClass("animate__fadeOutDown");
    }).then(() =>
      promiseNext(300, () => {
        history.goBack();
      })
    );
    if (props.click) {
      props.click();
    }
  }, [props, history]);

  return (
    <button type="button" onClick={handlerBack} ref={ref}>
      {props.title}
    </button>
  );
}

export default EditorCloseButton;
