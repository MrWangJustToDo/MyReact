import { useEffect, useRef } from "react";
import jquery from "jquery";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { promiseNext } from "../tools/tools";
import { logout } from "../tools/requestData";

// 用户信息
function HeadUser() {
  let ref = useRef();
  let history = useHistory();
  let dispatch = useDispatch();
  let { loginUsername } = useSelector((state) => state);

  useEffect(() => {
    let user = jquery(ref.current);
    let out = user.children("button");
    let docu = jquery(document);
    user.prop("flag", true);
    docu.on("click", () => {
      let flag = user.prop("flag");
      if (!flag) {
        out.hide(100);
        user.prop("flag", !flag).removeClass("check");
      }
    });
    user.on("click", (e) => {
      e.stopPropagation();
      let flag = user.prop("flag");
      if (flag) {
        out.show(100);
        user.addClass("check");
      } else {
        out.hide(100);
        user.removeClass("check");
      }
      user.prop("flag", !flag);
    });
    user.on("click", ".head-user-out", () =>
      promiseNext(200, () => {
        logout().then((data) => {
          if (data.code === 0) {
            dispatch({ type: "logout" });
            history.push("/login");
          }
        });
      })
    );
    out.hide();
    return () => {
      user.off("click");
      docu.off("click");
    };
  }, [dispatch, history]);

  return (
    <div className="head-user son-inline-block">
      <span>用户: </span>
      <div className="head-user-msg relative" ref={ref}>
        <span className="user-msg">
          {loginUsername || "游客"}
          <i className="fas fa-angle-down"></i>
        </span>
        <button className="head-user-out absolute">退出</button>
      </div>
    </div>
  );
}

export default HeadUser;
