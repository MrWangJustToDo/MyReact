import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileContainerHeadSearchItem from "./fileContainerHeadSearchItem";

function FileContainerHeadRightBtn() {
  let dispatch = useDispatch();
  let fileModelType = useSelector((state) => state.fileModelType);
  let clickHandler = useCallback(
    (e) => {
      dispatch({
        type: "changeFileModelType",
        fileModelType: e.target.dataset.name,
      });
    },
    [dispatch]
  );
  return (
    <div className="fm-table-header-rightTools">
      <FileContainerHeadSearchItem />
      <span
        className={
          fileModelType === "table" ? "inline-flex check" : "inline-flex"
        }
        onClick={clickHandler}
      >
        <i
          data-name="table"
          className="fas fa-list-ul fm-table-header-sort inline-flex"
        ></i>
      </span>
      <span
        className={
          fileModelType === "block" ? "inline-flex check" : "inline-flex"
        }
        onClick={clickHandler}
      >
        <i
          data-name="block"
          className="fas fa-th-large fm-table-header-big inline-flex"
        ></i>
      </span>
    </div>
  );
}

export default FileContainerHeadRightBtn;
