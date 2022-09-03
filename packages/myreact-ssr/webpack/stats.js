const statsConfig = ({ env, isDev }) => {
  return isDev || env === "server" ? "errors-warnings" : "normal";
};

exports.statsConfig = statsConfig;
