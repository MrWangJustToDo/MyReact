import { useCallback, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import jquery from "jquery";
import RegisterContainerUsername from "./registerContainerUsername";
import RegisterContainerPassword from "./registerContainerPassword";
import RegisterContainerInviteCode from "./registerContainerInviteCode";
import RegisterContainerSubmit from "./registerContainerSubmit";
import { registerEle } from "./registerContainerInit";
import { register } from "../tools/requestData";
import { promiseNext } from "../tools/tools";

// 注册页面表单
function RegisterContainerBody() {
  let msg = useRef();
  let body = useRef();
  let button = useRef();
  let history = useHistory();

  // 进行组件验证
  useEffect(() => {
    let buttonEle = jquery(button.current);

    let optList = [
      {
        regexp: /^\w{2,7}$/,
        onlineCheck: true,
        success: "通过",
        fail: "用户名为2-7个字符",
      },
      {
        regexp: /^\d{5,10}$/,
        success: "通过",
        fail: "密码为5-10个数字",
      },
      {
        regexp: /^\w{6}$/,
        success: "通过",
        fail: "邀请码为6个字符",
      },
    ];

    let listEle = Array.from(body.current.elements)
      .filter((it) => it.tagName !== "BUTTON")
      .map(jquery);

    registerEle(
      "/api/register-check",
      listEle,
      optList,
      () => {
        buttonEle.prop("disabled", false);
      },
      () => {
        buttonEle.prop("disabled", true);
      }
    );
    return () => listEle.forEach((it) => it.off("input"));
  });

  // 注册提交
  let registerHandler = useCallback(
    (e) => {
      e.preventDefault();
      let msgEle = jquery(msg.current);
      let inputs = Array.from(body.current.elements)
        .filter((it) => it.tagName !== "BUTTON")
        .map(jquery);
      let registerObj = {
        username: inputs[0].val(),
        password: inputs[1].val(),
        invite: inputs[2].val(),
      };
      register(registerObj).then((data) => {
        if (data.code === 0) {
          promiseNext(0, () => {
            msgEle.css("color", "green");
            msgEle.text("注册成功,去到登录页面");
          }).then(() =>
            promiseNext(1000, () => {
              history.push("/login");
            })
          );
        } else {
          promiseNext(0, () => {
            msgEle.text(data.state);
          }).then(() =>
            promiseNext(1000, () => {
              msgEle.text("");
            })
          );
        }
      });
    },
    [history]
  );

  return (
    <form className="register-form absolute text-center" ref={body} onSubmit={registerHandler}>
      <div className="register-form-head relative flex">
        <span>新用户注册</span>
        <Link className="goto-login" to="/login">
          去登录
        </Link>
        <span className="absolute head-msg" ref={msg}></span>
      </div>
      <div className="register-input">
        <RegisterContainerUsername />
        <RegisterContainerPassword />
        <RegisterContainerInviteCode />
      </div>
      <RegisterContainerSubmit ref={button} />
    </form>
  );
}

export default RegisterContainerBody;
