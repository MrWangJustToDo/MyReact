import { useEffect } from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "./head/head";
import Nav from "./nav/nav";
import DirContainer from "./dir/dirContainer";
import RecoverContainer from "./recover/recoverContainer";
import { autoLogin } from "./tools/requestData";

function Home() {
  let history = useHistory();
  let dispatch = useDispatch();
  let location = useLocation();
  let { recoverModel, isLogin } = useSelector((state) => state);

  // 未登录跳转
  useEffect(() => {
    if (!isLogin) {
      // 尝试使用cookie登录
      autoLogin().then((data) => {
        if (data.code === 0) {
          dispatch({ type: "login", username: data.state });
          history.push(location.pathname);
        } else {
          history.push("/login");
        }
      });
    }
  }, [isLogin]);

  return (
    <div className="absolute height-inherit width-inherit animate__animated animate__fadeIn animate__faster">
      <Head />
      <Nav />
      <Switch>
        <Route path="/all" children={<DirContainer />} />
        <Route path="/recover" children={recoverModel ? <RecoverContainer /> : <Redirect to="/all" />} />
      </Switch>
    </div>
  );
}

export default Home;
