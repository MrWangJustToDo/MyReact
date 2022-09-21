import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// 文件回收站
function NavRecover() {
  let { recoverModel, currentRequestPath } = useSelector((state) => state);

  let dispatch = useDispatch();

  let recoverHandler = useCallback(() => {
    dispatch({ type: "enableRecoverModel", currentRequestPath });
  }, [dispatch, currentRequestPath]);

  return (
    <li className={recoverModel ? "relative check" : "relative"}>
      <i className="absolute fas fa-archive"></i>
      <Link className="block nav-archive-item" to="/recover" onClick={recoverHandler}>
        回收站
      </Link>
    </li>
  );
}

export default NavRecover;
