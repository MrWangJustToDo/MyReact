import { useEffect, useRef } from "react";
import { Route, Switch } from "react-router";
import jquery from "jquery";
import WelcomeContainerHead from "./welcomeContainerHead";
import WelcomeContainerFoot from "./welcomeContainerFoot";
import RegisterContainerBody from "./registerContainerBody";
import LoginContainerBody from "./loginContainerBody";
import "./welcome.css";

// 登录页面
function LoginContainer() {
  let ref = useRef();

  // 背景动画
  useEffect(() => {
    let body = jquery(window.document.body);
    let item = jquery(ref.current);
    body.on("mousemove", (e) => {
      if (e.pageX <= body.outerWidth() / 2) {
        item.css("backgroundPositionX", "47%");
      } else {
        item.css("backgroundPositionX", "53%");
      }
      if (e.pageY <= body.outerHeight() / 2) {
        item.css("backgroundPositionY", "47%");
      } else {
        item.css("backgroundPositionY", "53%");
      }
    });
    return () => body.off("mousemove");
  }, []);

  // 检测是否为手机端登录
  useEffect(() => {
    let userAgentInfo = navigator.userAgent;
    let Agents = Array.of("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    if (Agents.some((it) => userAgentInfo.indexOf(it) !== -1)) {
      alert("手机端页面可能显示不正常☹,请使用PC端访问");
    }
  }, []);

  return (
    <div className="login relative bg bg-content-bg" ref={ref}>
      <WelcomeContainerHead title="File-Manager" />
      <Switch>
        <Route path="/login">
          <LoginContainerBody />
        </Route>
        <Route path="/register">
          <RegisterContainerBody />
        </Route>
      </Switch>
      <WelcomeContainerFoot />
    </div>
  );
}

export default LoginContainer;
