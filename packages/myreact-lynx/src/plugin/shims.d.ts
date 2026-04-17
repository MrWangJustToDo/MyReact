declare module "@lynx-js/react/transform" {
  type TransformError = { text: string };

  type TransformResult = {
    code: string;
    errors: TransformError[];
  };

  export function transformReactLynxSync(source: string, options: Record<string, unknown>): TransformResult;
}
