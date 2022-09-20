import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import jquery from "jquery";
import { promiseNext } from "../../../tools/tools";
import { renameFile } from "../../../tools/requestData";

// 重命名文件夹
function RenameInput(props) {
  let ref = useRef();
  let dispatch = useDispatch();
  let { data } = useSelector((state) => state);

  let renameHandler = useCallback(
    (e) => {
      let value = e.target.value;
      if (value !== props.shortPath) {
        renameFile(data.relativePath, props.shortPath, value).then((res) => {
          let item = jquery(ref.current.parentElement);
          dispatch({ type: "renameComplated" });
          if (res.code === -1) {
            promiseNext(0, () => {
              item.addClass("failed-submit");
            }).then(() =>
              promiseNext(600, () => {
                item.removeClass("failed-submit");
              })
            );
          } else {
            dispatch({
              type: "renameSuccess",
              id: props.id,
              originName: props.shortPath,
              newName: value,
            });
            promiseNext(0, () => {
              item.addClass("success-submit");
            }).then(() =>
              promiseNext(600, () => {
                item.removeClass("success-submit");
              })
            );
          }
        });
      } else {
        dispatch({ type: "renameComplated" });
      }
    },
    [props, dispatch, data]
  );

  return (
    <input
      className="fm-table-rename"
      defaultValue={props.shortPath}
      type="text"
      autoFocus
      onBlur={renameHandler}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          renameHandler(e);
        }
      }}
      ref={ref}
    />
  );
}

export default RenameInput;
