import { MyReactFiberNode } from "../fiber";
export const mapFiber = (arrayLike, action) => {
    if (Array.isArray(arrayLike)) {
        arrayLike.forEach((f) => mapFiber(f, action));
    }
    else {
        if (arrayLike instanceof MyReactFiberNode) {
            action(arrayLike);
        }
    }
};
//# sourceMappingURL=mapFiber.js.map