// tiny webpack tools
const { commonJSBootStrap } = require("./bootStrap");

// build
commonJSBootStrap("../lib/react.js", "../../bundle.js")
  .then(() => commonJSBootStrap("../redux/redux.js", "../../reduxBundle.js"))
  .then(() =>
    commonJSBootStrap("../redux/reactRedux.js", "../../reactReduxBundle.js")
  )
  .then(() => commonJSBootStrap("../redux/thunk.js", "../../thunkBundle.js"));
