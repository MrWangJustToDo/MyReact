export function getStack() {
  const orig = Error.prepareStackTrace;

  Error.prepareStackTrace = (_, stack) => stack;

  const error = new Error();

  const stack = error.stack as unknown as NodeJS.CallSite[];

  Error.prepareStackTrace = orig;

  return stack;
}
