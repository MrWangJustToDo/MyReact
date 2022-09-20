/*
router API
  <BrowserRouter> ...Com </BrowserRouter> 使用h5模式的路由: history.pushState()函数 与  window.onpopstate事件
  <HashRouter> ...Com </HashRouter> 使用hash模式的路由: localtion.hash 与 window.onhashchange
*/

// router 路由的基本使用

/*
<Router>
  <div>
    <ul>
      <li>
        exact 完全匹配
        <Link exact to="/">
          Home
        </Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
    </ul>
    <hr />
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
    </Switch>
  </div>
</Router>;
*/

// react-router的url parameters
/*
  <Link to="/all/file" />  

  <Switch>
    <Route path="/all/:id" children={<Child />} />
  </Switch>

  通过Link跳转到当前组件后,可以在组件内部通过useParams()hook方法获取到id对应的值
  function Child() {
    let {id} = useParams();
    console.log(id)   // file
  }
*/

// 私有路由组件,应该是在Route组件内部进行了render-props的实现,可以在使用route时通过render属性进行判断渲染
// 测试Route组件的render属性接收的函数的参数为:
/*
  history: {length: 1, action: "POP", location: {…}, createHref: ƒ, push: ƒ, …}
  location: {pathname: "/all", search: "?fileType=dir", hash: "", state: undefined, key: "rg0fxi"}
  match: {path: "/", url: "/", isExact: false, params: {…}}
  staticContext: undefined
  __proto__: Object

  说明在Route组件内部使用了
  useHistory()
  useLocation()
  useRouteMatch()
  */

/*
<Route
  {...rest}
  render={({ location }) =>   结构出location
    xxx ? (
      children
    ) : (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: location }
        }}
      />
    )
  }
/>
*/

// 实现withRouter函数,让一个class组件拥有history与location等属性

function withRouter(Comp) {
  let location = useLocation();
  let history = useHistory();
  return class extends React.Comment {
    render() {
      return (
        <Comp {...location} {...history} {...props}>
          {this.props.children}
        </Comp>
      );
    }
  };
}
