import "./css/basic.css";
import "./css/all.css";
import "./css/background.css";
import "./css/animate.css";
import RouteApp from "./component/routeApp";
import store from "./component/redux/globalStore";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

function App() {
  return (
    <Router>
      <Provider store={store}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/all" />
          </Route>
          <Route path="/">
            <RouteApp />
          </Route>
        </Switch>
      </Provider>
    </Router>
  );
}

export default App;
