import axios from "axios";
import jquery from "jquery";
import { delay } from "../tools/requestData";

function judgeInput(inputEle, regExp) {
  if (typeof regExp == "string") {
    regExp = new RegExp(regExp);
  }
  return regExp.test(inputEle.val());
}

function registerEle(
  checkUrl,
  eleList,
  optList,
  successCallback,
  failCallback
) {
  eleList.forEach((it, index) => {
    let check = delay((e) => {
      let val = e.target.value;
      if (val !== "") {
        if (judgeInput(it, optList[index]["regexp"])) {
          if (optList[index]["onlineCheck"]) {
            axios
              .get(`${checkUrl}?${it.attr("name")}=${it.val()}`)
              .then((res) => res.data)
              .then((data) => {
                if (data.code === 0) {
                  successEle(it, optList[index]["success"], () => {
                    if (eleList.every((it) => it.prop("status") === true)) {
                      successCallback();
                    } else {
                      failCallback();
                    }
                  });
                } else {
                  failEle(it, data.state, failCallback);
                }
              });
          } else {
            successEle(it, optList[index]["success"], () => {
              if (eleList.every((it) => it.prop("status") === true)) {
                successCallback();
              } else {
                failCallback();
              }
            });
          }
        } else {
          failEle(it, optList[index]["fail"], failCallback);
        }
      } else {
        failEle(it, "不能为空", failCallback);
      }
    }, 500);
    it.on("input", check);
  });
}

function successEle(element, msg, callBack) {
  msg = msg || "正确";
  if (!element.prop("status")) {
    element.parent().children("span").remove();
    element
      .parent()
      .removeClass("register-check-fail")
      .addClass("register-check-success");
    element.prop("status", true);
    let span = document.createElement("span");
    span = jquery(span);
    span.addClass("register-check-msg");
    span.text(msg);
    element.parent().append(span);
  }
  if (callBack && typeof callBack == "function") {
    callBack();
  }
}

function failEle(element, msg, callBack) {
  msg = msg || "错误";
  if (element.prop("status") || element.prop("status") === undefined) {
    element.parent().children("span").remove();
    element
      .parent()
      .removeClass("register-check-success")
      .addClass("register-check-fail");
    element.prop("status", false);
    let span = document.createElement("span");
    span = jquery(span);
    span.addClass("register-check-msg");
    span.text(msg);
    element.parent().append(span);
  } else {
    element.parent().children("span").text(msg);
  }
  if (callBack && typeof callBack == "function") {
    callBack();
  }
}

export { registerEle };
