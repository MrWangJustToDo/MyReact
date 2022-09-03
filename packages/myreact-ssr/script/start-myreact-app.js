require("module-alias/register");

if (process.env.NODE_ENV === "development") {
  require("../dev/server/app");
} else {
  require("../dist/server/app");
}
