import { getAllStateFileContent, manifestStaticPageFile } from "../util/webpackManifest";

export const getStaticPageManifest = () => getAllStateFileContent(manifestStaticPageFile("client"));
