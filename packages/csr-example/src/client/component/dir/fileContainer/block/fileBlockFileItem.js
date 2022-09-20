import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FileBlockFileSubmitItem from "./fileBlockFileSubmitItem";

function FileBlockFileItem(props) {
  let dispatch = useDispatch();
  let { editorItems } = useSelector((state) => state);

  let checkHandler = useCallback(
    (e) => {
      if (e.button === 2) {
        dispatch({ type: "changeFileItemCheck", id: props.id });
      }
    },
    [dispatch, props]
  );

  return (
    <div
      className={"fm-file-item relative " + (props.checked ? "check" : "")}
      title={props.readAbleLength}
      onMouseDown={checkHandler}
    >
      <Link className="block" to={props.linkTarget}>
        <i className="fas fa-file"></i>
        <span className="fm-file-name block">{props.shortPath}</span>
      </Link>
      {props.relativePath in editorItems && (
        <FileBlockFileSubmitItem {...props} />
      )}
    </div>
  );
}

export default FileBlockFileItem;
