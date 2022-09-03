import { isAppCrash, isHydrateRender, isServerRender } from "./env";
export const cannotUpdate = () => {
    if (isServerRender.current)
        throw new Error("can not update component during SSR");
    if (isHydrateRender.current)
        throw new Error("can not update component during hydrate");
    if (isAppCrash.current)
        return true;
    if (typeof window === "undefined")
        return false;
    return true;
};
//# sourceMappingURL=cannotUpdate.js.map