function parse(jsonString: string | any[]) {
  let index = 0;
  const startParse = (str: string): any => {
    while (str[index] === " " || str[index] === "," || str[index] === ":") {
      index++;
    }
    if (index < jsonString.length) {
      if (str[index] === "[") {
        index++;
        return parseArray(str);
      } else if (str[index] === "{") {
        index++;
        return parseObject(str);
      } else {
        return parseValue(str);
      }
    }
  };
  const parseNumber = (val: string) => {
    if (!isNaN(+val)) {
      return Number(val);
    }
    return val;
  };
  const parseString = (val: string) => {
    return val;
  };
  const parseNull = (val: string) => {
    if (typeof val === "string" && val === "null") {
      return null;
    }
    return val;
  };
  const parseUndefined = (val: string) => {
    if (typeof val === "string" && val === "undefined") {
      return undefined;
    }
    return val;
  };
  const parseBoolean = (val: string) => {
    if (typeof val === "string" && (val === "true" || val === "false")) {
      if (val === "true") {
        return true;
      } else {
        return false;
      }
    }
    return val;
  };
  const parseObject = (str: string) => {
    const re: any = {};
    while (index < str.length && str[index] !== "}") {
      re[startParse(str) as string] = startParse(str);
    }
    index++;
    return re;
  };
  const parseArray = (str: string) => {
    const re = [];
    while (index < str.length && str[index] !== "]") {
      re.push(startParse(str));
    }
    index++;
    return re;
  };
  const parseValue = (str: string) => {
    const endChar = [",", "{", "}", "[", "]", ":"];
    let re: any = "";
    while (index < str.length && !endChar.includes(str[index])) {
      if (str[index] !== '"' && str[index] !== " ") {
        re += str[index++];
      } else {
        index++;
      }
    }
    re = parseString(re);
    re = parseNumber(re);
    re = parseNull(re);
    re = parseUndefined(re);
    re = parseBoolean(re);
    return re;
  };

  if (jsonString && typeof jsonString === "string") {
    const re = startParse(jsonString);
    if (index !== jsonString.length) {
      console.error("多个入口, index: ", index, jsonString.slice(index));
    }
    return re;
  } else {
    throw new Error("必须传入一个有效字符串");
  }
}

export { parse };
