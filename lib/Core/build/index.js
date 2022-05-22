// tiny webpack tools
const { commonJSBootStrap } = require("./bootStrap");

// build
commonJSBootStrap("../lib/react.js", "../../reactBundle.js")
  .then(() => commonJSBootStrap("../redux/redux.js", "../../reduxBundle.js"))
  .then(() =>
    commonJSBootStrap("../redux/reactRedux.js", "../../reactReduxBundle.js")
  )
  .then(() => commonJSBootStrap("../redux/thunk.js", "../../thunkBundle.js"))
  .then(() =>
    commonJSBootStrap("../reactive/index.js", "../../reactiveBundle.js")
  )
  .then(() =>
    commonJSBootStrap("../zustand/react.js", "../../zustandBundle.js")
  );
