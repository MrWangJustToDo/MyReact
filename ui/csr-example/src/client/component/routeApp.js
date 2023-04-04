import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import Welcome from "./welcome";
import Home from "./home";
import File from "./file";
import Msg from "./msg";
import { CanvasBG } from "./bg";

export default () => {
  let location = useLocation();
  let dispatch = useDispatch();
  let { msgState, isLogin, loginUsername } = useSelector((state) => state);
  let background = location.state && location.state.background;

  // 使用webSocket实时更新rootFolderSize
  useEffect(() => {
    let ws;
    if (isLogin) {
      let a = document.createElement("a");
      a.href = `/${loginUsername}`;
      ws = new WebSocket(`ws://${a.host}/${loginUsername}`);
      ws.onmessage = (e) => {
        dispatch({ type: "updateRootFolderSize", rootFolderSize: e.data });
      };
    }
    return () => ws && ws.close();
  }, [isLogin, loginUsername, dispatch]);

  return (
    <>
      <CanvasBG />
      <Switch location={background || location}>
        <Route path="/file/**/:type/:id">
          <File />
        </Route>
        <Route path="/login">
          <Welcome />
        </Route>
        <Route path="/register">
          <Welcome />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      {background && msgState && <Route path="/msg" children={<Msg />} />}
    </>
  );
};
