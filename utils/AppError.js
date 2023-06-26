// AppError class is extend the default Error class (inherit the Error class)
class AppError extends Error {
    constructor(message, statusCode) {
        super(message) //if we extends an existing class we must call their constructor

        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // We implement that because it will help us to filter only the errors that we created with this Class
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;