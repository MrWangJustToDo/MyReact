// zoom 组件
function zoom(src, scrollAble = window, zoomIndex = 4, index = 1.4) {
  let imgSrc = null;
  if (src.tagName === "IMG") {
    imgSrc = src.src;
  } else {
    throw new Error("target is not a IMG");
  }

  // // 需要的样式
  // class ZoomStyle {
  //   constructor(document) {
  //     this.parent = parent;
  //     this.document = document;
  //     this.zoom_Style_Flag = false;
  //     this._init();
  //   }

  //   _getZoomStyle() {
  //     let style = document.createElement("style");
  //     style.classList.add("zoom_style");
  //     style.innerHTML = `
  //   .zoom_img_parent {
  //     position: relative;
  //     display: inline-block;
  //     cursor: move;
  //   }

  //   .zoom_img_cover {
  //     position: absolute;
  //     left: 0;
  //     top: 0;
  //     font-size: 0;
  //   }

  //   .zoom_img_target {
  //     position: absolute;
  //     left: 50%;
  //     top: 50%;
  //     transform: translate(-50%, -50%);
  //     background-repeat: no-repeat;
  //     filter: drop-shadow(0 0 0 2px red);
  //     nbox-shadow: 0 0 0 2px red inset;
  //     z-index: 99999;
  //   }

  //   .zoom_img_target_border {
  //     border: 2px solid #555;
  //     position: absolute;
  //     border-radius: 50%;
  //     left: 50%;
  //     top: 50%;
  //     transform: translate(-50%, -50%);
  //     z-index: 10;
  //     box-sizing: border-box;
  //   }
    
  //   .zoom_hide {
  //     display: none;
  //   }
  //   `;
  //     return style;
  //   }

  //   _init() {
  //     if (
  //       !this.zoom_Style_Flag &&
  //       !this.document.querySelector(".zoom_style")
  //     ) {
  //       this.document.append(this._getZoomStyle());
  //       this.zoom_Style_Flag = true;
  //     }
  //   }
  // }

  // new ZoomStyle(document.body);

  // 动态创建父元素覆盖
  class Image {
    constructor(imageItem, zoomIndex, targetIndex) {
      this.imageItem = imageItem;
      this.imageItem.style.userSelect = "none";
      this.parentItem = document.createElement("div");
      this.parentItem.style.position = "relative";
      this.parentItem.style.display = "inline-block";
      this.parentItem.style.cursor = "move";
      this.zoomIndex = zoomIndex;
      this.targetIndex = targetIndex;
      this.flag = true;
      if (!this.imageItem.zoom_Item_Flag) {
        this._init();
        this.imageItem.zoom_Item_Flag = true;
      }
    }

    _createCover() {
      let cover = document.createElement("div");
      cover.classList.add("zoom_img_cover");
      this.cover = cover;
    }

    _initCover() {
      this.cover.style.width = `${
        this.imageItem.offsetWidth / this.zoomIndex
      }px`;
      this.cover.style.height = `${
        this.imageItem.offsetHeight / this.zoomIndex
      }px`;
      this.cover.classList.add("zoom_hide");
      this.parentItem.append(this.cover);
    }

    _createTarget() {
      let target = document.createElement("div");
      target.classList.add("zoom_img_target");
      this.target = target;
    }

    _initTarget() {
      let tempWidth = this.imageItem.offsetWidth / this.targetIndex;
      let tempHeight = this.imageItem.offsetHeight / this.targetIndex;

      this.target.style.width = `${tempWidth}px`;
      this.target.style.height = `${tempHeight}px`;

      this.target.baseSize = `${
        tempWidth > tempHeight ? tempHeight : tempWidth
      }`;

      this.target.style.clipPath = `circle(${
        this.target.baseSize / this.targetIndex / 2
      }px at 50% 50%)`;
      this.target.classList.add("zoom_hide");
      this.target.style.backgroundImage = "url(" + imgSrc + ")";
      this.target.style.backgroundSize = `${
        (this.imageItem.offsetWidth * this.zoomIndex) / this.targetIndex
      }px ${
        (this.imageItem.offsetHeight * this.zoomIndex) / this.targetIndex
      }px`;
      this.cover.append(this.target);
    }

    _createTargetBorder() {
      let targetBorder = document.createElement("div");
      targetBorder.classList.add("zoom_img_target_border");
      this.targetBorder = targetBorder;
    }

    _initTargetBorder() {
      this.targetBorder.style.width = `${
        this.target.baseSize / this.targetIndex
      }px`;
      this.targetBorder.style.height = `${
        this.target.baseSize / this.targetIndex
      }px`;
      this.target.append(this.targetBorder);
    }

    _change(e) {
      this.lastX = this.x;
      this.lastY = this.y;
      let left = e.clientX - this.x - this.cover.offsetWidth / 2;
      let top = e.clientY - this.y - this.cover.offsetHeight / 2;
      if (left < 0) {
        left = 0;
      }
      if (left + this.cover.offsetWidth >= this.imageItem.offsetWidth) {
        left = this.imageItem.offsetWidth - this.cover.offsetWidth;
      }
      if (top < 0) {
        top = 0;
      }
      if (top + this.cover.offsetHeight >= this.imageItem.offsetHeight) {
        top = this.imageItem.offsetHeight - this.cover.offsetHeight;
      }
      this.left = left;
      this.top = top;
      this.cover.style.left = `${left}px`;
      this.cover.style.top = `${top}px`;
      this.target.style.backgroundPosition = `${
        (-left * this.zoomIndex) / this.targetIndex
      }px ${(-top * this.zoomIndex) / this.targetIndex}px`;
    }

    _initParent() {
      let width = parseFloat(getComputedStyle(this.imageItem)["width"]);
      this.imageItem.parentElement.replaceChild(
        this.parentItem,
        this.imageItem
      );
      this.parentItem.append(this.imageItem);
      this.parentItem.style.width = `${width}px`;
      this.imageItem.style.width = `${width}px`;
    }

    _init() {
      this._createCover();
      this._createTarget();
      this._createTargetBorder();
      this._initCover();
      this._initTarget();
      this._initTargetBorder();
      this._initParent();
      this.x = this.parentItem.getBoundingClientRect().left;
      this.y = this.parentItem.getBoundingClientRect().top;
      let functionChange = this._change.bind(this);
      this.parentItem.addEventListener("mouseenter", (e) => {
        if (this.flag) {
          this.flag = false;
          this.cover.classList.remove("zoom_hide");
          this.target.classList.remove("zoom_hide");
          this.parentItem.addEventListener("mousemove", functionChange);
        }
      });
      this.parentItem.addEventListener("mouseleave", (e) => {
        if (!this.flag) {
          this.flag = true;
          this.cover.classList.add("zoom_hide");
          this.target.classList.add("zoom_hide");
          this.parentItem.removeEventListener("mousemove", functionChange);
        }
      });
      scrollAble.addEventListener(
        "scroll",
        (this.scrollFunc = () => void img._reInit())
      );
    }

    _reInit() {
      this.x = this.parentItem.getBoundingClientRect().left;
      this.y = this.parentItem.getBoundingClientRect().top;
      let left = this.left + (this.lastX - this.x);
      let top = this.top + (this.lastY - this.y);
      if (left < 0) {
        left = 0;
      }
      if (left + this.cover.offsetWidth >= this.parentItem.offsetWidth) {
        left = this.parentItem.offsetWidth - this.cover.offsetWidth;
      }
      if (top < 0) {
        top = 0;
      }
      if (top + this.cover.offsetHeight >= this.parentItem.offsetHeight) {
        top = this.parentItem.offsetHeight - this.cover.offsetHeight;
      }
      this.cover.style.left = `${left}px`;
      this.cover.style.top = `${top}px`;
      this.target.style.backgroundPosition = `${
        (-left * this.zoomIndex) / this.targetIndex
      }px ${(-top * this.zoomIndex) / this.targetIndex}px`;
    }

    destory() {
      let img = this.imageItem;
      let parent = this.parentItem.parentElement;
      parent.replaceChild(img, this.parentItem);
      Array.from(this.parentItem.children).forEach((it) => it.remove());
      this.parentItem.remove();
      scrollAble.removeEventListener("scroll", this.scrollFunc);
      img.zoom_Item_Flag = false;
      img.style.userSelect = "auto";
    }
  }

  var img;

  src.addEventListener("load", () => {
    if (!img) {
      img = new Image(src, zoomIndex, index);
    }
  });

  if (!img) {
    img = new Image(src, zoomIndex, index);
  }
  return img;
}

export default zoom;
