import { createStore, applyMiddleware } from "redux";
import mime from "mime-types";
import { reducerFunction } from "./actionFunc";
import { axiosPost } from "../tools/requestData";

// 全局store的reducer处理函数
function listFilterReducer(state, action) {
  let handler = reducerFunction[action.type];
  if (handler) {
    try {
      let re = handler(state, action);
      return re;
    } catch (e) {
      return state;
    }
  } else {
    return state;
  }
}

// 使用自定义中间件获取异步请求
export default createStore(
  listFilterReducer,
  {
    // 是否登录
    isLogin: false,
    // 登录用户名
    loginUsername: "",
    // 显示文件模式
    fileModel: true,
    // file显示模式
    fileModelType: "table",
    // 过滤文件名
    filterName: "filterDefault",
    // 显示echarts模式
    echartsModel: false,
    // echarts显示模式
    echartsModelType: "pie",
    // 显示回收站模式
    recoverModel: false,
    // 总空间允许大小
    allowSize: 1000000000,
    // 已用空间大小
    totalSize: 0,
    // 信息组件状态
    msgState: false,
    // 信息类型
    msgType: "",
    // 信息组件内容
    msgContent: "",
    // 当前请求路径
    currentRequestPath: "",
    // 前一个请求路径
    preRequestPath: "",
    // 当前请求路径的数组
    currentRequestPathArr: [],
    // 菜单组件状态
    menuState: false,
    // 菜单元素对应文件链接
    menuTarget: "",
    // 菜单组件位置
    menuPosition: { x: 0, y: 0 },
    // 触发菜单组件的类型
    menuType: "",
    // 菜单组件对应相对路径
    menuRelativePath: "",
    // 菜单组件对应名称
    menuShortName: "",
    // 重命名状态
    renameState: false,
    // 重命名相对路径
    renameRelativePath: "",
    // 复制文件名状态
    copyFileState: false,
    // 复制文件名
    copyShortName: "",
    // 复制文件相对路径
    copyFileRelativePath: "",
    // 复制文件所在文件夹
    copyFileAtDirRelativePath: "",
    // 是否加载完成
    isLoaded: false,
    // 编辑文件内容存储
    editorItems: {},
    // 可编辑保存大小
    editableLength: 5000000,
    // 当前请求的数据
    data: {},
    // 数据排序
    sortFlag: true,
    // 排序依据
    sortMethod: "byId",
  },
  applyMiddleware(
    (store) => (next) => (action) => {
      // 判断路径的中间件
      if ("isSamePath" in action) {
        next(action);
      } else {
        if (action.currentRequestPath === store.getState().currentRequestPath) {
          return next({ ...action, isSamePath: true });
        } else {
          if (action.currentRequestPath) {
            return next({ ...action, isSamePath: false });
          } else {
            return next({ ...action, isSamePath: true });
          }
        }
      }
    },
    (store) => (next) => (action) => {
      // 执行请求的中间件
      if (!action.isSamePath) {
        if (action.currentRequestPath.startsWith("/all")) {
          axiosPost("/api/all", { requestPath: action.currentRequestPath })
            .then((data) => {
              next({ ...action, data: data.state });
            })
            .catch((e) => {
              next({ ...action, data: {} });
            });
        } else {
          axiosPost("/api/recover", { requestPath: action.currentRequestPath })
            .then((data) => {
              next({ ...action, data: data.state });
            })
            .catch((e) => {
              next({ ...action, data: {} });
            });
        }
      } else {
        next(action);
      }
    },
    (store) => (next) => (action) => {
      // 获取文件mime-type的中间件
      if (!action.isSamePath) {
        try {
          let newFiles = action.data.files.map((it) => {
            let fileTypeExtention = mime.lookup(it.shortPath) || "undefined";
            return {
              ...it,
              fileTypeExtention,
            };
          });
          action.data.files = newFiles;
          next(action);
        } catch (e) {
          next(action);
        }
      } else {
        next(action);
      }
    },
    (store) => (next) => (action) => {
      // 生成linkTarget
      if (!action.isSamePath) {
        try {
          let newFiles = action.data.files.map((it) => {
            let linkTarget;
            if (it.fileType === "file") {
              let extention = it.fileTypeExtention.slice(0, it.fileTypeExtention.lastIndexOf("/"));
              if (it.fileTypeExtention === "text/html") {
                it["preview"] = true;
                it["linkPreview"] = `/file/${it.relativePath}/html/${it.id}`;
              }
              linkTarget = `/file/${it.relativePath}/${extention}/${it.id}`;
            } else {
              linkTarget = `/all/${it.relativePath}`;
            }
            return {
              ...it,
              linkTarget,
            };
          });
          action.data.files = newFiles;
          next(action);
        } catch (e) {
          next(action);
        }
      } else {
        next(action);
      }
    }
  )
);
