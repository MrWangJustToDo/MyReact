// tiny webpack tools
const { commonJSBootStrap } = require("./bootStrap");

// build
commonJSBootStrap("../lib/react.js", "../../bundle.js").then(() => {
  commonJSBootStrap("../redux/index.js", "../../reduxBundle.js");
});
