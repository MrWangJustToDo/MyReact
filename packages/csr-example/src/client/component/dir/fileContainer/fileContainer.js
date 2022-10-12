import { useEffect, useRef, memo } from "react";
import { ReactReduxContext, useSelector } from "react-redux";
import jquery from "jquery";
import FileContainerHead from "./fileContainerHead";
import FileTable from "./table/fileTable";
import FileBlock from "./block/fileBlock";
import FileMenu from "../menu/fileMenu";
import { createReactive, createRef, KeepLive, __my_react_reactive__ } from "@my-react/react";
import { reactive, ref } from "@my-react/react-reactive";

// function FileContainer() {
//   let ref = useRef();

//   let { fileModelType, menuState } = useSelector((state) => state);

//   useEffect(() => {
//     let currentItem = jquery(ref.current);
//     currentItem.on("contextmenu", () => false);
//     return () => currentItem.off("contextmenu");
//   }, []);

//   return (
//     <div className="fm-table-container relative animate__animated animate__fadeIn animate__faster" ref={ref}>
//       <FileContainerHead />
//       {/* keepLive component will keep the dom/component/hook/reactive state */}
//       <KeepLive>{menuState && <FileMenu />}</KeepLive>
//       <KeepLive>{fileModelType === "table" ? <FileTable /> : <FileBlock />}</KeepLive>
//     </div>
//   );
// }

const { onMounted, onBeforeUpdate, onUnmounted } = __my_react_reactive__;

const FileContainer = createReactive({
  // myreact context type not same as react...
  contextType: ReactReduxContext,
  setup: (_, c) => {
    const contextRef = ref(c.store.getState());
    console.log(c);
    const domRef = createRef(null);
    let currentItem = null;
    let unSubscribe = null;

    onMounted(() => {
      unSubscribe = c.store.subscribe(() => {
        contextRef.value = c.store.getState();
      })
      currentItem = jquery(domRef.current);
      currentItem.on("contextmenu", () => false);
    });

    onBeforeUpdate(() => {
      // contextRef.value = c.store.getState();
    });

    onUnmounted(() => {
      unSubscribe?.();
      currentItem.off("contextmenu");
    });

    return { domRef, contextRef };
  },
  render: ({ domRef, contextRef: { menuState, fileModelType } }) => (
    <div className="fm-table-container relative animate__animated animate__fadeIn animate__faster" ref={domRef}>
      <FileContainerHead />
      {/* keepLive component will keep the dom/component/hook/reactive state */}
      <KeepLive>{menuState && <FileMenu />}</KeepLive>
      <KeepLive>{fileModelType === "table" ? <FileTable /> : <FileBlock />}</KeepLive>
    </div>
  ),
});

export default memo(FileContainer);
