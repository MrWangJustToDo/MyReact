import mime from "mime";
function filterDefault(path) {
  return true;
}
// 文件过滤
function filterText(item) {
  try {
    return mime.getType(item).startsWith("text");
  } catch (e) {
    return true;
  }
}
// 图片过滤
function filterImg(item) {
  try {
    return mime.getType(item).startsWith("image");
  } catch (e) {
    return true;
  }
}
// 视频过滤
function filterVideo(item) {
  try {
    return mime.getType(item).startsWith("video");
  } catch (e) {
    return true;
  }
}

export { filterDefault, filterText, filterImg, filterVideo };
