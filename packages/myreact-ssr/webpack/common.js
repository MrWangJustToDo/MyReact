const path = require("path");

const commonConfig = ({ env }) => {
  return {
    name: env,
    mode: process.env.NODE_ENV,
    target: env === "client" ? "web" : "node14",
    context: path.resolve(process.cwd()),
  };
};

exports.commonConfig = commonConfig;
