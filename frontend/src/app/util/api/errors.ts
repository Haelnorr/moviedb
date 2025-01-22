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
