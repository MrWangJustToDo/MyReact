export const fork = () => {
  throw new Error("child_process.fork is not available in browser");
};

export const spawn = () => {
  throw new Error("child_process.spawn is not available in browser");
};

export const exec = () => {
  throw new Error("child_process.exec is not available in browser");
};

export default { fork, spawn, exec };
