import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import calendarPlugin from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";

import { log } from "./log";

dayjs.locale("zh-cn");
dayjs.extend(relativeTime);
dayjs.extend(calendarPlugin);

const momentTo = (time: string | Date) => {
  if (typeof time === "string") {
    time = new Date(time);
  }
  if (time instanceof Date) {
    return dayjs(new Date()).to(dayjs(time));
  } else {
    log(`time parameter error : ${time}`, "error");
    return dayjs().toNow();
  }
};

export { momentTo, dayjs };
