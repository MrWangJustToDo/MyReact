import Cookies from "js-cookie";

import type { GetHeaderType, HeaderProps } from "types/utils";

const getHeader: GetHeaderType = (header = {}) => {
  const resultHeader: HeaderProps = {};
  for (const key in header) {
    if (header[key] === true) {
      resultHeader[key] = Cookies.get(`${key}`) || "";
    } else {
      resultHeader[key] = header[key];
    }
  }
  return resultHeader;
};

export { getHeader };
