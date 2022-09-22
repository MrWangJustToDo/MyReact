export const safeParse = <T = any>(s: string): T | null => {
  try {
    return JSON.parse(s) as T;
  } catch (e) {
    console.error(`parse error: ${(e as Error).message}`);
    return null;
  }
};
