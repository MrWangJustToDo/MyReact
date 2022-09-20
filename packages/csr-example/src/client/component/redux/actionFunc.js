import { produce } from "immer";
import mime from "mime-types";
// 解析请求路径转换成为数组
function pathParse(path) {
  return path.split(/(?=\/[^/]?)/);
}

// 对data中files数组排序
function dataSort(data, judge) {
  data.files.sort(judge);
}

const sortFunc = {
  // 按id从大到小排序
  byId(flag, a, b) {
    if (flag) {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  },

  // 按修改时间排序
  byTime(flag, a, b) {
    if (flag) {
      return (
        new Date(b.modifyTime).getTime() - new Date(a.modifyTime).getTime()
      );
    } else {
      return (
        new Date(a.modifyTime).getTime() - new Date(b.modifyTime).getTime()
      );
    }
  },

  // 按文件大小排序
  bySize(flag, a, b) {
    if (flag) {
      return b.length - a.length;
    } else {
      return a.length - b.length;
    }
  },
};

const reducerFunction = {
  // 登录
  login(state, action) {
    return produce(state, (proxy) => {
      proxy.isLogin = true;
      proxy.loginUsername = action.username;
    });
  },

  // 登出
  logout(state) {
    return produce(state, (proxy) => {
      proxy.isLogin = false;
      proxy.isLoaded = false;
      proxy.totalSize = 0;
      proxy.loginUsername = "";
      proxy.currentRequestPath = "";
      proxy.currentRequestPathArr = [];
    });
  },

  // 允许文件模式
  enableFileModel(state) {
    return produce(state, (proxy) => {
      proxy.fileModel = true;
      proxy.echartsModel = false;
      proxy.recoverModel = false;
    });
  },

  // 配置文件显示模式
  changeFileModelType(state, action) {
    return produce(state, (proxy) => {
      proxy.fileModelType = action.fileModelType;
    });
  },

  // 配置全局的filetr
  changeFilter(state, action) {
    return produce(state, (proxy) => {
      proxy.filterName = action.filterName;
    });
  },

  // 允许echarts模式
  enableEchartsModel(state) {
    return produce(state, (proxy) => {
      proxy.echartsModel = true;
      proxy.fileModel = false;
      proxy.recoverModel = false;
    });
  },

  // 配置更改echarts模式类型
  changeEchartsModelType(state, action) {
    return produce(state, (proxy) => {
      proxy.echartsModelType = action.echartsModelType;
    });
  },

  // 允许recover模式
  enableRecoverModel(state, action) {
    return produce(state, (proxy) => {
      proxy.recoverModel = true;
      proxy.isLoaded = false;
      proxy.fileModel = false;
      proxy.echartsModel = false;
      proxy.preRequestPath = action.currentRequestPath;
    });
  },

  // 更改isLoaded状态,避免旧数据
  changeisLoadedToFalse(state) {
    return produce(state, (proxy) => {
      proxy.isLoaded = false;
    });
  },

  // 更改当前文件点击情况
  changeFileItemCheck(state, action) {
    return produce(state, (proxy) => {
      proxy.data.files
        .filter((it) => it.id === action.id)
        .forEach((it) => {
          it.checked = !it.checked;
        });
    });
  },

  // 更改所有文件选中情况
  changeFilesCheck(state, action) {
    return produce(state, (proxy) => {
      proxy.data.files.forEach((it) => {
        it.checked = action.checkFlag;
      });
    });
  },

  // 取消文件的选中
  changeFileItemToUnCheck(state) {
    return produce(state, (proxy) => {
      proxy.data.files.forEach((it) => (it.checked = false));
    });
  },

  // 更新资源
  refresh(state, action) {
    return produce(state, (proxy) => {
      // 更新路径
      proxy.currentRequestPath = action.currentRequestPath;
      proxy.currentRequestPathArr = pathParse(action.currentRequestPath);
      // 更新资源
      proxy.data = action.data;
      // 排序
      try {
        dataSort(
          action.data,
          sortFunc[state.sortMethod].bind(null, state.sortFlag)
        );
        // 加载完成
        proxy.isLoaded = true;
      } catch (e) {
        proxy.isLoaded = false;
      }
    });
  },

  // 重置数据项Id
  refreshId(state) {
    return produce(state, (proxy) => {
      proxy.data.files.forEach((it, index) => {
        it.id = proxy.data.files.length - 1 - index;
        if (it.fileType === "file") {
          it.linkTarget =
            it.linkTarget.slice(0, it.linkTarget.lastIndexOf("/") + 1) + it.id;
        }
      });
    });
  },

  // 上传文件
  uploadFileSuccess(state, action) {
    return produce(state, (proxy) => {
      let [targetFile] = action.data.files.filter(
        (it) => it.relativePath === action.relativePath
      );
      targetFile.id = state.data.files.length;
      let linkTarget = targetFile.linkTarget;
      targetFile.linkTarget =
        linkTarget.slice(0, linkTarget.lastIndexOf("/") + 1) + targetFile.id;
      proxy.data.files.unshift(targetFile);
    });
  },

  // 保存编辑的内容
  saveEditorItem(state, action) {
    return produce(state, (proxy) => {
      proxy.editorItems[action.relativePath] = action.fileContentCache;
    });
  },

  // 删除编辑缓存
  deleteEditorItem(state, action) {
    return produce(state, (proxy) => {
      delete proxy.editorItems[action.relativePath];
    });
  },

  // 提交更改成功
  submitFileSucess(state, action) {
    return produce(state, (proxy) => {
      let [targetFile] = action.data.files.filter(
        (it) => it.relativePath === action.relativePath
      );
      let [srcFile] = proxy.data.files.filter(
        (it) => it.relativePath === action.relativePath
      );
      srcFile.length = targetFile.length;
      srcFile.readAbleLength = targetFile.readAbleLength;
      srcFile.modifyTime = targetFile.modifyTime;
    });
  },

  // 右键菜单显示
  menuShow(state, action) {
    return produce(state, (proxy) => {
      // 记录下触发元素的信息
      proxy.menuState = true;
      proxy.menuType = action.menuType;
      proxy.menuTarget = action.menuTarget;
      proxy.menuShortName = action.menuShortName;
      proxy.menuRelativePath = action.menuRelativePath;
      proxy.menuPosition.x = action.x;
      proxy.menuPosition.y = action.y;
    });
  },

  // 右键菜单等待
  menuPadding(state) {
    return produce(state, (proxy) => {
      proxy.menuState = "padding";
    });
  },

  // 右键菜单隐藏
  menuHide(state) {
    return produce(state, (proxy) => {
      proxy.menuState = false;
      proxy.menuType = "";
      proxy.menuShortName = "";
      proxy.menuRelativePath = "";
    });
  },

  // 文件重命名
  renameItem(state) {
    return produce(state, (proxy) => {
      proxy.renameState = true;
      proxy.renameRelativePath = state.menuRelativePath;
      proxy.menuState = false;
      proxy.menuType = "";
      proxy.menuShortName = "";
      proxy.menuRelativePath = "";
    });
  },

  // 重命名完成
  renameComplated(state) {
    return produce(state, (proxy) => {
      proxy.renameState = false;
      proxy.renameRelativePath = "";
    });
  },

  // 重命名成功
  renameSuccess(state, action) {
    let originName = action.originName;
    return produce(state, (proxy) => {
      proxy.data.files
        .filter((it) => it.id === action.id)
        .forEach((it) => {
          let relativePath =
            it.relativePath.slice(0, -originName.length) + action.newName;
          it.relativePath = relativePath;
          it.resolvePath =
            it.resolvePath.slice(0, -originName.length) + action.newName;
          it.shortPath = action.newName;
          it.modifyTime = new Date().toLocaleString();
          if (it.fileType === "file") {
            let fileTypeExtention = mime.lookup(action.newName) || "undefined";
            it.fileTypeExtention = fileTypeExtention;
            if (fileTypeExtention === "text/html") {
              it.preview = true;
              it.linkPreview = `/file/${relativePath}/html/${it.id}`;
            } else {
              it.preview = false;
              it.linkPreview = "";
            }
            let extention = fileTypeExtention.slice(
              0,
              fileTypeExtention.lastIndexOf("/")
            );
            it.linkTarget = `/file/${relativePath}/${extention}/${it.id}`;
          } else {
            it.linkTarget = `/all/${relativePath}`;
          }
        });
    });
  },

  // 文件移到回收站
  removeItem(state, action) {
    return {
      ...state,
      data: {
        ...state.data,
        files: state.data.files.filter(
          (it) => it.shortPath !== action.shortPath
        ),
      },
    };
  },

  // 复制文件
  copyFileStart(state) {
    return produce(state, (proxy) => {
      proxy.copyFileState = true;
      proxy.copyShortName = proxy.menuShortName;
      proxy.copyFileRelativePath = proxy.menuRelativePath;
      proxy.copyFileAtDirRelativePath = state.data.relativePath;
      proxy.menuState = false;
      proxy.menuType = "";
      proxy.menuShortName = "";
      proxy.menuRelativePath = "";
    });
  },

  // 复制完成
  copyFileComplated(state) {
    return produce(state, (proxy) => {
      proxy.copyFileState = false;
      proxy.copyFileSize = 0;
      proxy.copyShortName = "";
      proxy.copyFileRelativePath = "";
    });
  },

  // 复制文件成功
  copyFileSuccess(state, action) {
    return produce(state, (proxy) => {
      let [targetFile] = action.data.files.filter(
        (it) => it.shortPath === action.shortPath
      );
      targetFile.id = state.data.files.length;
      let linkTarget = targetFile.linkTarget;
      targetFile.linkTarget =
        linkTarget.slice(0, linkTarget.lastIndexOf("/") + 1) + targetFile.id;
      proxy.data.files.unshift(targetFile);
    });
  },

  // 新建文件成功
  createFileSuccess(state) {
    let relativePath = state.data.relativePath
      ? state.data.relativePath + "/newFile"
      : "newFile";
    return produce(state, (proxy) => {
      proxy.data.files.unshift({
        id: state.data.files.length,
        length: 0,
        readAbleLength: "0 B",
        fileType: "file",
        fileTypeExtention: "text/html",
        modifyTime: new Date().toLocaleString(),
        shortPath: "newFile",
        relativePath: relativePath,
        resolvePath: state.data.resolvePath + "/newFile",
        linkTarget: `/file/${relativePath}/text/${state.data.files.length}`,
      });
      proxy.renameState = true;
      proxy.renameRelativePath = relativePath;
      proxy.menuState = false;
      proxy.menuType = "";
      proxy.menuShortName = "";
      proxy.menuRelativePath = "";
    });
  },

  // 创建文件夹成功
  createFolderSuccess(state) {
    let relativePath = state.data.relativePath
      ? state.data.relativePath + "/newDir"
      : "newDir";
    return produce(state, (proxy) => {
      proxy.data.files.unshift({
        id: state.data.files.length,
        length: "0",
        readAbleLength: "0 B",
        fileType: "dir",
        modifyTime: new Date().toLocaleString(),
        shortPath: "newDir",
        relativePath: relativePath,
        resolvePath: state.data.resolvePath + "/newDir",
        linkTarget: `/all/${relativePath}`,
      });
      proxy.renameState = true;
      proxy.renameRelativePath = relativePath;
      proxy.menuState = false;
      proxy.menuType = "";
      proxy.menuShortName = "";
      proxy.menuRelativePath = "";
    });
  },

  // 更新根文件夹大小
  updataRootFolderSize(state, action) {
    return produce(state, (proxy) => {
      proxy.totalSize = action.rootFolderSize;
    });
  },

  // 设置提示框文本
  setMsgOption(state, action) {
    return produce(state, (proxy) => {
      proxy.msgType = action.msgType;
      proxy.msgContent = action.msgContent;
      proxy.preRequestPath = action.currentRequestPath;
    });
  },

  // 可用msg组件
  enableMsg(state) {
    return produce(state, (proxy) => {
      proxy.msgState = true;
    });
  },

  // msg组件等待
  msgStatePadding(state) {
    return produce(state, (proxy) => {
      proxy.msgState = "padding";
    });
  },

  // 不可用msg组件
  disableMsg(state) {
    return produce(state, (proxy) => {
      proxy.msgState = false;
    });
  },
};

export { reducerFunction };
