export class RenderError extends Error {
  constructor(message: string, readonly code: number) {
    super(message);
  }
}
