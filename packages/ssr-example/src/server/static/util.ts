import { getAllStateFileContent, manifestStaticPageFile } from "@server/util/webpackManifest";

export const getStaticPageManifest = () => getAllStateFileContent(manifestStaticPageFile("client"));
