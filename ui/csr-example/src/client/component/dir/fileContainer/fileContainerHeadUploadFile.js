import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { uploadFile } from "../../tools/requestData";

// 上传文件
function FileContainerHeadUpdataFile() {
  let ref = useRef();
  let link = useRef();
  let dispatch = useDispatch();
  let location = useLocation();
  let [disable, setDisable] = useState(false);
  let { data, msgState, msgType, currentRequestPath } = useSelector((state) => state);

  let updateHandler = useCallback(() => {
    // 构造formData
    let uploadData = new FormData();
    // 传上的路径
    uploadData.append("uploadFolder", data.relativePath);
    // 上传的文件
    uploadData.append("file", ref.current.files[0]);
    // 文件名
    let fileName = ref.current.files[0].name.split(/\s+/).join("");
    // 不可再次点击上传
    setDisable(true);
    uploadFile(ref.current.parentElement, uploadData).then((res) => {
      if (res.code === 0) {
        let relativePath = data.relativePath ? data.relativePath + "/" + fileName : fileName;
        ref.current.parentElement.style.backgroundImage = "none";
        dispatch({
          type: "uploadFileSuccess",
          isSamePath: false,
          currentRequestPath,
          relativePath: relativePath,
        });
      } else {
        ref.current.parentElement.style.backgroundImage = "none";
        dispatch({
          type: "setMsgOption",
          msgType: "uploadFile",
          currentRequestPath,
          msgContent: " 上传文件失败,文件已经存在或者空间不足 ",
        });
        dispatch({ type: "enableMsg" });
      }
      setDisable(false);
      ref.current.value = "";
    });
  }, [data, currentRequestPath, dispatch, setDisable]);

  useEffect(() => {
    if (msgState && msgType === "uploadFile" && link.current) {
      link.current.click();
    }
  }, [msgState, msgType]);

  return (
    <label className="inline-flex-center" htmlFor="upload">
      {msgState && <Link className="none" to={{ pathname: "/msg", state: { background: location } }} ref={link}></Link>}
      <i className="block fas fa-file-upload"></i>
      上传
      <input className="fm-header-btnUpload" type="file" id="upload" onChange={updateHandler} ref={ref} disabled={disable} />
    </label>
  );
}

export default FileContainerHeadUpdataFile;
