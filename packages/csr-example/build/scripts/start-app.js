require("module-alias/register");

const React = require("@my-react/react");

global.React = React;

require("../../node/server");
