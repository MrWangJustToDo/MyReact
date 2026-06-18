const patchConsole = (_callback: (stream: string, data: string) => void) => {
  return () => {};
};

export default patchConsole;
