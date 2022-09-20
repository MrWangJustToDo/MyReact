import { useCallback } from "react";
import { Link } from "react-router-dom";

function FileContainerHeadSearchUl(props) {
  let clickHandler = useCallback(() => {
    props.setList([]);
    props.input.value = "";
    props.input.focus();
  }, [props]);

  return (
    <ul className="fm-table-ul absolute">
      {props.list.length > 0 &&
        props.list.map((it) => {
          if (it.fileType === "file") {
            return (
              <li className="fm-table-list" key={it.id} onClick={clickHandler}>
                <Link to={it.linkTarget}>
                  <i className="fas fa-file"></i>
                  {it.shortPath}
                </Link>
              </li>
            );
          } else {
            return (
              <li className="fm-table-list" key={it.id} onClick={clickHandler}>
                <Link to={it.linkTarget}>
                  <i className="fas fa-folder"></i>
                  {it.shortPath}
                </Link>
              </li>
            );
          }
        })}
    </ul>
  );
}

export default FileContainerHeadSearchUl;
