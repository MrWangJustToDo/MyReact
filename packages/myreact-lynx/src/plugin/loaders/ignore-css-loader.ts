/**
 * Webpack loader to handle CSS on the Main Thread layer.
 *
 * Main-Thread bundles never contain user CSS — only the PAPI bootstrap code.
 * This loader checks if the source contains CSS Modules exports and either
 * preserves them or returns an empty export.
 */

type LoaderContext = {
  cacheable: (flag: boolean) => void;
};

export default function ignoreCssLoader(this: LoaderContext, source: string): string {
  this.cacheable(true);

  // If the source contains ___CSS_LOADER_EXPORT___, it has full CSS output
  // (not CSS Modules with exportOnlyLocals), so return empty export.
  if (source.includes("___CSS_LOADER_EXPORT___")) {
    return "export {}";
  }

  // Preserve CSS Modules class name exports.
  return source;
}
