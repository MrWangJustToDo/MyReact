import type { ApiRequestResult, AutoTransformDataType, FormChild, FormSerializeType, ResultProps } from "types/utils";

const autoTransformData: AutoTransformDataType = <T, F>(data: ResultProps<T, F>) => {
  if (data.code !== undefined && data.state && data.data) {
    return (<ApiRequestResult<T>>data).data;
  } else {
    return <F>data;
  }
};

const formSerialize: FormSerializeType = (element: HTMLFormElement) => {
  const re: { [props: string]: string | Array<string> } = {};
  const arr = ["button", "file", "reset", "submit"];
  if (element.localName === "form") {
    const inputs = Array.from<FormChild>(element.elements);
    inputs.forEach((item) => {
      if (item.name && item.type) {
        if (!arr.includes(item.type)) {
          if (item.type === "radio") {
            if ((item as HTMLInputElement).checked && item.value) {
              re[item.name] = item.value;
            }
          } else if (item.type === "checkbox") {
            if ((item as HTMLInputElement).checked && item.name && item.value) {
              if (item.name in re) {
                (re[item.name] as Array<string>).push(item.value);
              } else {
                re[item.name] = [item.value];
              }
            }
          } else if (item.localName === "select") {
            const selectItems = (item as HTMLSelectElement).selectedOptions;
            if ((item as HTMLSelectElement).multiple) {
              re[item.name] = [];
              Array.from(selectItems).forEach((selectItem) => {
                if (!selectItem.disabled && item.name) {
                  (re[item.name] as Array<string>).push(selectItem.value);
                }
              });
            } else {
              Array.from(selectItems).forEach((selectItem) => {
                if (!selectItem.disabled && item.name) {
                  re[item.name] = selectItem.value;
                }
              });
            }
          } else {
            if (!item.disabled && item.value) {
              re[item.name] = item.value;
            }
          }
        }
      }
    });
  } else {
    throw new Error(`FormSerialize parameter type error`);
  }
  return re;
};

const getRandom = (start: number, end?: number): number => {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  return ((Math.random() * (end - start + 1)) | 0) + start;
};

const parseToString = (obj: { [props: string]: any } | Array<any> | string | number, preString = ""): string => {
  let re = "";
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      re += preString + "[\n";
      obj.forEach((item) => {
        re += preString + parseToString(item, preString + "".padEnd(2)) + "\n";
      });
      re += preString + "]\n";
    } else {
      for (const key in obj) {
        re += preString + "{\n";
        re += parseToString(key, preString + "".padEnd(1)) + ":" + parseToString(obj[key], preString + "".padEnd(2)) + "\n";
        re += preString + "}\n";
      }
    }
    return re;
  } else {
    return preString + obj;
  }
};

interface Point {
  clientX: number;
  clientY: number;
}

const pinchHelper = {
  isPointerEvent: (event: any): event is PointerEvent => self.PointerEvent && event instanceof PointerEvent,
  getDistance: (a: Point, b?: Point): number => {
    if (!b) return 0;
    return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);
  },
  getMidpoint: (a: Point, b?: Point): Point => {
    if (!b) return a;
    return {
      clientX: (a.clientX + b.clientX) / 2,
      clientY: (a.clientY + b.clientY) / 2,
    };
  },
  getAbsoluteValue: (value: string | number, max: number): number => {
    if (typeof value === "number") return value;

    if (value.trimRight().endsWith("%")) {
      return (max * parseFloat(value)) / 100;
    }
    return parseFloat(value);
  },
  createMatrix: () => new DOMMatrix(),
  createPoint: () => new DOMPoint(),
};

export { autoTransformData, formSerialize, getRandom, parseToString, pinchHelper };
