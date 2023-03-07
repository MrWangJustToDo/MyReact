// import { createRender } from "@my-react/react-reconciler";

// import { append, create, update } from "@my-react-dom-server";
// import { safeCallWithFiber } from "@my-react-dom-shared";

// import { defaultResolveLazyElement } from "./api/lazy";

// import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";

// const MyWeakMap = typeof WeakMap === "undefined" ? Map : WeakMap;

// const elementTypeMap = new MyWeakMap<MyReactFiberNode, boolean>();

// const { CustomRenderController, CustomRenderDispatch, CustomRenderScope } = createRender({
//   patchToFiberInitial(_fiber) {
//     let isSVG = _fiber.parent ? elementTypeMap.get(_fiber.parent) : false;
//     if (!isSVG && _fiber.elementType === "svg") {
//       isSVG = true;
//     }
//     elementTypeMap.set(_fiber, isSVG);
//   },
//   reconcileCommit(_fiber) {
//     const mountLoop = (_fiber: MyReactFiberNode, _parentFiberWithDom: MyReactFiberNode) => {
//       const _isSVG = elementTypeMap.get(_fiber);

//       safeCallWithFiber({ fiber: _fiber, action: () => create(_fiber) });

//       safeCallWithFiber({ fiber: _fiber, action: () => update(_fiber, _isSVG) });

//       safeCallWithFiber({
//         fiber: _fiber,
//         action: () => append(_fiber, _parentFiberWithDom),
//       });

//       if (_fiber.child) {
//         mountLoop(_fiber.child, _fiber.node ? _fiber : _parentFiberWithDom);
//       }

//       if (_fiber.sibling) {
//         mountLoop(_fiber.sibling, _parentFiberWithDom);
//       }
//     };

//     mountLoop(_fiber, _fiber);
//   },
//   reconcileUpdate(_list) {
//     void 0;
//   },
//   triggerUpdate(_fiber) {
//     void 0;
//   },
//   triggerError(_fiber, _error) {
//     throw _error;
//   },
// });

// class ServerRenderDispatch extends CustomRenderDispatch {
//   resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
//     return defaultResolveLazyElement(_fiber);
//   }
// }

// export { CustomRenderController, CustomRenderScope, ServerRenderDispatch };
