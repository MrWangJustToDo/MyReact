import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { TYPEKEY, Element, Consumer, ForwardRef, Fragment, Lazy, Memo, Provider, Suspense, Context } from "@my-react/react-shared";

import type {
  MyReactElementNode,
  MyReactElement,
  MaybeArrayMyReactElementNode,
  forwardRef,
  lazy,
  memo,
  MyReactObjectComponent,
  ArrayMyReactElementNode,
} from "@my-react/react";

const { currentRenderPlatform, currentComponentFiber } = __my_react_internal__;

const { enableOptimizeTreeLog } = __my_react_shared__;

export function isValidElement(element?: MyReactElementNode | any): element is MyReactElement {
  return typeof element === "object" && !Array.isArray(element) && element !== null && element?.[TYPEKEY] === Element;
}

const keysMap = {};

const checkValidKey = (children: ArrayMyReactElementNode) => {
  const obj: Record<string, boolean> = {};

  const renderPlatform = currentRenderPlatform.current;

  const currentFiber = currentComponentFiber.current;

  const validElement = children.filter((c) => isValidElement(c)) as MyReactElement[];

  if (validElement.length) {
    validElement.forEach(function checkSingleElementValidKey(c) {
      if (!c._store?.["validKey"]) {
        if (typeof c.key === "string") {
          if (obj[c.key]) {
            const renderTree = renderPlatform.getFiberTree(currentFiber);

            if (!keysMap[renderTree]) console.warn(`[@my-react/react] array child have duplicate key ${c.key}`);

            keysMap[renderTree] = true;
          }

          obj[c.key] = true;
        } else {
          const renderTree = renderPlatform.getFiberTree(currentFiber);

          if (!keysMap[renderTree]) console.warn(`[@my-react/react] each array child must have a unique key props`);

          keysMap[renderTree] = true;
        }
        if (c._store) {
          c._store["validKey"] = true;
        }
      }
    });
  }
};


const optimizes: boolean[] = [];

const pushOptimizes = (optimize: boolean) => {
  optimizes.push(enableOptimizeTreeLog.current);

  enableOptimizeTreeLog.current = optimize;
}

const popOptimizes = () => {
  enableOptimizeTreeLog.current = optimizes.pop() || false;
}

/**
 * @internal
 */
export const checkSingleChildrenKey = (children: MaybeArrayMyReactElementNode) => {
  pushOptimizes(false);

  if (Array.isArray(children)) {
    checkValidKey(children);
  } else {
    if (isValidElement(children) && children._store) children._store["validKey"] = true;
  }

  popOptimizes();
};

/**
 * @internal
 */
export const checkArrayChildrenKey = (children: MyReactElementNode[]) => {
  children.forEach(checkSingleChildrenKey);
};

/**
 * @internal
 */
export const checkValidElement = (element: MyReactElementNode) => {
  pushOptimizes(false);

  if (isValidElement(element)) {
    if (!element._store?.["validType"]) {
      const rawType = element.type;

      if (element.ref && typeof element.ref !== "object" && typeof element.ref !== "function") {
        console.error(`[@my-react/react] invalid ref type, ref should be a function or a object like {current:  any}, but got a ${element.ref}`);
      }

      if (element.key && typeof element.key !== "string") {
        console.error(`[@my-react/react] invalid key type, key should be a string, but got a ${element.key}`);
      }

      if (typeof rawType === "object" && rawType !== null) {
        const typedRawType = rawType as MyReactObjectComponent;
        // check <Context.Consumer />
        if (typedRawType[TYPEKEY] === Consumer) {
          const props = element.props;

          for (const key in props) {
            if (key !== "key" && key !== "children" && !key.startsWith("_")) {
              console.warn(`[@my-react/react] <Context.Consumer /> element only support 'key' / 'children' props, but got ${key}`);
            }
          }

          if (!props?.children) {
            throw new Error(`[@my-react/react] <Context.Consumer /> need a render function as children, this is unsupported usage`);
          }

          if (typeof props.children !== "function") {
            throw new Error(`[@my-react/react] <Context.Consumer /> expect a render function as children but got ${props.children}, this is unsupported usage`);
          }

          if (props.children?.prototype?.isMyReactComponent) {
            throw new Error(
              `[@my-react/react] invalid render type for <Context.Consumer />, expect a render function but got a class element ${props.children}`
            );
          }
        }
        // check <Context />
        else if (typedRawType[TYPEKEY] === Context) {
          // throw new Error(
          //   `[@my-react/react] look like you are using Context like <Context />, this is unsupported usage, please use <Context.Provider /> or <Context.Consumer />`
          // );
          const props = element.props;

          for (const key in props) {
            if (key !== "key" && key !== "children" && key !== "value" && !key.startsWith("_")) {
              console.warn(`[@my-react/react] <Context /> element only support 'key' / 'value' / 'children' props, but got ${key}`);
            }
          }
        }
        // check <Context.Provider />
        else if (typedRawType[TYPEKEY] === Provider) {
          const props = element.props;

          for (const key in props) {
            if (key !== "key" && key !== "children" && key !== "value" && !key.startsWith("_")) {
              console.warn(`[@my-react/react] <Context.Provider /> element only support 'key' / 'value' / 'children' props, but got ${key}`);
            }
          }
        }
        // check forwardRef()
        else if (typedRawType[TYPEKEY] === ForwardRef) {
          const CurrentTypedRawType = rawType as ReturnType<typeof forwardRef>;

          const targetRender = CurrentTypedRawType.render;
          if (typeof targetRender !== "function") {
            throw new Error(`[@my-react/react] 'forwardRef()' expect a render function but got ${targetRender}, this is unsupported usage`);
          }

          if (targetRender.prototype?.isMyReactComponent) {
            throw new Error(`[@my-react/react] invalid render type for 'forwardRef()', expect a render function, but got a element class ${targetRender}`);
          }
        }
        // check memo()
        else if (typedRawType[TYPEKEY] === Memo) {
          const CurrentTypedRawType = rawType as ReturnType<typeof memo>;

          if (typeof CurrentTypedRawType.render === "object") {
            if (isValidElement(CurrentTypedRawType.render)) {
              throw new Error(`[@my-react/react] look like you are using memo like memo(<Foo />), this is unsupported usage, please change to memo(Foo)`);
            }
            if (CurrentTypedRawType.render[TYPEKEY] === Memo) {
              throw new Error(
                `[@my-react/react] look like you are using memo like memo(memo(Foo)), this is unsupported usage, please do not wrapper memo more than once`
              );
            }
            if (CurrentTypedRawType.render[TYPEKEY] === Lazy) {
              throw new Error(`[@my-react/react] look like you are using memo like memo(lazy(loader fun)), this is unsupported usage`);
            }
            if (CurrentTypedRawType.render[TYPEKEY] === Context) {
              throw new Error(`[@my-react/react] look like you are using memo like memo(Context), this is unsupported usage`);
            }
          } else if (typeof CurrentTypedRawType.render !== "function") {
            throw new Error(
              `[@my-react/react] invalid render type for 'memo()', expect a render function or a render object, but got a ${CurrentTypedRawType.render}`
            );
          }
        }
        // check lazy()
        else if (typedRawType[TYPEKEY] === Lazy) {
          const CurrentTypedRawType = rawType as ReturnType<typeof lazy>;

          const targetRender = CurrentTypedRawType.loader;

          if (typeof targetRender !== "function") {
            throw new Error(`[@my-react/react] invalid argument for lazy(loader), the loader expect a function, but got a ${CurrentTypedRawType.loader}`);
          }

          if (targetRender.prototype?.isMyReactComponent) {
            throw new Error(
              `[@my-react/react] invalid argument for lazy(loader), the loader expect a function, but got a element class ${CurrentTypedRawType.loader}`
            );
          }
        }
        // check invalid object element
        else {
          throw new Error(`[@my-react/react] invalid object element type, current type is: ${typedRawType}`);
        }
      } else {
        if (rawType === Fragment) {
          for (const key in element.props) {
            if (key !== "key" && key !== "children" && key !== "wrap" && !key.startsWith("_")) {
              console.warn(`[@my-react/react] <Fragment /> element only support 'key' / 'children' props, but got ${key}`);
            }
          }
        }
        if (rawType === Suspense) {
          for (const key in element.props) {
            if (key !== "key" && key !== "children" && key !== "fallback" && !key.startsWith("_")) {
              console.warn(`[@my-react/react] <Suspense /> element only support 'key' / 'children' / 'fallback' props, but got ${key}`);
            }
          }
        }
      }
    }
    if (element._store) {
      element._store["validType"] = true;
    }
  }

  popOptimizes();
};
