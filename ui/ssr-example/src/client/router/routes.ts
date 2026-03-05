export const allRoutes = __STREAM__ ? require("./routers.stream").allRoutes : require("./routers.loadable").allRoutes;
