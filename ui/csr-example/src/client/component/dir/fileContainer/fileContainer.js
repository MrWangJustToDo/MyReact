import { useEffect, useRef, memo, Fragment } from "react";
import { ReactReduxContext, useSelector } from "react-redux";
import jquery from "jquery";
import FileContainerHead from "./fileContainerHead";
import FileTable from "./table/fileTable";
import FileBlock from "./block/fileBlock";
import FileMenu from "../menu/fileMenu";

function FileContainer() {
  let ref = useRef();

  let { fileModelType, menuState } = useSelector((state) => state);

  useEffect(() => {
    let currentItem = jquery(ref.current);
    currentItem.on("contextmenu", () => false);
    return () => currentItem.off("contextmenu");
  }, []);

  return (
    <div className="fm-table-container relative animate__animated animate__fadeIn animate__faster" ref={ref}>
      <FileContainerHead />
      {/* keepLive component will keep the dom/component/hook/reactive state */}
      <>{menuState && <FileMenu />}</>
      <>{fileModelType === "table" ? <FileTable /> : <FileBlock />}</>
    </div>
  );
}

// const FileContainer = createReactive({
//   // myreact context type not same as react...
//   contextType: ReactReduxContext,
//   setup: (_, c) => {
//     const contextRef = ref(c.store.getState());
//     const reactiveDomRef = reactive({ current: null });
//     const domRef = createRef(null);
//     let currentItem = null;
//     let unSubscribe = null;

//     watch(
//       () => reactiveDomRef.current,
//       (newValue, oldValue) => {
//         console.log("reactiveDomRef update", newValue, oldValue);
//       }
//     );

//     onMounted(() => {
//       unSubscribe = c.store.subscribe(() => {
//         contextRef.value = c.store.getState();
//       });
//       currentItem = jquery(domRef.current);
//       currentItem.on("contextmenu", () => false);
//     });

//     onUnmounted(() => {
//       unSubscribe?.();
//       currentItem.off("contextmenu");
//     });

//     const setRef = (node) => {
//       domRef.current = node;
//       reactiveDomRef.current = node;
//     };

//     return { domRef, contextRef, setRef };
//   },
//   render: ({ setRef, contextRef: { menuState, fileModelType } }) => (
//     <div className="fm-table-container relative animate__animated animate__fadeIn animate__faster" ref={setRef}>
//       <FileContainerHead />
//       {/* keepLive component will keep the dom/component/hook/reactive state */}
//       <KeepLive>{menuState && <FileMenu />}</KeepLive>
//       <KeepLive>{fileModelType === "table" ? <FileTable /> : <FileBlock />}</KeepLive>
//     </div>
//   ),
// });

export default memo(FileContainer);
