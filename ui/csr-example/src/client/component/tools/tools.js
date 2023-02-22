const getColor = () => "#" + Math.random().toString(16).slice(2, 5);

const getRandom = (start, end) => ((Math.random() * (end - start)) | 0) + start;

const promiseNext = (time, action) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (action) {
        action();
      }
      resolve();
    }, time);
  });

export { getColor, getRandom, promiseNext };
