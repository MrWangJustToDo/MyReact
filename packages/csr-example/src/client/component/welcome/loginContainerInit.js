import axios from "axios";
import jquery from "jquery";
import { delay } from "../tools/requestData";

function judgeInput(inputEle, regExp) {
  if (typeof regExp == "string") {
    regExp = new RegExp(regExp);
  }
  return regExp.test(inputEle.val());
}

function tagFlag(item, targetItem, action) {
  action(item, targetItem);
}

// 加载验证码图片
function loadImg(imgUrl, strUrl, imageEle) {
  // 页面加载完成后再加载图片, 加载图片完成后再加载验证码提示
  new Promise((resolve) => {
    imageEle.off("click");
    imageEle.attr("src", `/${imgUrl}?time=${Date.now()}`);
    imageEle.on("click", () => {
      loadImg(imgUrl, strUrl, imageEle);
    });
    imageEle.on("load", () => {
      resolve(imageEle);
    });
  })
    .then((value) =>
      axios
        .get(strUrl)
        .then((res) => res.data)
        .then((data) => value.attr("title", data.state))
    )
    .catch((e) => console.log("出现错误", e));
}

// 输入验证
function formCheck(inputs, optList, success_callback, fail_callback) {
  let count = 0;
  inputs.forEach((it, index) => {
    it.prop("ready", false);
    let ready = false;
    let check = delay(() => {
      if (judgeInput(it, optList[index]["regexp"])) {
        if (!it.prop("ready")) {
          it.prop("ready", true);
          count++;
        }
        successEle(it, optList[index]["success"]);
      } else {
        if (it.prop("ready")) {
          it.prop("ready", false);
          count--;
        }
        failEle(it, optList[index]["fail"]);
      }
      if (count === inputs.length) {
        if (!ready) {
          ready = true;
          success_callback();
        }
      } else {
        ready = false;
        fail_callback();
      }
    }, 600);
    it.on("input", check);
  });
}

// 重置验证
function resetNode(ele) {
  ele.removeClass("login-check-success").removeClass("login-check-fail");
  ele.children(".login-check-msg").remove();
}

// 验证成功
function successEle(ele, msg) {
  msg = msg || "成功";
  tagFlag(ele, ele.parent(), (ele, parent) => {
    if (!parent.prop("status")) {
      parent.prop("status", true);
      resetNode(parent);
      parent.addClass("login-check-success");
      let span = document.createElement("span");
      span = jquery(span);
      span.addClass("login-check-msg").text(msg);
      parent.append(span);
    }
  });
}

// 验证失败
function failEle(ele, msg) {
  msg = msg || "失败";
  tagFlag(ele, ele.parent(), (ele, parent) => {
    if (parent.prop("status") || parent.prop("status") === undefined) {
      parent.prop("status", false);
      resetNode(parent);
      parent.addClass("login-check-fail");
      let span = document.createElement("span");
      span = jquery(span);
      span.addClass("login-check-msg").text(msg);
      parent.append(span);
    }
  });
}

export { loadImg, formCheck };
