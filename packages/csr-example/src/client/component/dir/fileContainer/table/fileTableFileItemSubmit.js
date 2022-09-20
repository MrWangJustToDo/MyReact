import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import jquery from "jquery";
import { promiseNext } from "../../../tools/tools";
import { submitFile } from "../../../tools/requestData";

function FileTableFileSubmitItem(props) {
  let ref = useRef();
  let dispatch = useDispatch();
  let { editorItems, currentRequestPath } = useSelector((state) => state);

  let submitFileHandler = useCallback(() => {
    submitFile(props.relativePath, editorItems[props.relativePath]).then((res) => {
      let item = jquery(ref.current.parentElement);
      if (res.code === 0) {
        // 提交成功,删除编辑缓存
        dispatch({
          type: "deleteEditorItem",
          relativePath: props.relativePath,
        });
        // 获取提交成功后文件信息
        dispatch({
          type: "submitFileSucess",
          isSamePath: false,
          currentRequestPath,
          relativePath: props.relativePath,
        });
        promiseNext(0, () => {
          item.addClass("success-submit");
        }).then(() =>
          promiseNext(600, () => {
            item.removeClass("success-submit");
          })
        );
      } else {
        // 失败
        promiseNext(0, () => {
          item.addClass("failed-submit");
        }).then(() =>
          promiseNext(600, () => {
            item.removeClass("failed-submit");
          })
        );
      }
    });
  }, [props, dispatch, editorItems, currentRequestPath]);

  return (
    <div className="fm-table-submit absolute" ref={ref}>
      <input type="button" value="提交更改" onClick={submitFileHandler} />
    </div>
  );
}

export default FileTableFileSubmitItem;
