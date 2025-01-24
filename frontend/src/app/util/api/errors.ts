export function apiErrorAsValue(err: Error) {
  var error;
  if (err instanceof Unauthorized) {
    error = "Unauthorized";
  } else if (err instanceof ServiceUnavailable) {
    error = "ServiceUnavailable";
  } else if (err instanceof BadRequest) {
    error = "BadRequest";
  } else if (err instanceof Forbidden) {
    error = "Forbidden";
  } else if (err instanceof NotFound) {
    error = "NotFound";
  } else if (err instanceof MethodNotAllowed) {
    error = "MethodNotAllowed";
  } else if (err instanceof UnprocessableContent) {
    error = "UnprocessableContent";
  } else if (err instanceof InternalServerError) {
    error = "InternalServerError";
  } else if (err instanceof APIError) {
    error = `Unhandled API Error: ${err.message}`;
  } else {
    error = "Unknown";
    console.error(err);
  }
  return error;
}
export class APIError extends Error {
  constructor(message: string) {
    super(`Unhandled API Error ${message}`);
    this.name = "APIError";
  }
}
export class BadRequest extends APIError {
  constructor() {
    super("400 Bad Request");
    this.name = "BadRequest";
  }
  code = 400;
}
export class Unauthorized extends APIError {
  constructor() {
    super("401 Unauthorized");
    this.name = "Unauthorized";
  }
  code = 401;
}
export class Forbidden extends APIError {
  constructor() {
    super("403 Forbidden");
    this.name = "Forbidden";
  }
}
export class NotFound extends APIError {
  constructor() {
    super("404 Not Found");
    this.name = "NotFound";
  }
}
export class MethodNotAllowed extends APIError {
  constructor() {
    super("405 Method Not Allowed");
    this.name = "MethodNotAllowed";
  }
}
export class UnprocessableContent extends APIError {
  constructor() {
    super("422 Unprocessable Content");
    this.name = "UnprocessableContent";
  }
}
export class InternalServerError extends APIError {
  constructor() {
    super("500 Internal Server Error");
    this.name = "InternalServerError";
  }
  code = 500;
}
export class ServiceUnavailable extends APIError {
  constructor() {
    super("503 Service Unavailable");
    this.name = "Unavailable";
  }
  code = 503;
}
