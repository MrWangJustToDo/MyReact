import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import FileContainerHeadSearchUl from "./fileContainerHeadSearchUl";

function FileContainerHeadSearchItem() {
  let input = useRef();
  let { data } = useSelector((state) => state);
  const [list, setList] = useState([]);

  let inputHandler = useCallback(
    (e) => {
      let value = e.target.value;
      if (value) {
        let lastList = data.files.filter((it) =>
          it.shortPath.startsWith(value)
        );
        setList(lastList);
      } else {
        setList([]);
      }
    },
    [data]
  );

  return (
    <label className="fm-table-header-search inline-flex relative">
      <input
        type="text"
        className="fm-table-header-search-input"
        placeholder="搜索你的文件"
        autoFocus
        onInput={inputHandler}
        ref={input}
      />
      <i className="fm-table-search-btn relative fas fa-search"></i>
      <FileContainerHeadSearchUl
        list={list}
        setList={setList}
        input={input.current}
      />
    </label>
  );
}

export default FileContainerHeadSearchItem;
