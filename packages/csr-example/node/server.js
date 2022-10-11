// 登录服务器
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const svgCaptcha = require("svg-captcha");
const session = require("express-session");
const sqlite3 = require("sqlite3");
const multer = require("multer");
const sqlite = require("sqlite");
const cors = require("cors");
const path = require("path");
const WebSocket = require("ws");
const {
  getCurrentFolder,
  getRecoverFolder,
  getCurrentFileByPost,
  getCurrentFileByGet,
  submitFile,
  uploadFile,
  deleteItem,
  renameItem,
  recoverItem,
  createFile,
  copyFile,
  createFolder,
  downloadFile,
  wsToMap,
  sendRootFolderSize,
} = require("./api");
const createFolderByPath = require("./lib/createFolder").createFolderByPath;

dotenv.config();

// 邀请码
const InviteCode = ["mrwang"];

// 存储所有用户文件夹的文件
const BaseDir = path.resolve(process.cwd(), "._root");

// 缓存地址
const tempFolder = path.resolve(process.cwd(), "._cache");

// 上传文件缓存
let upload = multer({ dest: tempFolder });

// 创建数据库连接
var db;

// 创建服务器
let app = express();

// 配置跨域
app.use(
  cors({
    maxAge: 86400,
    origin: "*",
  })
);

app.use(express.static(`${process.cwd()}/public`));

app.use(express.static(`${process.cwd()}/dist`));

// 绑定数据库文件
app.use(async (req, rex, next) => {
  if (!db) {
    db = await sqlite.open({
      filename: path.resolve(process.cwd(), "node", "user"),
      driver: sqlite3.Database,
    });
  }
  next();
});

// 解码URL
app.use((req, res, next) => {
  req.url = decodeURIComponent(req.url);
  next();
});

// 配置json解析
app.use(express.json({ limit: "5mb" }));
// 解析表单
app.use(express.urlencoded({ extended: true }));
// 配置cookie
app.use(cookieParser("abcdefg12345"));
// 配置session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
// 生成session
app.use((req, res, next) => {
  if (!req.session.views) {
    req.session.views = {};
  }
  next();
});

// 打印请求
app.use((req, res, next) => {
  console.log(`使用${req.method}方法请求 ${req.url}`);
  next();
});

// 获取登录对象
app.use(async (req, res, next) => {
  // 从签名cookie中找出该用户的信息并挂在req对象上以供后续的中间件访问
  if (req.signedCookies.id) {
    req.user = await db.get("SELECT rowid, * FROM users WHERE rowid = ?", req.signedCookies.id);
  }
  next();
});

// 根据登录对象获取对应的rootFolder, recoverFolder的绝对路径,并添加到req对象上方便后续访问
app.use(async (req, res, next) => {
  if (req.user) {
    let temp = await db.get("SELECT * FROM folders WHERE userId = ?", req.user.rowid);
    req.rootFolder = path.resolve(BaseDir, `./${temp.rootFolder}`);
    req.recoverFolder = path.resolve(BaseDir, `./${temp.recoverFolder}`);
  }
  next();
});

// 获取验证码
app.get("/captcha", (req, res) => {
  let captcha = svgCaptcha.create({
    noise: 3,
    background: "#ffffff",
  });
  req.session.captcha = captcha.text;
  res.type("svg");
  res.send(captcha.data);
});

// 响应验证码明文,用于调试
app.get("/api/captcha/str", (req, res) => {
  res.json({ code: 0, state: req.session.captcha });
});

// 判断是否能够自动登录
app.get("/api/autoLogin", async (req, res, next) => {
  if (req.user) {
    res.json({ code: 0, state: req.user.username });
  } else {
    res.json({ code: -1, state: "fail" });
  }
});

// 登录
app.post("/api/login", async (req, res, next) => {
  if (req.session.captcha === req.body.checkcode) {
    let user = await db.get("SELECT rowid as id, * FROM users WHERE username = ? AND password = ?", req.body.username, req.body.password);
    if (user) {
      res.cookie("id", user.id, {
        maxAge: 8640000,
        signed: true,
      });
      res.json({ code: 0, state: user.username });
    } else {
      res.json({ code: -1, state: "用户信息验证失败" });
    }
  } else {
    res.json({ code: -1, state: "验证码验证失败" });
  }
});

// 登出
app.post("/api/logout", (req, res, next) => {
  res.clearCookie("id");
  res.json({ code: 0, state: "登出成功" });
});

// 检测用户名是否可用
app.get("/api/register-check", async (req, res, next) => {
  // let {count} = await db.get('SELECT count(*) as count from users');
  if (req.query.username) {
    let data = await db.get("SELECT * FROM users WHERE username = ?", req.query.username);
    if (data) {
      res.json({ code: -1, state: "用户名重复" });
    } else {
      res.json({ code: 0, status: "用户名可用" });
    }
  }
});

// 注册
app.post("/api/register", async (req, res, next) => {
  if (InviteCode.includes(req.body.invite)) {
    try {
      await db.run("INSERT INTO users VALUES(?, ?)", req.body.username, req.body.password);
      let id = await db.get("SELECT last_insert_rowid() FROM users");
      let timeStep = new Date();
      // 生成rootFolder名称
      let rootFolder = timeStep.getTime().toString(32);
      // 生成recoverFolder名称
      let recoverFolder = timeStep.getTime().toString(16);
      let resolveRootFolder = path.resolve(BaseDir, rootFolder);
      let resolveRecoverFolder = path.resolve(BaseDir, recoverFolder);
      // 创建文件夹
      await createFolderByPath(resolveRootFolder);
      await createFolderByPath(resolveRecoverFolder);
      // 写入数据库
      await db.run("INSERT INTO folders VALUES(?,?,?)", id["last_insert_rowid()"], rootFolder, recoverFolder);
      res.json({ code: 0, state: "注册成功" });
    } catch (e) {
      console.log("注册服务失败", e);
      res.json({ code: -1, state: "注册失败" });
    }
  } else {
    res.json({ code: -1, state: "邀请码不正确" });
  }
});

const wrapper = (handler) => {
  return async (req, res, next) => {
    if (req.user && req.rootFolder && req.recoverFolder) {
      await handler(req, res, next);
    } else {
      next();
    }
  };
};

app.post("/api/submit", wrapper(submitFile));
app.post("/api/upload", upload.single("file"), wrapper(uploadFile));
app.post("/api/delete", wrapper(deleteItem));
app.post("/api/rename", wrapper(renameItem));
app.post("/api/recoverItem", wrapper(recoverItem));
app.post("/api/createFile", wrapper(createFile));
app.post("/api/copyFile", wrapper(copyFile));
app.post("/api/createFolder", wrapper(createFolder));
app.post("/api/download", wrapper(downloadFile));
app.post("/api/all", wrapper(getCurrentFolder));
app.post("/api/recover", wrapper(getRecoverFolder));
app.post("/api/file", wrapper(getCurrentFileByPost));
app.use("/api/src", wrapper(getCurrentFileByGet));

const isDevelopment = process.env.NODE_ENV === "development";

// if (process.env.REACT === "myreact") {
//   require("module-alias/register");
// }

const { startApp } = require(`../${isDevelopment ? "dev" : "dist"}/server/app`);

startApp(app);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  let username = req.url.split("/").slice(-1)[0];
  console.log("WebSocket连接成功, 用户: ", username);
  wsToMap[username] = ws;
  ws.on("close", () => {
    console.log(username, "的webSocket断开连接");
    delete wsToMap[username];
  });
  try {
    async () => await sendRootFolderSize(ws, req);
  } catch (e) {}
});

const port = isDevelopment ? process.env.DEV_PORT : process.env.PROD_PORT;

const host = isDevelopment ? process.env.DEV_HOST : process.env.PROD_HOST;

server.listen(port, () => {
  console.log(`listening on port: http://${host}:${port}`);
});
