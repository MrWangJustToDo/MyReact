const { statsConfig } = require("./stats");
const { commonConfig } = require("./common");
const { resolveConfig } = require("./resolve");

const BaseConfig = ({ env, isDev }) => {
  const common = commonConfig({ env });
  const resolve = resolveConfig();
  const stats = statsConfig({ env, isDev });
  return {
    ...common,
    resolve,
    stats,
  };
};

exports.BaseConfig = BaseConfig;
