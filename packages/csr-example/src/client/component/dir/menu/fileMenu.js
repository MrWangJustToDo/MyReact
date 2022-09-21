import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import jquery from "jquery";
import { promiseNext } from "../../tools/tools";
import FileMenuRenameItem from "./fileMenuRenameItem";
import FileMenuMoveItem from "./fileMenuMoveItem";
import FileMenuEditorItem from "./fileMenuEditorItem";
import FileMenuCopyItem from "./fileMenuCopyItem";
import FileMenuDeleteItem from "./fileMenuDeleteItem";

// 文件右键菜单
function FileMenu() {
  let ref = useRef();
  let dispatch = useDispatch();
  let { menuPosition, menuState, menuType } = useSelector((state) => state);

  // 菜单的显示与隐藏
  useEffect(() => {
    let currentMenu = jquery(ref.current);
    if (menuState === true) {
      currentMenu
        .css("left", menuPosition.x)
        .css(
          "top",
          currentMenu.height() + menuPosition.y + 10 > document.body.offsetHeight ? document.body.offsetHeight - currentMenu.height() - 10 : menuPosition.y
        );
    } else if (menuState === "padding") {
      promiseNext(0, () => {
        currentMenu.removeClass("animate__zoomIn").addClass("animate__zoomOut");
      }).then(() =>
        promiseNext(300, () => {
          dispatch({ type: "menuHide" });
        })
      );
    }
  }, [menuPosition, menuState, dispatch]);

  return (
    <div className="fm-contextmenu fixed animate__animated animate__zoomIn animate__faster" ref={ref}>
      <ul className="fm-context-ul">
        {menuType === "file" && <FileMenuEditorItem />}
        {menuType !== "body" && <FileMenuRenameItem />}
        {menuType !== "dir" && <FileMenuCopyItem />}
        {menuType !== "body" && <FileMenuMoveItem />}
        {menuType !== "body" && <FileMenuDeleteItem />}
      </ul>
    </div>
  );
}

export default FileMenu;
