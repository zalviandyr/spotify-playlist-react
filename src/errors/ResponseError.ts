export class ResponseError extends Error {
  constructor(public statusCode: number, errorMessage?: string) {
    super(errorMessage);

    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}
