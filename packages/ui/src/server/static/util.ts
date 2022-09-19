import { getAllStateFileContent, manifestStaticPageFile } from "@server/util/manifest";

export const getStaticPageManifest = () => getAllStateFileContent(manifestStaticPageFile("client"));
