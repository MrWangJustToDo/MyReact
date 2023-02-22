import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import jquery from "jquery";
import LoginContainerUsername from "./loginContainerUsername";
import LoginContainerPassword from "./loginContainerPassword";
import LoginContainerCheckcode from "./loginContainerCheckcode";
import LoginContainerSubmit from "./loginContainerSubmit";
import { loadImg, formCheck } from "./loginContainerInit";
import { login } from "../tools/requestData";
import { promiseNext } from "../tools/tools";

function LoginContainerBody() {
  let ref = useRef();
  let msg = useRef();
  let submit = useRef();
  let checkcode = useRef();
  let history = useHistory();
  let dispatch = useDispatch();

  // 显示验证码
  useEffect(() => {
    let inputs = Array.from(jquery(ref.current).find("label > input")).map(jquery);
    let checkcodeEle = jquery(checkcode.current);
    let imageEle = checkcodeEle.find("img");
    let submitEle = jquery(submit.current);
    let optList = [
      {
        regexp: /^\w{2,7}$/,
        success: "格式正确",
        fail: "用户名为2-7个字符",
      },
      {
        regexp: /^\d{5,10}$/,
        success: "格式正确",
        fail: "密码为5-10个数字",
      },
    ];
    formCheck(
      inputs,
      optList,
      () => {
        checkcodeEle.css("height", inputs[1].outerHeight());
        loadImg("captcha", "/api/captcha/str", imageEle);
        submitEle.removeAttr("disabled");
      },
      () => {
        checkcodeEle.css("height", 0);
        submitEle.attr("disabled", true);
        imageEle.attr("src", "");
        checkcodeEle.find("input").val("");
      }
    );
    return () => inputs.forEach((it) => it.off("input"));
  });

  let loginHandler = useCallback(
    (e) => {
      e.preventDefault();
      let msgEle = jquery(msg.current);
      let inputs = jquery(ref.current).find("input");
      let img = jquery(checkcode.current).find("img");
      let loginObj = {
        username: inputs[0].value,
        password: inputs[1].value,
        checkcode: inputs[2].value,
      };
      login(loginObj).then((data) => {
        if (data.code === 0) {
          dispatch({ type: "login", username: data.state });
          history.push("/all");
        } else {
          promiseNext(0, () => {
            img[0].click();
            msgEle.text(data.state);
          }).then(() =>
            promiseNext(1000, () => {
              msgEle.text("");
            })
          );
        }
      });
    },
    [dispatch, history]
  );

  return (
    <form className="login-form absolute text-center" onSubmit={loginHandler}>
      <div className="login-form-head relative flex">
        <span>帐号密码登录</span>
        <Link className="goto-register" to="/register">
          去注册
        </Link>
        <span className="absolute head-msg" ref={msg}></span>
      </div>
      <div className="login-input" ref={ref}>
        <LoginContainerUsername />
        <LoginContainerPassword />
        <LoginContainerCheckcode ref={checkcode} />
      </div>
      <LoginContainerSubmit ref={submit} />
    </form>
  );
}
export default LoginContainerBody;
