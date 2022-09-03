class ServerError extends Error {
  constructor(message: string, readonly code: number) {
    super(message);
  }
}

export { ServerError };
