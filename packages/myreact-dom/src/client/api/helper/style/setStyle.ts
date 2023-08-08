import { isUnitlessNumber } from "@my-react-dom-shared";

export const setStyle = (el: HTMLElement, name: string, value?: string | boolean | number | null) => {
  if (typeof value === "number" || isUnitlessNumber[name]) {
    el.style[name] = `${value}px`;
  } else if (name.startsWith("-")) {
    el.style.setProperty(name, String(value));
  } else if (value === undefined || value === null) {
    el.style[name] = "";
  } else {
    el.style[name] = String(value);
  }
};
