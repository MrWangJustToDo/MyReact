// tiny webpack tools
const { commonJSBootStrap } = require('./bootStrap');

// build
commonJSBootStrap('../redux/redux.js', '../../../reduxBundle.js')
  .then(() =>
    commonJSBootStrap('../redux/reactRedux.js', '../../../reactReduxBundle.js')
  )
  .then(() => commonJSBootStrap('../redux/thunk.js', '../../../thunkBundle.js'))
  .then(() =>
    commonJSBootStrap('../zustand/react.js', '../../../zustandBundle.js')
  )
  .then(() =>
    commonJSBootStrap('../redux/toolkit.js', '../../../reduxToolKitBundle.js')
  );
