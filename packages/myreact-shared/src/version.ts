export const compareVersion = (version1: string, version2: string) => {
  const compare = (arr1: number[], arr2: number[]) => {
    if (arr1.length && arr2.length) {
      const v1 = arr1[0];
      const v2 = arr2[0];
      if (v1 > v2) return true;
      if (v2 > v1) return false;
      return compare(arr1.slice(1), arr2.slice(1));
    }
    if (arr1.length) return true;
    if (arr2.length) return false;
    return null;
  };

  return compare(version1.split(".").map(Number), version2.split(".").map(Number));
};
