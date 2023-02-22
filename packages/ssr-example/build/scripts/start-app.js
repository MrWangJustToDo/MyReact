const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

console.log(process.env.REACT, process.env.REACT === 'myreact');
if (process.env.REACT === "myreact") {
  require("module-alias/register");
}

if (process.env.NODE_ENV === "development") {
  require(path.resolve(process.cwd(), "dev", "server", "app.js"));
} else {
  require(path.resolve(process.cwd(), "dist", "server", "app.js"));
}
