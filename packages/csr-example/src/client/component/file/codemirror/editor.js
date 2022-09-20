import { useRef, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import jquery from "jquery";
import codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/htmlembedded/htmlembedded";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/python/python";
import { option } from "./codemirrorOption";
import EditorCloseButton from "./editorCloseButton";
import Load from "./editorLoad";
import { promiseNext } from "../../tools/tools";
import { axiosPost } from "../../tools/requestData";

// 文本编辑器
function Ediotr() {
  let ref = useRef();
  let load = useRef();
  const { 0: path, id } = useParams();
  const [code, setCode] = useState(null);
  const [editable, setEditable] = useState(true);
  let { data, editableLength } = useSelector((state) => state);
  let dispatch = useDispatch();

  // 初始化编辑器
  useEffect(() => {
    let code = codemirror.fromTextArea(ref.current, option);
    code.setSize("auto", "100%");
    setCode(code);
  }, []);
  // 加载内容
  useEffect(() => {
    if (code) {
      let { fileTypeExtention, length } = data.files.filter((it) => it.id === +id)[0];
      if (fileTypeExtention) {
        code.setOption("mode", fileTypeExtention);
      }
      // 获取过渡元素
      let loadItem = jquery(load.current);
      if (length > editableLength) {
        setEditable(false);
        promiseNext(500, () => {
          loadItem.css("height", 0);
        })
          .then(() =>
            promiseNext(100, () => {
              loadItem.children("div").remove();
            })
          )
          .then(() =>
            promiseNext(420, () => {
              loadItem.remove();
            })
          )
          .then(() => {
            code.setValue(" 文件内容过大,不支持预览 ");
          });
      } else {
        axiosPost("/api/file/", { requestPath: path })
          .then((data) => {
            promiseNext(500, () => {
              loadItem.css("height", 0);
            })
              .then(() =>
                promiseNext(100, () => {
                  loadItem.children("div").remove();
                })
              )
              .then(() =>
                promiseNext(420, () => {
                  loadItem.remove();
                })
              )
              .then(() => {
                code.setValue(data.toString());
              });
          })
          .catch((e) => {
            code.setValue(e.toString());
          });
      }
    }
    return () => code && code.setValue("");
  }, [data, code, path, id, editableLength, setEditable]);
  // 保存按钮点击
  let saveHandler = useCallback(() => {
    dispatch({
      type: "saveEditorItem",
      relativePath: path,
      fileContentCache: code.getValue(),
    });
  }, [path, code, dispatch]);

  return (
    <div className="editor-cover height-inherit relative animate__animated animate__fadeInUp animate__faster">
      <div className="editor relative">
        <Load foRef={load} />
        <textarea className="code" name="code" ref={ref}></textarea>
      </div>
      <div className="btns absolute inline-flex">
        {editable && <EditorCloseButton title="保存" click={saveHandler} />}
        <EditorCloseButton title="退出" />
      </div>
    </div>
  );
}
export default Ediotr;
