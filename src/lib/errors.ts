/**
 * HttpError is a convenient way to throw errors with an HTTP status code.
 * any catch block can detect the status code and return the appropriate
 * response without leaking implementation details.
 */
export class HttpError extends Error {
  public status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
