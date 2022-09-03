import type { TransformType } from "types/router";

const filter: TransformType = (routers) => {
  const temp: { [props: string]: boolean } = {};
  return routers.filter((config) => {
    const key = config.path?.toString();
    if (key && !temp[key]) {
      temp[key] = true;
      return true;
    } else {
      return false;
    }
  });
};

export { filter };
