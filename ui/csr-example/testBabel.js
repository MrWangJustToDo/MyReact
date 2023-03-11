module.exports = function (babel, opts) {
  console.log(babel, opts);

  return {
    name: "my-test-babel-plugin",
    visitor: {
      ClassDeclaration: {
        enter(path) {
          console.log("class:");

          console.log(path);
        },
      },
      Program: {
        enter(path, state) {
          console.log(path);

          console.log(state);
        },
        exit(path, state) {
          console.log(path);

          console.log(state);
        },
      },
    },
  };
};
