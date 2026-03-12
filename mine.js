(() => {
  // 工具对象
  let tools = {
    getColor: () => "#" + Math.random().toString(16).slice(2, 5),
    getRandom: (start, end) => ((Math.random() * (end - start)) | 0) + start,
    promiseNext: (time, action) =>
      new Promise((resolve) => {
        setTimeout(() => {
          if (action) {
            action();
          }
          resolve();
        }, time);
      }),
  };
  window.tools = tools;
})();

(() => {
  // 地雷的构造函数
  class Mine {
    constructor(options, parent, row, col) {
      this.parent = parent;
      this.options = options;
      this.baseSize = options.baseSize || 40;
      this.unCheckColor_l = options.unCheckColor_l;
      this.unCheckColor_r = options.unCheckColor_r;
      this.checkedColor_l = options.checkedColor_l;
      this.checkedColor_r = options.checkedColor_r;
      this.shortDelay = options.shortDelay;
      this.longDelay = options.longDelay;
      this.mineClassName = options.mineClassName;
      this.backClassName = options.backClassName;
      this.targetUrl = options.targetUrl;
      this.min = options.min;
      this.max = options.max;
      this.row = row;
      this.col = col;
      this._init();
    }

    // 创建背景
    _createBack() {
      return document.createElement("div");
    }

    _setColorBack() {
      if ((this.row & 1) == (this.col & 1)) {
        this.back.style.backgroundColor = this.checkedColor_l;
      } else {
        this.back.style.backgroundColor = this.checkedColor_r;
      }
    }

    _positionBack() {
      this.back.style.left = this.col * this.baseSize + "px";
      this.back.style.top = "0px";
    }

    _initBack() {
      this.back = this._createBack();
      this.back.classList.add(this.backClassName);
      this._setColorBack();
      this._positionBack();
    }

    _appendBack() {
      this.parent.append(this.back);
    }

    // 创建元素
    _createMine() {
      return document.createElement("div");
    }

    _setColorMine() {
      if ((this.row & 1) == (this.col & 1)) {
        this.mine.style.backgroundColor = this.unCheckColor_l;
      } else {
        this.mine.style.backgroundColor = this.unCheckColor_r;
      }
    }

    _randomAttrMine() {
      this.mine.style.left = `${tools.getRandom(this.min + this.col * this.baseSize, this.max + this.col * this.baseSize)}px`;
      this.mine.style.top = `${tools.getRandom(this.min, this.max)}px`;
      this.mine.style.transform = `rotateX(${tools.getRandom(0, 360)}deg) rotateY(${tools.getRandom(0, 360)}deg)`;
      this.mine.style.opacity = tools.getRandom(0, 1);
    }

    _randomAttrBack() {
      this.back.style.left = `${tools.getRandom(this.min + this.col * this.baseSize, this.max + this.col * this.baseSize)}px`;
      this.back.style.top = `${tools.getRandom(this.min, this.max)}px`;
      this.back.style.transform = `rotateX(${tools.getRandom(0, 360)}deg) rotateY(${tools.getRandom(0, 360)}deg)`;
      this.back.style.opacity = tools.getRandom(0, 1);
    }

    _reSetAttrMine() {
      this.mine.style.left = this.col * this.baseSize + "px";
      this.mine.style.top = "0px";
      this.mine.style.transform = "";
      this.mine.style.opacity = 1;
    }

    _reSetAttrBack() {
      this.back.style.left = this.col * this.baseSize + "px";
      this.back.style.top = "0px";
      this.back.style.transform = "";
      this.back.style.opacity = 1;
    }

    _canBoom() {
      if (this.options.totalMines > 0 && Math.random() < 0.15) {
        this.options.totalMines--;
        this.canBoom = 1;
        this.boomFlag = true;
      } else {
        this.canBoom = 0;
      }
    }

    _initMine() {
      this.mine = this._createMine();
      this.mine.classList.add(this.mineClassName);
      this._setColorMine();
      this._randomAttrMine();
      this._canBoom();
    }

    _appendMine() {
      this.parent.append(this.mine);
    }

    // 当前元素移除
    _removeMine() {
      this.mine.remove();
    }

    _removeBack() {
      return tools
        .promiseNext(this.shortDelay, () => this._randomAttrBack())
        .then(() => tools.promiseNext(this.longDelay, () => this.back.remove()))
        .then(() => this._reSetAttrBack());
    }

    animateShow() {
      if (this.flag && !this.showFlag) {
        this.showFlag = true;
        return tools
          .promiseNext(0, this._appendMine.bind(this))
          .then(() => tools.promiseNext(this.shortDelay, this._reSetAttrMine.bind(this)))
          .then(() => tools.promiseNext(this.longDelay, this._appendBack.bind(this)));
      } else {
        return Promise.resolve();
      }
    }

    animateRemove() {
      if (this.flag && this.showFlag) {
        this.flag = false;
        this.showFlag = false;
        this.mine.style.zIndex = 2;
        return tools
          .promiseNext(this.shortDelay, this._randomAttrMine.bind(this))
          .then(() => tools.promiseNext(this.longDelay, this._removeMine.bind(this)))
          .then(() => tools.promiseNext(this.shortDelay));
      } else {
        return Promise.resolve();
      }
    }

    animateBoom() {
      if (this.flag && this.showFlag && this.boomFlag) {
        this.boomFlag = false;
        return tools
          .promiseNext(0, () => {
            for (let i = 0; i < 5; i++) {
              for (let j = 0; j < 5; j++) {
                let cover = document.createElement("span");
                cover.classList.add("cover");
                cover.style.width = "5px";
                cover.style.height = "5px";
                cover.style.left = `${j * 5}px`;
                cover.style.top = `${i * 5}px`;
                cover.style.backgroundColor = this.mine.style.backgroundColor;
                this.mine.append(cover);
              }
            }
          })
          .then(() =>
            tools.promiseNext(0, () => {
              this.mine.style.backgroundImage = this.targetUrl;
            })
          )
          .then(() =>
            tools.promiseNext(this.shortDelay, () => {
              let temp = this.mine.children;
              for (let i = 0; i < temp.length; i++) {
                temp[i].style.left = `${tools.getRandom(this.min + (i * this.baseSize) / 3, this.max + (i * this.baseSize) / 3)}px`;
                temp[i].style.top = `${tools.getRandom(this.min, this.max)}px`;
                temp[i].style.transform = `rotateX(${tools.getRandom(0, 360)}deg) rotateY(${tools.getRandom(0, 360)}deg)`;
                temp[i].style.opacity = tools.getRandom(0, 1);
                temp[i].style.boxShadow = "0px 0px 6px 1px rgba(120, 120, 120, 0.8)";
              }
            })
          )
          .then(() =>
            tools.promiseNext(this.shortDelay * 2, () => {
              let temp = this.mine.children;
              for (let i = temp.length - 1; i >= 0; i--) {
                temp[i].remove();
              }
            })
          );
      } else {
        return Promise.resolve();
      }
    }

    // 添加文本
    addMsg(msg) {
      this.back.textContent = msg;
      if (msg == 1) {
        this.back.style.color = "blue";
      } else if (msg == 2) {
        this.back.style.color = "green";
      } else if (msg > 2) {
        this.back.style.color = "red";
      }
    }

    _removeMsg() {
      this.back.textContent = "";
    }

    // 初始化
    _init() {
      if (!this.flag) {
        this.flag = true;
        this.showFlag = false;
        this._initBack();
        this._initMine();
      }
    }

    _pick() {
      if (this.flag && this.showFlag) {
        if (!this.picFlag && this.options.lastFlags) {
          let key = this.row + ":" + this.col;
          this.options.pickedObj[key] = 1;
          this.picFlag = true;
          // this.mine.classList.add("pick");
          this.flag = document.createElement("div");
          this.flag.classList.add("pick");
          this.mine.append(this.flag);
          this.options.picked++;
          this.options.lastFlags--;
          if (this.canBoom == 1) {
            this.options.lastMines--;
          }
        } else if (this.picFlag) {
          let key = this.row + ":" + this.col;
          this.options.pickedObj[key] = 0;
          this.picFlag = false;
          // this.mine.classList.remove("pick");
          this.flag.remove();
          this.options.picked--;
          this.options.lastFlags++;
          if (this.canBoom == 1) {
            this.options.lastMines++;
          }
        }
      }
    }

    // 重置
    _reset() {
      return tools
        .promiseNext(0, () => {
          this.flag = true;
          this.picFlag = false;
          this.showFlag = true;
          this._initMine();
        })
        .then(() => tools.promiseNext(0, this._appendMine.bind(this)))
        .then(() => tools.promiseNext(this.shortDelay, this._reSetAttrMine.bind(this)))
        .then(() => tools.promiseNext(this.longDelay));
    }

    // 添加点击事件
    click(callback) {
      this.mine.addEventListener("mousedown", callback.bind(this));
    }
  }

  window.Mine = Mine;
})();

(() => {
  class MineRow {
    constructor(options, parent, currentRowIndex) {
      this.options = options;
      this.parent = parent;
      this.rowClassName = options.rowClassName;
      this.baseSize = options.baseSize;
      this.row = options.row;
      this.col = options.col;
      this.currentRowIndex = currentRowIndex;
      this._initRow();
    }

    _createRow() {
      return document.createElement("div");
    }

    _appendRow() {
      this.parent.append(this.row);
    }

    _initRow() {
      this.row = this._createRow();
      this.row.classList.add(this.rowClassName);
      this.row.style.width = `${this.col * this.baseSize}px`;
      this.row.style.height = `${this.baseSize}px`;
      this.list = [];
      for (let i = 0; i < this.col; i++) {
        this.list.push(new Mine(this.options, this.row, this.currentRowIndex, i));
      }
    }

    getEle(colIndex) {
      return this.list[colIndex];
    }

    click(callback) {
      this.list.forEach((it) => it.click(callback));
    }

    show() {
      return tools.promiseNext(0, this._appendRow.bind(this)).then(() => Promise.all(this.list.map((it) => it.animateShow())));
    }

    remove() {
      return Promise.all(this.list.map((it) => it.animateRemove()));
    }

    reset() {
      return Promise.all(this.list.map((it) => it._reset()));
    }

    removeMsg() {
      this.list.forEach((it) => it._removeMsg());
    }

    _removeRowBack() {
      return Promise.all(this.list.map((it) => it._removeBack()));
    }
  }
  window.MineRow = MineRow;
})();

(() => {
  // 地雷棋盘的构造函数
  class MineMap {
    constructor(options) {
      this.options = options;
      this.mapParent = options.mapParent;
      this.row = options.row;
      this.col = options.col;
      this.baseSize = options.baseSize;
      this.rowClassName = options.rowClassName;
      this.maskClassName = options.maskClassName;
      this.diagClassName = options.diagClassName;
      this.longDelay = options.longDelay;
      this.shortDelay = options.shortDelay;
      this._init();
    }

    _createAllEle() {
      this.allEle = [];
      for (let i = 0; i < this.row; i++) {
        this.allEle.push(new MineRow(this.options, this.mapParent, i));
      }
    }

    getEle(row, col) {
      return this.allEle[row].getEle(col);
    }

    removeEle(row, col) {
      return this.getEle(row, col).animateRemove();
      // return this.getEle(row, col).animateBoom();
    }

    showEle(row, col) {
      return this.getEle(row, col).animateShow();
    }

    showAll() {
      return Promise.all(this.allEle.map((it) => it.show()));
    }

    removeAll() {
      return tools.promiseNext(0, this.clearMsg.bind(this)).then(() => Promise.all(this.allEle.map((it) => it.remove())));
    }

    clearMsg() {
      this.allEle.forEach((it) => it.removeMsg());
    }

    _init() {
      this._createAllEle();
    }

    reset() {
      return Promise.all(this.allEle.map((it) => it.reset()));
    }

    click(callback) {
      this.allEle.forEach((it) => it.click(callback));
    }

    removeMap() {
      return this.removeAll().then(() => Promise.all(this.allEle.map((it) => it._removeRowBack())));
    }
  }

  window.MineMap = MineMap;
})();

(() => {
  class MapMask {
    constructor(options, mineMap) {
      this.mineMap = mineMap;
      this.shortDelay = options.shortDelay;
      this.longDelay = options.longDelay;
      this.maskClassName = options.maskClassName;
      this.mapParent = mineMap.mapParent;
      this._init();
    }

    _createMask() {
      return document.createElement("div");
    }

    getMask() {
      return this.mask;
    }

    _init() {
      this.mask = this._createMask();
      this.mask.classList.add(this.maskClassName);
    }

    // 初始化
    initMask() {
      return tools
        .promiseNext(0, () => {
          this.mapParent.append(this.mask);
        })
        .then(() =>
          tools.promiseNext(this.shortDelay, () => {
            this.mask.classList.add("show");
          })
        )
        .then(() => tools.promiseNext(this.shortDelay));
    }

    removeMask() {
      return tools
        .promiseNext(this.shortDelay, () => {
          this.mask.classList.remove("show");
        })
        .then(() =>
          tools.promiseNext(this.longDelay, () => {
            this.mask.remove();
          })
        );
    }
  }

  window.MapMask = MapMask;
})();

(() => {
  class Dialog {
    constructor(options, maskParent) {
      this.options = options;
      this.shortDelay = options.shortDelay;
      this.longDelay = options.longDelay;
      this.diaglogClassName = options.diaglogClassName;
      this.maskParent = maskParent;
      this._init();
    }

    _createDiag() {
      return document.createElement("div");
    }

    _createMsg() {
      return document.createElement("span");
    }

    _createClose() {
      return document.createElement("i");
    }

    _createBtn() {
      return document.createElement("a");
    }

    _initMsg(point) {
      this.msg = this._createMsg();
      this.msg.textContent = point;
      this.log.append(this.msg);
    }

    _initClose(action) {
      this.close = this._createClose();
      this.close.classList.add("fa", "fa-close");
      this.close.addEventListener("click", action);
      this.log.append(this.close);
    }

    _initBtn(action) {
      this.btn = this._createBtn();
      this.btn.textContent = "开始";
      this.btn.addEventListener("click", action);
      this.log.append(this.btn);
    }

    _init() {
      this.log = this._createDiag();
      this.log.classList.add(this.diaglogClassName);
    }

    initMsg(msg, action) {
      return tools
        .promiseNext(0, () => {
          this.log.classList.add("show");
        })
        .then(() => {
          this.log.textContent = msg;
          this.log.style.flexDirection = "column";
          this._initBtn((e) => {
            action(e).then(() => {
              this.log.style.flexDirection = "row";
            });
          });
        })
        .then(() => {
          this.maskParent.append(this.log);
        });
    }

    initPoint(point, action) {
      return tools
        .promiseNext(0, () => {
          this.log.classList.add("show");
        })
        .then(() => {
          this.log.textContent = "游戏结束,得分: ";
          this._initMsg(point);
          this._initClose(action);
        })
        .then(() => {
          this.maskParent.append(this.log);
        });
    }

    removeLog() {
      return tools.promiseNext(0, () => this.log.remove());
    }
  }

  window.Dialog = Dialog;
})();

(() => {
  class Game {
    constructor(options) {
      this.options = options;
      this.headParent = options.headParent;
      this.mapParent = options.mapParent;
      this.shortDelay = options.shortDelay;
      this.longDelay = options.longDelay;
      this.rowClassName = options.rowClassName;
      this.totalPoint = 0;
      this.col = options.col;
      this.totalMines = options.totalMines;
      this.baseSize = options.baseSize;
      this.timeEle = options.timeEle;
      this.flagEle = options.flagEle;
      this.selectEle = options.selectEle;
      this.closeEle = options.closeEle;
    }

    clickItem(item, map) {
      let key = item.row + ":" + item.col;
      if (!map.options.pickedObj[key]) {
        if (item.canBoom == 1) {
          this._boom(item).then(() => {
            this._close();
          });
        } else {
          let obj = {};
          next(item.row, item.col, obj);
          return obj;
        }
      }
      function next(row, col, temp) {
        if (row >= 0 && col >= 0 && row < map.row && col < map.col) {
          temp[row + ":" + col] = 1;
          let current = map.getEle(row, col);
          let key1 = row - 1 + ":" + (col - 1);
          let key2 = row - 1 + ":" + col;
          let key3 = row - 1 + ":" + (col + 1);
          let key4 = row + ":" + (col - 1);
          let key5 = row + ":" + (col + 1);
          let key6 = row + 1 + ":" + (col - 1);
          let key7 = row + 1 + ":" + col;
          let key8 = row + 1 + ":" + (col + 1);
          let arr = Array.of(key1, key2, key3, key4, key5, key6, key7, key8);
          let re = 0;
          arr.forEach((it) => {
            let [x, y] = it.split(":");
            re += getRe(Number(x), Number(y));
          });
          if (!map.options.pickedObj[row + ":" + col]) {
            map.removeEle(row, col);
          }
          if (re > 0) {
            current.addMsg(re);
          } else {
            arr.forEach((it) => {
              if (!(it in temp)) {
                let [x, y] = it.split(":");
                next(Number(x), Number(y), temp);
              }
            });
          }
        }
      }

      function getRe(row, col) {
        if (row >= 0 && col >= 0 && row < map.row && col < map.col) {
          return map.getEle(row, col).canBoom;
        } else {
          return 0;
        }
      }
    }

    // 初始化
    _init() {
      this.options.totalMines = this.totalMines;
      // 初始化棋盘
      this.mineMap = new MineMap(this.options);
      this.closeEle.disabled = true;
      this.selectEle.disabled = true;
      return Promise.all([this.mineMap.showAll(), (this.headParent.style.width = `${this.col * this.baseSize + 0.3}px`)])
        .then(() =>
          tools.promiseNext(this.shortDelay, () => {
            this.mask = new MapMask(this.options, this.mineMap);
          })
        )
        .then(() => this.mask.initMask())
        .then(() =>
          tools.promiseNext(this.shortDelay, () => {
            this.log = new Dialog(this.options, this.mask.getMask());
          })
        )
        .then(() => this.log.initMsg("欢迎", this._removeLogAndMask.bind(this)))
        .then(() => {
          this.addEvent();
        })
        .then(() => {
          this.flagEle.textContent = this.totalMines - this.options.totalMines;
          this.timeEle.textContent = "0000";
          this.options.totalFlags = this.totalMines - this.options.totalMines;
          this.options.lastMines = this.totalMines - this.options.totalMines;
          this.options.lastFlags = this.options.totalFlags;
          this.options.picked = 0;
          this.options.pickedObj = {};
          this.options.alive = true;
        });
    }

    // 为每一个元素添加点击事件
    addEvent() {
      let that = this;
      this.mineMap.click(function (e) {
        if (this.options.alive) {
          if (e.which == 1) {
            that.clickItem(this, that.mineMap);
          } else if (e.which == 3) {
            this._pick();
            that.flagEle.textContent = this.options.totalFlags - this.options.picked;
            if (this.options.lastMines == 0) {
              that.success();
            }
          }
        }
      });
    }

    success() {
      return this.mineMap
        .removeAll()
        .then(() => this._resetTime())
        .then(() => this.mask.initMask())
        .then(() => tools.promiseNext(this.shortDelay, () => this.log.initMsg("恭喜通关", this._reset.bind(this))));
    }

    _timeStart() {
      this._resetTime();
      let that = this;
      this.timeId = setInterval(
        () => {
          let t = Number(that.timeEle.textContent);
          t++;
          t += "";
          t = t.padStart(4, "0");
          that.timeEle.textContent = t;
        },
        1000,
        1000
      );
    }

    _resetTime() {
      clearInterval(this.timeId);
      this.timeEle.textContent = "0000";
    }

    _reset() {
      return tools
        .promiseNext(0, () => {
          this.options.totalMines = this.totalMines;
        })
        .then(() => this._removeLogAndMask())
        .then(() => this.mineMap.reset())
        .then(() => this.addEvent())
        .then(() => {
          this.flagEle.textContent = this.totalMines - this.options.totalMines;
          this.options.totalFlags = this.totalMines - this.options.totalMines;
          this.options.lastMines = this.totalMines - this.options.totalMines;
          this.options.lastFlags = this.options.totalFlags;
          this.options.picked = 0;
          this.options.pickedObj = {};
          this.options.alive = true;
          this.selectEle.disabled = false;
          this.closeEle.disabled = false;
        });
    }

    _removeLogAndMask() {
      return tools
        .promiseNext(this.shortDelay, () => this.log.removeLog())
        .then(() => this.mask.removeMask())
        .then(() => this._timeStart())
        .then(() => {
          this.selectEle.disabled = false;
          this.closeEle.disabled = false;
        });
    }

    _end() {
      return tools
        .promiseNext(this.shortDelay, () => {
          this.mapParent.classList.add("move");
        })
        .then(() => {
          tools.promiseNext(250, () => {
            this.mapParent.classList.remove("move");
          });
        });
    }

    _boom(item) {
      return Promise.all([
        (this.selectEle.disabled = true),
        (this.closeEle.disabled = true),
        item.animateBoom(),
        tools.promiseNext(0, () => {
          this.options.alive = false;
        }),
      ]).then(() =>
        this.mineMap.allEle.reduce(
          (pre, currentRow) =>
            pre.then(() =>
              currentRow.list.reduce(
                (p, i) =>
                  p.then(() => {
                    if (i.canBoom == 1) {
                      return i.animateBoom();
                    } else {
                      return Promise.resolve();
                    }
                  }),
                Promise.resolve()
              )
            ),
          Promise.resolve()
        )
      );
    }

    _close() {
      return Promise.all([this._end(), this.mineMap.removeAll(), tools.promiseNext(0, this._resetTime.bind(this))])
        .then(() => this.mask.initMask())
        .then(() =>
          tools.promiseNext(this.shortDelay, () =>
            this.log.initPoint(this.totalMines - this.options.totalMines - this.options.lastMines, this._reset.bind(this))
          )
        );
    }

    removeGame() {
      return this.mineMap.removeMap().then(() => this.clearAll());
    }

    clearAll() {
      return tools.promiseNext(this.shortDelay, () => {
        this._resetTime();
        Array.from(document.querySelectorAll("." + this.rowClassName)).forEach((it) => it.remove());
      });
    }
  }
  window.Game = Game;
})();

(() => {
  addEventListener("DOMContentLoaded", () => {
    let div = document.querySelector(".container");
    let head = document.querySelector(".head");
    let select = document.querySelector(".select");
    let tool = document.querySelector(".tool");
    let close = document.querySelector(".close");
    let closeBtn = close.firstElementChild;
    let flagEle = document.querySelector(".flag>span:last-child");
    let timeEle = document.querySelector(".time>span:last-child");
    let options = {
      mapParent: div,
      headParent: head,
      flagEle: flagEle,
      timeEle: timeEle,
      selectEle: select,
      closeEle: closeBtn,
      rowClassName: "mineRow",
      maskClassName: "mineMapMask",
      diaglogClassName: "maskDiag",
      targetUrl: "url(./target.jpg)",
      baseSize: 30,
      unCheckColor_l: "#aad771",
      unCheckColor_r: "#a2d140",
      checkedColor_l: "#d7b899",
      checkedColor_r: "#e5c29f",
      mineClassName: "mine",
      backClassName: "mineBack",
      pickedObj: {},
      longDelay: 400,
      shortDelay: 100,
      picked: 0,
      min: -80,
      max: 80,
    };

    var game;

    div.oncontextmenu = function () {
      return false;
    };

    select.addEventListener("change", () => {
      if (select.value) {
        if (game) {
          game
            .clearAll()
            .then(() => {
              close.classList.remove("show");
              tool.classList.remove("show");
            })
            .then(() => {
              switch (select.value) {
                case "1":
                  options.row = 10;
                  options.col = 18;
                  options.totalMines = 20;
                  game = new Game(options);
                  game._init().then(() => {
                    close.classList.add("show");
                    tool.classList.add("show");
                  });
                  break;
                case "2":
                  options.row = 14;
                  options.col = 23;
                  options.totalMines = 35;
                  game = new Game(options);
                  game._init().then(() => {
                    close.classList.add("show");
                    tool.classList.add("show");
                  });
                  break;
                case "3":
                  options.row = 18;
                  options.col = 26;
                  options.totalMines = 50;
                  game = new Game(options);
                  game._init().then(() => {
                    close.classList.add("show");
                    tool.classList.add("show");
                  });
                  break;
              }
            });
        } else {
          switch (select.value) {
            case "1":
              options.row = 10;
              options.col = 18;
              options.totalMines = 20;
              game = new Game(options);
              game._init().then(() => {
                close.classList.add("show");
                tool.classList.add("show");
              });
              break;
            case "2":
              options.row = 14;
              options.col = 23;
              options.totalMines = 35;
              game = new Game(options);
              game._init().then(() => {
                close.classList.add("show");
                tool.classList.add("show");
              });
              break;
            case "3":
              options.row = 18;
              options.col = 26;
              options.totalMines = 50;
              game = new Game(options);
              game._init().then(() => {
                close.classList.add("show");
                tool.classList.add("show");
              });
              break;
          }
        }
      }
    });

    closeBtn.addEventListener("click", () => {
      if (game) {
        tools
          .promiseNext(options.shortDelay, () => {
            close.classList.remove("show");
            tool.classList.remove("show");
          })
          .then(() => {
            head.style.width = "";
          })
          .then(() => game.removeGame())
          .then(() => {
            select.selectedIndex = 0;
          });
      }
    });
  });
})();
